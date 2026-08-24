"use client";

import { useEffect, useId, useMemo, useState } from "react";
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

function latestPoint(points: HistoryPoint[]): HistoryPoint | null {
  if (points.length === 0) return null;
  return points.reduce((latest, p) => (p.t > latest.t ? p : latest), points[0]);
}

// "all"/"1d" axis labels need the actual day, not just month+year -- a
// young market's whole history can sit inside one month, and a
// month+year-only label (e.g. "Aug '26") then renders identically at both
// ends, reading like a future day-of-month instead of the current year.
// Year is only appended when the range actually crosses a year boundary,
// since it's dead weight otherwise.
function formatAxisDate(t: number, range: HistoryRange, showYear: boolean): string {
  const d = new Date(t * 1000);
  if (isIntraday(range)) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString(
    "en-US",
    showYear ? { month: "short", day: "numeric", year: "2-digit" } : { month: "short", day: "numeric" }
  );
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
  // useId() includes colons (e.g. ":r0:"), which some browsers (Safari in
  // particular) fail to resolve inside a url(#id) paint-server reference --
  // strip them so the gradient fill can't silently go invisible.
  const gradientId = useId().replace(/:/g, "");
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

  const { minT, maxT, yMax, kalshiPath, polymarketPath, kalshiAreaPath, polymarketAreaPath } =
    useMemo(() => {
      const allPoints = [...kalshi, ...polymarket];
      if (allPoints.length === 0) {
        return {
          minT: 0,
          maxT: 1,
          yMax: 1,
          kalshiPath: "",
          polymarketPath: "",
          kalshiAreaPath: "",
          polymarketAreaPath: "",
        };
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
      const baselineY = yScale(0);

      const toPath = (points: HistoryPoint[]) =>
        [...points]
          .sort((a, b) => a.t - b.t)
          .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.t).toFixed(1)} ${yScale(p.p).toFixed(1)}`)
          .join(" ");

      // Same line, closed down to the baseline -- the soft gradient wash
      // under each line that makes the chart read as a filled trend rather
      // than a bare wire.
      const toAreaPath = (points: HistoryPoint[]) => {
        const sorted = [...points].sort((a, b) => a.t - b.t);
        if (sorted.length === 0) return "";
        const line = sorted
          .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.t).toFixed(1)} ${yScale(p.p).toFixed(1)}`)
          .join(" ");
        const lastX = xScale(sorted[sorted.length - 1].t).toFixed(1);
        const firstX = xScale(sorted[0].t).toFixed(1);
        return `${line} L ${lastX} ${baselineY.toFixed(1)} L ${firstX} ${baselineY.toFixed(1)} Z`;
      };

      return {
        minT,
        maxT,
        yMax,
        kalshiPath: toPath(kalshi),
        polymarketPath: toPath(polymarket),
        kalshiAreaPath: toAreaPath(kalshi),
        polymarketAreaPath: toAreaPath(polymarket),
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

  const latestKalshi = latestPoint(kalshi);
  const latestPolymarket = latestPoint(polymarket);

  // Readout defaults to the most recent point at rest, and swaps to the
  // scrubbed position on hover -- never a blank strip below the chart.
  const readoutKalshi = hoverX === null ? latestKalshi : hoverKalshi;
  const readoutPolymarket = hoverX === null ? latestPolymarket : hoverPolymarket;
  const readoutT = hoverT ?? Math.max(latestKalshi?.t ?? 0, latestPolymarket?.t ?? 0);

  const yTicks = [0, yMax / 2, yMax];
  const showYear = new Date(minT * 1000).getFullYear() !== new Date(maxT * 1000).getFullYear();

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
          <defs>
            <linearGradient id={`${gradientId}-kalshi`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--kalshi)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--kalshi)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${gradientId}-polymarket`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--polymarket)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--polymarket)" stopOpacity="0" />
            </linearGradient>
          </defs>

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
            {formatAxisDate(minT, range, showYear)}
          </text>
          <text x={WIDTH - PAD.right} y={HEIGHT - 6} fontSize={11} fill="var(--card-muted)" textAnchor="end">
            {formatAxisDate(maxT, range, showYear)}
          </text>

          {polymarketAreaPath && <path d={polymarketAreaPath} fill={`url(#${gradientId}-polymarket)`} />}
          {kalshiAreaPath && <path d={kalshiAreaPath} fill={`url(#${gradientId}-kalshi)`} />}

          {polymarketPath && (
            <path
              d={polymarketPath}
              fill="none"
              stroke="var(--polymarket)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {kalshiPath && (
            <path
              d={kalshiPath}
              fill="none"
              stroke="var(--kalshi)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
              opacity={0.6}
            />
          )}

          {/* Resting end-of-line markers -- anchor the chart on "right now"
              even when nothing is hovered. */}
          {latestKalshi && hoverX === null && (
            <g>
              <circle cx={xScale(latestKalshi.t)} cy={yScale(latestKalshi.p)} r={6} fill="var(--card)" />
              <circle cx={xScale(latestKalshi.t)} cy={yScale(latestKalshi.p)} r={3.5} fill="var(--kalshi)" />
            </g>
          )}
          {latestPolymarket && hoverX === null && (
            <g>
              <circle
                cx={xScale(latestPolymarket.t)}
                cy={yScale(latestPolymarket.p)}
                r={6}
                fill="var(--card)"
              />
              <circle
                cx={xScale(latestPolymarket.t)}
                cy={yScale(latestPolymarket.p)}
                r={3.5}
                fill="var(--polymarket)"
              />
            </g>
          )}

          {hoverKalshi && (
            <g>
              <circle cx={xScale(hoverKalshi.t)} cy={yScale(hoverKalshi.p)} r={6} fill="var(--card)" />
              <circle cx={xScale(hoverKalshi.t)} cy={yScale(hoverKalshi.p)} r={3.5} fill="var(--kalshi)" />
            </g>
          )}
          {hoverPolymarket && (
            <g>
              <circle
                cx={xScale(hoverPolymarket.t)}
                cy={yScale(hoverPolymarket.p)}
                r={6}
                fill="var(--card)"
              />
              <circle
                cx={xScale(hoverPolymarket.t)}
                cy={yScale(hoverPolymarket.p)}
                r={3.5}
                fill="var(--polymarket)"
              />
            </g>
          )}
        </svg>
        {(readoutKalshi || readoutPolymarket) && (
          <div className="chart-tooltip">
            <span className="chart-tooltip-date">{formatTooltipDate(readoutT, range)}</span>
            {readoutKalshi && (
              <span className="chart-tooltip-item">
                <span className="chart-tooltip-dot" style={{ background: "var(--kalshi)" }} />
                Kalshi
                <span className="chart-tooltip-value">{(readoutKalshi.p * 100).toFixed(1)}%</span>
              </span>
            )}
            {readoutPolymarket && (
              <span className="chart-tooltip-item">
                <span className="chart-tooltip-dot" style={{ background: "var(--polymarket)" }} />
                Polymarket
                <span className="chart-tooltip-value">{(readoutPolymarket.p * 100).toFixed(1)}%</span>
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
