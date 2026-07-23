import type { HistoryPoint, PlatformQuote } from "./types";

const KALSHI_BASE = "https://api.elections.kalshi.com/trade-api/v2";
const MARKET_TICKER = "KXPRESPERSON-28-JVAN";
const SERIES_TICKER = "KXPRESPERSON";

export const KALSHI_MARKET_URL = `https://kalshi.com/markets/kxpresperson/kxpresperson-28?selectedMarketTicker=${MARKET_TICKER}`;

export async function getKalshiVanceMarket(): Promise<PlatformQuote> {
  const res = await fetch(`${KALSHI_BASE}/markets/${MARKET_TICKER}`, {
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
    url: KALSHI_MARKET_URL,
  };
}

export async function getKalshiVanceHistory(): Promise<HistoryPoint[]> {
  const end = Math.floor(Date.now() / 1000);
  const start = end - 60 * 60 * 24 * 400; // ~400 days, covers full market life
  const url =
    `${KALSHI_BASE}/series/${SERIES_TICKER}/markets/${MARKET_TICKER}/candlesticks` +
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
