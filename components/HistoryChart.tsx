"use client";

import { useMemo, useState } from "react";
import type { HistoryPoint, HistoryResponse } from "@/lib/types";

const WIDTH = 700;
const HEIGHT = 300;
const PAD = { top: 16, right: 16, bottom: 28, left: 40 };

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

function formatAxisDate(t: number): string {
  return new Date(t * 1000).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

function formatTooltipDate(t: number): string {
  return new Date(t * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function HistoryChart({ data }: { data: HistoryResponse }) {
  const kalshi = data.kalshi ?? [];
  const polymarket = data.polymarket ?? [];
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

  if (kalshi.length === 0 && polymarket.length === 0) {
    return (
      <section className="section">
        <div className="section-label">Price History</div>
        <div className="card">
          <div className="chart-empty">
            History unavailable right now
            {data.kalshiError || data.polymarketError
              ? ` (${data.kalshiError ?? data.polymarketError})`
              : ""}
            .
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
        <div className="chart-legend">
          <span className="chart-legend-item">
            <span className="chart-swatch" style={{ background: "var(--kalshi)" }} />
            Kalshi
          </span>
          <span className="chart-legend-item">
            <span className="chart-swatch" style={{ background: "var(--polymarket)" }} />
            Polymarket
          </span>
        </div>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          width="100%"
          height="auto"
          role="img"
          aria-label="Historical probability chart for JD Vance winning the 2028 presidential election on Kalshi and Polymarket"
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
                fill="var(--muted)"
                textAnchor="end"
              >
                {Math.round(tick * 100)}%
              </text>
            </g>
          ))}

          <text x={PAD.left} y={HEIGHT - 6} fontSize={11} fill="var(--muted)">
            {formatAxisDate(minT)}
          </text>
          <text x={WIDTH - PAD.right} y={HEIGHT - 6} fontSize={11} fill="var(--muted)" textAnchor="end">
            {formatAxisDate(maxT)}
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
              stroke="var(--muted)"
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
            {formatTooltipDate((hoverKalshi ?? hoverPolymarket)!.t)}
            {hoverKalshi ? ` · Kalshi ${(hoverKalshi.p * 100).toFixed(1)}%` : ""}
            {hoverPolymarket ? ` · Polymarket ${(hoverPolymarket.p * 100).toFixed(1)}%` : ""}
          </div>
        )}
      </div>
    </section>
  );
}
