import type { HistoryPoint, HistoryResponse } from "@/lib/types";

const WIDTH = 700;
const HEIGHT = 220;
const PAD = { top: 14, right: 16, bottom: 26, left: 40 };

function toPoints(points: HistoryPoint[] | null, cutoff: number): HistoryPoint[] {
  if (!points) return [];
  return points.filter((p) => p.t <= cutoff).sort((a, b) => a.t - b.t);
}

/**
 * Frozen, non-interactive odds chart embedded inline in a News article body.
 * Unlike the live HistoryChart on market pages, this always shows price
 * history up to `cutoff` (the article's own publishedAt) -- never the
 * current live price -- so the chart stays byte-identical forever and can
 * never contradict what the article's text describes, no matter how much
 * the real odds move after publication. No range toggle, no hover, no
 * auto-refresh: it's illustrating a fact from the article, not a dashboard.
 */
export function ArticleOddsChart({
  data,
  cutoff,
  caption,
  idPrefix,
}: {
  data: HistoryResponse;
  /** unix seconds -- the article's publishedAt, converted once by the caller */
  cutoff: number;
  caption: string;
  /** Unique per block (e.g. the block's index) so gradient ids never collide if an article ever embeds more than one chart. */
  idPrefix: string;
}) {
  const kalshi = toPoints(data.kalshi, cutoff);
  const polymarket = toPoints(data.polymarket, cutoff);
  const allPoints = [...kalshi, ...polymarket];

  if (allPoints.length === 0) return null;

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
  const baselineY = yScale(0);

  const toPath = (points: HistoryPoint[]) =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.t).toFixed(1)} ${yScale(p.p).toFixed(1)}`)
      .join(" ");

  const toAreaPath = (points: HistoryPoint[]) => {
    if (points.length === 0) return "";
    const lastX = xScale(points[points.length - 1].t).toFixed(1);
    const firstX = xScale(points[0].t).toFixed(1);
    return `${toPath(points)} L ${lastX} ${baselineY.toFixed(1)} L ${firstX} ${baselineY.toFixed(1)} Z`;
  };

  const latest = (points: HistoryPoint[]) => (points.length === 0 ? null : points[points.length - 1]);
  const latestKalshi = latest(kalshi);
  const latestPolymarket = latest(polymarket);

  const yTicks = [0, yMax / 2, yMax];
  const asOfDate = new Date(cutoff * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="news-chart-embed">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height="auto"
        role="img"
        aria-label={`${caption}, as of ${asOfDate}`}
      >
        <defs>
          <linearGradient id={`${idPrefix}-kalshi`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--kalshi)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--kalshi)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-polymarket`} x1="0" y1="0" x2="0" y2="1">
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
            <text x={PAD.left - 8} y={yScale(tick) + 4} fontSize={11} fill="var(--card-muted)" textAnchor="end">
              {Math.round(tick * 100)}%
            </text>
          </g>
        ))}

        <text x={PAD.left} y={HEIGHT - 6} fontSize={11} fill="var(--card-muted)">
          {new Date(minT * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </text>
        <text x={WIDTH - PAD.right} y={HEIGHT - 6} fontSize={11} fill="var(--card-muted)" textAnchor="end">
          {asOfDate}
        </text>

        {polymarket.length > 0 && <path d={toAreaPath(polymarket)} fill={`url(#${idPrefix}-polymarket)`} />}
        {kalshi.length > 0 && <path d={toAreaPath(kalshi)} fill={`url(#${idPrefix}-kalshi)`} />}

        {polymarket.length > 0 && (
          <path
            d={toPath(polymarket)}
            fill="none"
            stroke="var(--polymarket)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {kalshi.length > 0 && (
          <path
            d={toPath(kalshi)}
            fill="none"
            stroke="var(--kalshi)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {latestKalshi && (
          <g>
            <circle cx={xScale(latestKalshi.t)} cy={yScale(latestKalshi.p)} r={6} fill="var(--card)" />
            <circle cx={xScale(latestKalshi.t)} cy={yScale(latestKalshi.p)} r={3.5} fill="var(--kalshi)" />
          </g>
        )}
        {latestPolymarket && (
          <g>
            <circle cx={xScale(latestPolymarket.t)} cy={yScale(latestPolymarket.p)} r={6} fill="var(--card)" />
            <circle cx={xScale(latestPolymarket.t)} cy={yScale(latestPolymarket.p)} r={3.5} fill="var(--polymarket)" />
          </g>
        )}
      </svg>
      <div className="news-chart-caption">
        {caption} &middot; as of {asOfDate}
      </div>
    </div>
  );
}
