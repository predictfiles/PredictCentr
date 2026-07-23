import type { HistoryPoint, PlatformQuote } from "./types";

const GAMMA_BASE = "https://gamma-api.polymarket.com";
const CLOB_BASE = "https://clob.polymarket.com";

export async function getPolymarketMarket(
  marketId: string,
  marketUrl: string
): Promise<PlatformQuote> {
  const res = await fetch(`${GAMMA_BASE}/markets/${marketId}`, {
    next: { revalidate: 30 },
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
  yesTokenId: string
): Promise<HistoryPoint[]> {
  const url = `${CLOB_BASE}/prices-history?market=${yesTokenId}&interval=max&fidelity=1440`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Polymarket price history fetch failed: ${res.status}`);
  }
  const data = await res.json();
  const history = Array.isArray(data.history) ? data.history : [];
  return history.map((h: any) => ({ t: h.t, p: h.p }));
}
