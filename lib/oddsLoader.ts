import { getKalshiMarket, getKalshiMarketHistory } from "./kalshi";
import { getPolymarketMarket, getPolymarketMarketHistory } from "./polymarket";
import type { HistoryRange, HistoryResponse, MarketOutcome, OddsResponse } from "./types";

/**
 * Shared by every place that needs a fresh live read for one outcome --
 * market pages and the homepage's live card lines both call this, so
 * there's exactly one code path computing "the current odds," and the
 * two can never drift apart. Either platform is skipped entirely (not just
 * "unavailable") when an outcome has no market configured for it --
 * single-platform/novelty markets that only exist on one exchange.
 */
export async function loadOutcomeOdds(outcome: MarketOutcome): Promise<OddsResponse> {
  const [kalshi, polymarket] = await Promise.allSettled([
    outcome.kalshi
      ? getKalshiMarket(outcome.kalshi.ticker, outcome.kalshi.url)
      : Promise.resolve(null),
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
    outcome.kalshi
      ? getKalshiMarketHistory(outcome.kalshi.seriesTicker, outcome.kalshi.ticker, range)
      : Promise.resolve(null),
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
