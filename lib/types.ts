export type PlatformId = "kalshi" | "polymarket";

export interface PlatformQuote {
  platform: PlatformId;
  /** Implied probability of "Yes" (Vance wins), 0-1 */
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
