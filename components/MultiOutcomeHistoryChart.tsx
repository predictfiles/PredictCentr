"use client";

import { useEffect, useMemo, useState } from "react";
import type { HistoryPoint, HistoryRange } from "@/lib/types";

const WIDTH = 700;
const HEIGHT = 300;
const PAD = { top: 16, right: 16, bottom: 28, left: 40 };

const LINE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
];

const RANGE_OPTIONS: { value: HistoryRange; label: string }[] = [
  { value: "1h", label: "1H" },
  { value: "1d", label: "1D" },
  { value: "all", label: "ALL" },
];

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

export interface ChartSeries {
  id: string;
  label: string;
  /** Kalshi price history -- this chart only ever plots one platform's line per outcome. */
  data: HistoryPoint[];
  /**
   * Base URL (slug + outcome, no &range=) for re-fetching this outcome's
   * Kalshi history at a different range client-side. Omitted for a settled
   * market, which only ever has the one frozen snapshot -- no toggle
   * renders then.
   */
  historyUrlBase?: string;
}

/**
 * Combined price-history chart for a market where every outcome is
 * Kalshi-only -- one line per outcome on a shared timeline, so you can see
 * crossover moments (a challenger overtaking the favorite) directly,
 * instead of mentally stitching together N separate single-line charts.
 * Only used when no outcome in the market has a Polymarket pairing --
 * see HistoryChart for the platform-vs-platform comparison case, which
 * this deliberately doesn't try to also show.
 */
export function MultiOutcomeHistoryChart({ series }: { series: ChartSeries[] }) {
  const [range, setRange] = useState<HistoryRange>("all");
  const [chartData, setChartData] = useState<Record<string, HistoryPoint[]>>(() =>
    Object.fromEntries(series.map((s) => [s.id, s.data]))
  );
  const [loading, setLoading] = useState(false);

  const canToggleRange = series.some((s) => s.historyUrlBase);

  useEffect(() => {
    if (range === "all") {
      setChartData(Object.fromEntries(series.map((s) => [s.id, s.data])));
      return;
    }
    if (!canToggleRange) return;

    let cancelled = false;
    setLoading(true);
    Promise.all(
      series.map(async (s) => {
        if (!s.historyUrlBase) return [s.id, s.data] as const;
        try {
          const res = await fetch(`${s.historyUrlBase}&range=${range}`, { cache: "no-store" });
          if (!res.ok) return [s.id, s.data] as const;
          const json = await res.json();
          return [s.id, (json.kalshi ?? []) as HistoryPoint[]] as const;
        } catch {
          return [s.id, s.data] as const;
        }
      })
    ).then((entries) => {
      if (!cancelled) setChartData(Object.fromEntries(entries));
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, canToggleRange]);

  const [hoverX, setHoverX] = useState<number | null>(null);

  const { minT, maxT, yMax, paths } = useMemo(() => {
    const allPoints = series.flatMap((s) => chartData[s.id] ?? []);
    if (allPoints.length === 0) {
      return { minT: 0, maxT: 1, yMax: 1, paths: [] as { id: string; d: string }[] };
    }
    const ts = allPoints.map((p) => p.t);
    const ps = allPoints.map((p) => p.p);
    const minT = Math.min(...ts);
    const maxT = Math.max(...ts);
    const maxP = Math.max(...ps);
    const yMax = Math.min(1, Math.max(0.1, (Math.ceil((maxP * 100) / 5) * 5) / 100));

    const xScale = (t: number) =>
      PAD.left + ((t - minT) / (maxT - minT || 1)) * (WIDTH - PAD.left - PAD.right);
    const yScale = (p: number) =>
      HEIGHT - PAD.bottom - (p / yMax) * (HEIGHT - PAD.top - PAD.bottom);

    const paths = series.map((s) => {
      const points = [...(chartData[s.id] ?? [])].sort((a, b) => a.t - b.t);
      const d = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.t).toFixed(1)} ${yScale(p.p).toFixed(1)}`)
        .join(" ");
      return { id: s.id, d };
    });

    return { minT, maxT, yMax, paths };
  }, [series, chartData]);

  const hasAnyData = series.some((s) => (chartData[s.id] ?? []).length > 0);

  const rangeToggle = canToggleRange && (
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

  if (!hasAnyData) {
    return (
      <section className="section">
        <div className="section-label">Price History</div>
        <div className="card">
          {rangeToggle}
          <div className="chart-empty">{loading ? "Loading…" : "History unavailable right now."}</div>
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

  const hoverPoints =
    hoverT === null
      ? []
      : series.map((s, i) => ({
          id: s.id,
          label: s.label,
          color: LINE_COLORS[i % LINE_COLORS.length],
          point: nearestPoint(chartData[s.id] ?? [], hoverT),
        }));

  const crosshairX = hoverPoints.find((h) => h.point)?.point
    ? xScale(hoverPoints.find((h) => h.point)!.point!.t)
    : null;

  const yTicks = [0, yMax / 2, yMax];
  const showYear = new Date(minT * 1000).getFullYear() !== new Date(maxT * 1000).getFullYear();

  return (
    <section className="section">
      <div className="section-label">Price History</div>
      <div className="card">
        {rangeToggle}
        <div className="chart-legend">
          {series.map((s, i) => (
            <span className="chart-legend-item" key={s.id}>
              <span
                className="chart-swatch"
                style={{ background: LINE_COLORS[i % LINE_COLORS.length] }}
              />
              {s.label}
            </span>
          ))}
        </div>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          width="100%"
          height="auto"
          role="img"
          aria-label={`Historical probability chart comparing ${series.map((s) => s.label).join(", ")} on Kalshi`}
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
            {formatAxisDate(minT, range, showYear)}
          </text>
          <text x={WIDTH - PAD.right} y={HEIGHT - 6} fontSize={11} fill="var(--card-muted)" textAnchor="end">
            {formatAxisDate(maxT, range, showYear)}
          </text>

          {paths.map(({ id, d }, i) =>
            d ? (
              <path key={id} d={d} fill="none" stroke={LINE_COLORS[i % LINE_COLORS.length]} strokeWidth={2} />
            ) : null
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
          {hoverPoints.map(
            (h) =>
              h.point && (
                <circle key={h.id} cx={xScale(h.point.t)} cy={yScale(h.point.p)} r={3.5} fill={h.color} />
              )
          )}
        </svg>
        {hoverPoints.some((h) => h.point) && (
          <div className="brief-meta">
            {formatTooltipDate(hoverPoints.find((h) => h.point)!.point!.t, range)}
            {hoverPoints
              .filter((h) => h.point)
              .map((h) => ` · ${h.label} ${(h.point!.p * 100).toFixed(1)}%`)
              .join("")}
          </div>
        )}
      </div>
    </section>
  );
}
