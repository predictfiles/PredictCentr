import type { HistoryPoint, PlatformQuote } from "./types";

const KALSHI_BASE = "https://api.elections.kalshi.com/trade-api/v2";

export async function getKalshiMarket(
  ticker: string,
  marketUrl: string
): Promise<PlatformQuote> {
  const res = await fetch(`${KALSHI_BASE}/markets/${ticker}`, {
    next: { revalidate: 30 },
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
  ticker: string
): Promise<HistoryPoint[]> {
  const end = Math.floor(Date.now() / 1000);
  const start = end - 60 * 60 * 24 * 400; // ~400 days, covers full market life
  const url =
    `${KALSHI_BASE}/series/${seriesTicker}/markets/${ticker}/candlesticks` +
    `?start_ts=${start}&end_ts=${end}&period_interval=1440`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Kalshi candlesticks fetch failed: ${res.status}`);
  }
  const data = await res.json();
  const candles = Array.isArray(data.candlesticks) ? data.candlesticks : [];
  return candles
    .filter((c: any) => c?.price?.close_dollars !== undefined)
    .map((c: any) => ({
      t: c.end_period_ts,
      p: parseFloat(c.price.close_dollars),
    }));
}
