"use client";

import { useEffect, useMemo, useState } from "react";
import type { HistoryPoint, HistoryRange, HistoryResponse } from "@/lib/types";

const WIDTH = 700;
const HEIGHT = 300;
const PAD = { top: 16, right: 16, bottom: 28, left: 40 };

// Limited to ranges that are genuinely directly comparable between
// platforms -- not every fidelity/interval combination either API offers.
const RANGE_OPTIONS: { value: HistoryRange; label: string }[] = [
  { value: "1h", label: "1H" },
  { value: "1d", label: "1D" },
  { value: "all", label: "ALL" },
];

// Sub-day ranges show a time of day; "all" shows a date -- a "Jul 26" axis
// label is useless when the whole chart spans one hour.
function isIntraday(range: HistoryRange): boolean {
  return range === "1h" || range === "1d";
}

function nearestPoint(points: HistoryPoint[], t: number): HistoryPoint | null {
  if (points.length === 0) return null;
  let closest = points[0];
  let closestDiff = Math.abs(points[0].t - t);
  for (const p of points) {
    const diff = Math.abs(p.t - t);
    if (diff < closestDiff) {
      closest = p;
      closestDiff = diff;
    }
  }
  return closest;
}

function formatAxisDate(t: number, range: HistoryRange): string {
  const d = new Date(t * 1000);
  if (isIntraday(range)) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function formatTooltipDate(t: number, range: HistoryRange): string {
  const d = new Date(t * 1000);
  if (isIntraday(range)) {
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function HistoryChart({
  data,
  candidateName,
  hasKalshi = true,
  hasPolymarket = true,
  historyUrlBase,
}: {
  data: HistoryResponse;
  candidateName: string;
  hasKalshi?: boolean;
  hasPolymarket?: boolean;
  /**
   * Base URL (slug + outcome, no &range=) for re-fetching at a different
   * range client-side. Omitted for settled markets, which only ever have
   * the one frozen snapshot baked at settlement -- no toggle renders then.
   */
  historyUrlBase?: string;
}) {
  const [range, setRange] = useState<HistoryRange>("all");
  const [chartData, setChartData] = useState<HistoryResponse>(data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (range === "all") {
      setChartData(data);
      return;
    }
    if (!historyUrlBase) return;

    let cancelled = false;
    setLoading(true);
    fetch(`${historyUrlBase}&range=${range}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: HistoryResponse | null) => {
        if (!cancelled && json) setChartData(json);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range, historyUrlBase, data]);

  const kalshi = chartData.kalshi ?? [];
  const polymarket = chartData.polymarket ?? [];
  const [hoverX, setHoverX] = useState<number | null>(null);

  const { minT, maxT, yMax, kalshiPath, polymarketPath } = useMemo(() => {
    const allPoints = [...kalshi, ...polymarket];
    if (allPoints.length === 0) {
      return { minT: 0, maxT: 1, yMax: 1, kalshiPath: "", polymarketPath: "" };
    }
    const ts = allPoints.map((p) => p.t);
    const ps = allPoints.map((p) => p.p);
    const minT = Math.min(...ts);
    const maxT = Math.max(...ts);
    const maxP = Math.max(...ps);
    const yMax = Math.min(1, Math.max(0.1, Math.ceil((maxP * 100) / 5) * 5 / 100));

    const xScale = (t: number) =>
      PAD.left + ((t - minT) / (maxT - minT || 1)) * (WIDTH - PAD.left - PAD.right);
    const yScale = (p: number) =>
      HEIGHT - PAD.bottom - (p / yMax) * (HEIGHT - PAD.top - PAD.bottom);

    const toPath = (points: HistoryPoint[]) =>
      [...points]
        .sort((a, b) => a.t - b.t)
        .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.t).toFixed(1)} ${yScale(p.p).toFixed(1)}`)
        .join(" ");

    return {
      minT,
      maxT,
      yMax,
      kalshiPath: toPath(kalshi),
      polymarketPath: toPath(polymarket),
    };
  }, [kalshi, polymarket]);

  const rangeToggle = historyUrlBase && (
    <div className="chart-range-toggle" role="tablist" aria-label="Chart time range">
      {RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={range === opt.value}
          className={`chart-range-btn${range === opt.value ? " chart-range-btn-active" : ""}`}
          onClick={() => setRange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  if (kalshi.length === 0 && polymarket.length === 0) {
    return (
      <section className="section">
        <div className="section-label">Price History</div>
        <div className="card">
          {rangeToggle}
          <div className="chart-empty">
            {loading
              ? "Loading…"
              : (
                <>
                  History unavailable right now
                  {chartData.kalshiError || chartData.polymarketError
                    ? ` (${chartData.kalshiError ?? chartData.polymarketError})`
                    : ""}
                  .
                </>
              )}
          </div>
        </div>
      </section>
    );
  }

  const xScale = (t: number) =>
    PAD.left + ((t - minT) / (maxT - minT || 1)) * (WIDTH - PAD.left - PAD.right);
  const yScale = (p: number) =>
    HEIGHT - PAD.bottom - (p / yMax) * (HEIGHT - PAD.top - PAD.bottom);

  const hoverT =
    hoverX === null
      ? null
      : minT + ((hoverX - PAD.left) / (WIDTH - PAD.left - PAD.right)) * (maxT - minT);
  const hoverKalshi = hoverT === null ? null : nearestPoint(kalshi, hoverT);
  const hoverPolymarket = hoverT === null ? null : nearestPoint(polymarket, hoverT);
  const crosshairX = hoverKalshi
    ? xScale(hoverKalshi.t)
    : hoverPolymarket
      ? xScale(hoverPolymarket.t)
      : null;

  const yTicks = [0, yMax / 2, yMax];

  return (
    <section className="section">
      <div className="section-label">Price History</div>
      <div className="card">
        {rangeToggle}
        <div className="chart-legend">
          {hasKalshi && (
            <span className="chart-legend-item">
              <span className="chart-swatch" style={{ background: "var(--kalshi)" }} />
              Kalshi
            </span>
          )}
          {hasPolymarket && (
            <span className="chart-legend-item">
              <span className="chart-swatch" style={{ background: "var(--polymarket)" }} />
              Polymarket
            </span>
          )}
        </div>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          width="100%"
          height="auto"
          role="img"
          aria-label={`Historical probability chart for ${candidateName} winning, on ${
            [hasKalshi && "Kalshi", hasPolymarket && "Polymarket"].filter(Boolean).join(" and ")
          }`}
          style={{ opacity: loading ? 0.5 : 1, transition: "opacity 150ms ease" }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
            setHoverX(Math.max(PAD.left, Math.min(WIDTH - PAD.right, x)));
          }}
          onMouseLeave={() => setHoverX(null)}
        >
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={yScale(tick)}
                y2={yScale(tick)}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={yScale(tick) + 4}
                fontSize={11}
                fill="var(--card-muted)"
                textAnchor="end"
              >
                {Math.round(tick * 100)}%
              </text>
            </g>
          ))}

          <text x={PAD.left} y={HEIGHT - 6} fontSize={11} fill="var(--card-muted)">
            {formatAxisDate(minT, range)}
          </text>
          <text x={WIDTH - PAD.right} y={HEIGHT - 6} fontSize={11} fill="var(--card-muted)" textAnchor="end">
            {formatAxisDate(maxT, range)}
          </text>

          {polymarketPath && (
            <path d={polymarketPath} fill="none" stroke="var(--polymarket)" strokeWidth={2} />
          )}
          {kalshiPath && (
            <path d={kalshiPath} fill="none" stroke="var(--kalshi)" strokeWidth={2} />
          )}

          {crosshairX !== null && (
            <line
              x1={crosshairX}
              x2={crosshairX}
              y1={PAD.top}
              y2={HEIGHT - PAD.bottom}
              stroke="var(--card-muted)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}
          {hoverKalshi && (
            <circle cx={xScale(hoverKalshi.t)} cy={yScale(hoverKalshi.p)} r={3.5} fill="var(--kalshi)" />
          )}
          {hoverPolymarket && (
            <circle
              cx={xScale(hoverPolymarket.t)}
              cy={yScale(hoverPolymarket.p)}
              r={3.5}
              fill="var(--polymarket)"
            />
          )}
        </svg>
        {(hoverKalshi || hoverPolymarket) && (
          <div className="brief-meta">
            {formatTooltipDate((hoverKalshi ?? hoverPolymarket)!.t, range)}
            {hoverKalshi ? ` · Kalshi ${(hoverKalshi.p * 100).toFixed(1)}%` : ""}
            {hoverPolymarket ? ` · Polymarket ${(hoverPolymarket.p * 100).toFixed(1)}%` : ""}
          </div>
        )}
      </div>
    </section>
  );
}
