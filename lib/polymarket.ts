import type { HistoryPoint, HistoryRange, PlatformQuote } from "./types";

const GAMMA_BASE = "https://gamma-api.polymarket.com";
const CLOB_BASE = "https://clob.polymarket.com";

/**
 * Polymarket's prices-history endpoint takes these exact interval presets
 * (confirmed directly against the API), each paired with a fidelity
 * (minutes per candle) at or above that range's own minimum.
 */
function polymarketRangeParams(range: HistoryRange): { interval: string; fidelity: number } {
  switch (range) {
    case "1h":
      return { interval: "1h", fidelity: 1 };
    case "1d":
      return { interval: "1d", fidelity: 10 };
    case "all":
      return { interval: "max", fidelity: 1440 };
  }
}

export async function getPolymarketMarket(
  marketId: string,
  marketUrl: string
): Promise<PlatformQuote> {
  const res = await fetch(`${GAMMA_BASE}/markets/${marketId}`, {
    next: { revalidate: 30 },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`Polymarket market fetch failed: ${res.status}`);
  }
  const m = await res.json();
  const outcomePrices = JSON.parse(m.outcomePrices ?? "[]");
  const yesPrice = parseFloat(outcomePrices[0]);
  if (Number.isNaN(yesPrice)) {
    throw new Error("Polymarket market response missing price data");
  }
  return {
    platform: "polymarket",
    yesPrice,
    bid: parseFloat(m.bestBid ?? outcomePrices[0]),
    ask: parseFloat(m.bestAsk ?? outcomePrices[0]),
    updatedAt: m.updatedAt,
    url: marketUrl,
  };
}

export async function getPolymarketMarketHistory(
  yesTokenId: string,
  range: HistoryRange = "all"
): Promise<HistoryPoint[]> {
  const { interval, fidelity } = polymarketRangeParams(range);
  const url = `${CLOB_BASE}/prices-history?market=${yesTokenId}&interval=${interval}&fidelity=${fidelity}`;
  const res = await fetch(url, {
    next: { revalidate: range === "all" ? 3600 : 60 },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    throw new Error(`Polymarket price history fetch failed: ${res.status}`);
  }
  const data = await res.json();
  const history = Array.isArray(data.history) ? data.history : [];
  return history.map((h: any) => ({ t: h.t, p: h.p }));
}
