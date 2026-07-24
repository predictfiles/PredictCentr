import { getKalshiMarket, getKalshiMarketHistory } from "./kalshi";
import { getPolymarketMarket, getPolymarketMarketHistory } from "./polymarket";
import type { HistoryResponse, MarketOutcome, OddsResponse } from "./types";

/**
 * Shared by every place that needs a fresh live read for one outcome --
 * market pages and the homepage's live card lines both call this, so
 * there's exactly one code path computing "the current odds," and the
 * two can never drift apart.
 */
export async function loadOutcomeOdds(outcome: MarketOutcome): Promise<OddsResponse> {
  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiMarket(outcome.kalshi.ticker, outcome.kalshi.url),
    getPolymarketMarket(outcome.polymarket.marketId, outcome.polymarket.url),
  ]);
  return {
    kalshi: kalshi.status === "fulfilled" ? kalshi.value : null,
    kalshiError: kalshi.status === "rejected" ? String(kalshi.reason) : null,
    polymarket: polymarket.status === "fulfilled" ? polymarket.value : null,
    polymarketError:
      polymarket.status === "rejected" ? String(polymarket.reason) : null,
    fetchedAt: new Date().toISOString(),
  };
}

export async function loadOutcomeHistory(outcome: MarketOutcome): Promise<HistoryResponse> {
  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiMarketHistory(outcome.kalshi.seriesTicker, outcome.kalshi.ticker),
    getPolymarketMarketHistory(outcome.polymarket.yesTokenId),
  ]);
  return {
    kalshi: kalshi.status === "fulfilled" ? kalshi.value : null,
    kalshiError: kalshi.status === "rejected" ? String(kalshi.reason) : null,
    polymarket: polymarket.status === "fulfilled" ? polymarket.value : null,
    polymarketError:
      polymarket.status === "rejected" ? String(polymarket.reason) : null,
    fetchedAt: new Date().toISOString(),
  };
}
