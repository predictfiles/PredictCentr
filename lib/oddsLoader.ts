import { getKalshiMarket, getKalshiMarketHistory } from "./kalshi";
import { getPolymarketMarket, getPolymarketMarketHistory } from "./polymarket";
import type { HistoryRange, HistoryResponse, MarketOutcome, OddsResponse } from "./types";

/**
 * Shared by every place that needs a fresh live read for one outcome --
 * market pages and the homepage's live card lines both call this, so
 * there's exactly one code path computing "the current odds," and the
 * two can never drift apart. Polymarket is skipped entirely (not just
 * "unavailable") when an outcome has no Polymarket market configured --
 * single-platform/novelty markets that only exist on Kalshi.
 */
export async function loadOutcomeOdds(outcome: MarketOutcome): Promise<OddsResponse> {
  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiMarket(outcome.kalshi.ticker, outcome.kalshi.url),
    outcome.polymarket
      ? getPolymarketMarket(outcome.polymarket.marketId, outcome.polymarket.url)
      : Promise.resolve(null),
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

export async function loadOutcomeHistory(
  outcome: MarketOutcome,
  range: HistoryRange = "all"
): Promise<HistoryResponse> {
  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiMarketHistory(outcome.kalshi.seriesTicker, outcome.kalshi.ticker, range),
    outcome.polymarket
      ? getPolymarketMarketHistory(outcome.polymarket.yesTokenId, range)
      : Promise.resolve(null),
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
