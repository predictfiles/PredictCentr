export type PlatformId = "kalshi" | "polymarket";

export interface PlatformQuote {
  platform: PlatformId;
  /** Implied probability of "Yes" for this market's outcome, 0-1 */
  yesPrice: number;
  bid: number;
  ask: number;
  /** ISO timestamp the platform last updated this market */
  updatedAt: string;
  url: string;
}

export interface OddsResponse {
  kalshi: PlatformQuote | null;
  kalshiError: string | null;
  polymarket: PlatformQuote | null;
  polymarketError: string | null;
  fetchedAt: string;
}

export interface HistoryPoint {
  /** unix seconds */
  t: number;
  /** price 0-1 */
  p: number;
}

export interface HistoryResponse {
  kalshi: HistoryPoint[] | null;
  kalshiError: string | null;
  polymarket: HistoryPoint[] | null;
  polymarketError: string | null;
  fetchedAt: string;
}

export interface NewsItem {
  headline: string;
  source: string;
  date: string;
  url: string;
  image?: string;
}

export interface WatchItem {
  date: string;
  label: string;
}

export interface MarketContent {
  market: {
    title: string;
    candidate: string;
    resolutionDate: string;
    resolutionNote: string;
  };
  marketBrief: {
    text: string;
    updatedAt: string;
    author?: string;
  };
  news: NewsItem[];
  whatToWatch: WatchItem[];
  affiliateLinks: {
    kalshi: { url: string; note?: string };
    polymarket: { url: string; note?: string };
  };
}

/** A single market page: one candidate's odds within one election. */
export interface MarketConfig {
  electionSlug: string;
  candidateSlug: string;
  /** One-liner for homepage market cards. */
  shortDescription: string;
  kalshi: {
    ticker: string;
    seriesTicker: string;
  };
  polymarket: {
    marketId: string;
    yesTokenId: string;
  };
  content: MarketContent;
}
