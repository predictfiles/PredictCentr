import type { HistoryPoint, HistoryRange, PlatformQuote } from "./types";

const KALSHI_BASE = "https://api.elections.kalshi.com/trade-api/v2";

/**
 * Kalshi's candlesticks endpoint only accepts period_interval of exactly
 * 1 (minute), 60 (hour), or 1440 (day) -- confirmed via the API's own
 * validation error for anything else. So every sub-day range shares the
 * 1-minute granularity and lets start_ts/end_ts do the zooming instead.
 */
function kalshiRangeParams(range: HistoryRange, end: number): { start: number; periodInterval: 1 | 60 | 1440 } {
  const HOUR = 3600;
  const DAY = HOUR * 24;
  switch (range) {
    case "1h":
      return { start: end - HOUR, periodInterval: 1 };
    case "1d":
      return { start: end - DAY, periodInterval: 1 };
    case "all":
      return { start: end - 400 * DAY, periodInterval: 1440 };
  }
}

export async function getKalshiMarket(
  ticker: string,
  marketUrl: string
): Promise<PlatformQuote> {
  const res = await fetch(`${KALSHI_BASE}/markets/${ticker}`, {
    next: { revalidate: 30 },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`Kalshi market fetch failed: ${res.status}`);
  }
  const data = await res.json();
  const m = data.market;
  if (!m || typeof m.last_price_dollars === "undefined") {
    throw new Error("Kalshi market response missing price data");
  }
  return {
    platform: "kalshi",
    yesPrice: parseFloat(m.last_price_dollars),
    bid: parseFloat(m.yes_bid_dollars),
    ask: parseFloat(m.yes_ask_dollars),
    updatedAt: m.updated_time,
    url: marketUrl,
  };
}

export async function getKalshiMarketHistory(
  seriesTicker: string,
  ticker: string,
  range: HistoryRange = "all"
): Promise<HistoryPoint[]> {
  const end = Math.floor(Date.now() / 1000);
  const { start, periodInterval } = kalshiRangeParams(range, end);
  const url =
    `${KALSHI_BASE}/series/${seriesTicker}/markets/${ticker}/candlesticks` +
    `?start_ts=${start}&end_ts=${end}&period_interval=${periodInterval}`;
  const res = await fetch(url, {
    next: { revalidate: range === "all" ? 3600 : 60 },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`Kalshi candlesticks fetch failed: ${res.status}`);
  }
  const data = await res.json();
  const candles = Array.isArray(data.candlesticks) ? data.candlesticks : [];
  return candles
    .map((c: any) => {
      // A quiet minute/hour with no trades still has a real price -- Kalshi
      // just omits close_dollars and leaves previous_dollars as the
      // carried-forward last price, so fall back to that instead of
      // dropping the point (which would leave gaps on low-volume markets).
      const close = c?.price?.close_dollars ?? c?.price?.previous_dollars;
      return close === undefined ? null : { t: c.end_period_ts, p: parseFloat(close) };
    })
    .filter((p: HistoryPoint | null): p is HistoryPoint => p !== null);
}
