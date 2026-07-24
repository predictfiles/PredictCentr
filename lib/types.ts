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
    /** Full display title, e.g. "JD Vance — 2028 U.S. Presidential Election Winner" */
    title: string;
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
  /**
   * Whether PredictCentr actually has a live affiliate/referral deal with
   * each platform yet. `polymarket` is omitted entirely for a Kalshi-only
   * market -- there's no platform relationship to disclose either way.
   */
  affiliateStatus: {
    kalshi: { isAffiliate: boolean; note?: string };
    polymarket?: { isAffiliate: boolean; note?: string };
  };
}

/**
 * One trackable outcome within a market -- almost always the whole market
 * (binary Yes/No, e.g. "JD Vance wins"), but for a multi-outcome market like
 * "LeBron James' next team" a page tracks a handful of the real contenders,
 * each as its own outcome with its own Kalshi/Polymarket identifiers.
 * `polymarket` is omitted for single-platform (Kalshi-only) markets --
 * niche/novelty questions that only exist on one exchange.
 */
export interface MarketOutcome {
  /** URL/query-safe id, e.g. "miami-heat" */
  id: string;
  /** Display name, e.g. "Miami Heat" */
  label: string;
  /** The Yes/No question this outcome's odds answer, e.g. "Will LeBron sign with the Heat?" */
  question: string;
  kalshi: { ticker: string; seriesTicker: string; url: string };
  polymarket?: { marketId: string; yesTokenId: string; url: string };
}

/** A single market page, addressed by a 1+ segment URL slug. */
export interface MarketConfig {
  /** URL path segments, e.g. ["2028-us-presidential-election-winner", "jd-vance"] or ["lebron-james-next-team"] */
  slug: string[];
  category: "politics" | "sports" | "culture";
  /** One-liner for homepage market cards. */
  shortDescription: string;
  /** Ordered; first is the lead/primary outcome. 1 entry for a binary market, 2+ for multi-outcome. */
  outcomes: MarketOutcome[];
  content: MarketContent;
}
