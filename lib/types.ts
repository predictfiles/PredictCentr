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

/**
 * The time-range toggle on a market page's Price History chart. Limited to
 * ranges that are genuinely directly comparable between Kalshi and
 * Polymarket -- "all" is the default on page load; switching to 1h/1d
 * re-fetches at a finer granularity client-side rather than just re-slicing
 * the "all" data, since a month of daily candles looks like a stub of
 * nothing at 1H zoom.
 */
export type HistoryRange = "1h" | "1d" | "all";

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
    /** Bulleted on the page -- one distinct point per entry, not a single paragraph. */
    resolutionNote: string[];
  };
  marketBrief: {
    /** Bulleted on the page -- one distinct point per entry, not a single paragraph. */
    text: string[];
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
    /** Omitted for a Polymarket-only market -- there's no platform relationship to disclose either way. */
    kalshi?: { isAffiliate: boolean; note?: string };
    /** Omitted for a Kalshi-only market -- there's no platform relationship to disclose either way. */
    polymarket?: { isAffiliate: boolean; note?: string };
  };
  /**
   * Present once the real-world event has happened. Freezes the page: no
   * more live polling, odds/chart come from these snapshots (the last
   * genuine read before/at settlement) instead of hitting Kalshi/Polymarket
   * on every request. Keyed by outcome id, same as `outcomes`.
   */
  settled?: {
    resolvedAt: string;
    /** Human-readable description of what actually happened, e.g. "Philadelphia 76ers — 2-year, $8M deal" */
    result: string;
    finalOdds: Record<string, OddsResponse>;
    finalHistory: Record<string, HistoryResponse>;
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
  /** Omitted for a Polymarket-only market -- no matching Kalshi listing exists. */
  kalshi?: { ticker: string; seriesTicker: string; url: string };
  /** Omitted for a Kalshi-only market -- niche/novelty questions that only exist on one exchange. */
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

/**
 * A "race" that multiple single-candidate MarketConfigs nest under, e.g.
 * every market whose slug starts with "2028-us-presidential-election-winner".
 * Powers the hub page at /<electionSlug>/ listing those candidates side by
 * side -- purely a display grouping, not a market/outcome itself.
 */
export interface ElectionInfo {
  slug: string;
  title: string;
  resolutionDate: string;
  description: string;
}

/**
 * A "PredictCentr Must Read" editorial article -- longer-form content, kept
 * separate from the market pages' odds-first job. Two initial categories:
 * state-by-state legality guides and market analysis/opinion pieces.
 */
export interface MustReadArticle {
  /** URL slug, e.g. "is-the-odyssey-overpriced-for-best-picture" */
  slug: string;
  title: string;
  category: "legality" | "analysis";
  /** One-line summary shown on the hub page and the market-page teaser. */
  teaser: string;
  /** Hero image shown at the top of the article itself. */
  image?: string;
  /** Paragraphs -- prose, not bulleted, one array entry per <p>. */
  body: string[];
  publishedAt: string;
  updatedAt: string;
  author: string;
  /**
   * Shown as a small notice on the article itself -- e.g. the "not legal
   * advice, verify independently" note a legality piece needs. Optional
   * since an analysis piece may not need one of its own.
   */
  disclaimer?: string;
  /** Optional link back to the specific market this article discusses. */
  relatedMarketSlug?: string;
}

/**
 * A manually-picked entry for the homepage's "Trending on X" carousel.
 * Owain's own daily pick from X's "Today's News" panel -- no API, no
 * automation. `marketSlug` is the joined slug path (e.g.
 * "2028-us-presidential-election-winner/donald-trump") of the market it
 * relates to; omit it when a trending story doesn't map to any current
 * market and the item should render unlinked.
 */
export interface TrendingItem {
  headline: string;
  /** Thumbnail, same treatment as a NewsItem's image -- reuse an existing market image where one fits. */
  image?: string;
  /** X's own displayed post-volume figure for the story, e.g. "947K posts" -- entered by hand alongside the headline. */
  postVolume?: string;
  marketSlug?: string;
}

/**
 * One paragraph or pull quote in a NewsArticle's body, rendered in order.
 * A paragraph's text may contain a single Markdown-style `[label](url)`
 * link -- the only inline formatting article bodies need so far.
 */
export type NewsArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string };

/**
 * A full PredictCentr-written news article -- distinct from a market's
 * `NewsItem[]` (which just links out to third-party coverage). These are
 * the site's own reporting, featured in the homepage's top "News" section
 * and at /news/<slug>.
 */
export interface NewsArticle {
  /** URL slug, e.g. "kawhi-leonard-suspension-odds" */
  slug: string;
  category: "politics" | "sports" | "culture";
  headline: string;
  /** Full-size hero image for the article page. Must be a properly licensed/stock image, never a wire-service (Getty etc.) photo used without clearance. */
  image: string;
  /** Smaller crop for homepage/listing cards -- falls back to `image` if omitted. */
  thumbnail?: string;
  body: NewsArticleBlock[];
  /** Joined slug path (e.g. "kawhi-leonard-next-team") of the market this article is about. */
  relatedMarketSlug: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
}
