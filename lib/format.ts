export function formatPercent(p: number): string {
  return (p * 100).toFixed(1);
}

export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "unknown";
  const diffSec = Math.round((now - then) / 1000);
  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
}

export function formatDate(d: string, opts?: Intl.DateTimeFormatOptions): string {
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-US", opts ?? { month: "short", day: "numeric", year: "numeric" });
}

interface AskQuote {
  ask: number;
}

/**
 * The cheaper platform to buy "Yes" on right now, plus the points gap.
 * Used by both the market page's "Best available price" callout and the
 * homepage card's short live line -- one computation, so the two numbers
 * can never say different things about the same market.
 */
export function bestPrice(
  kalshi: AskQuote | null,
  polymarket: AskQuote | null
): { platform: "kalshi" | "polymarket"; price: number; diffPts: number } | null {
  if (!kalshi || !polymarket) return null;
  const diff = Math.round((kalshi.ask - polymarket.ask) * 1000) / 10; // signed pts, kalshi - polymarket
  const platform = diff <= 0 ? "kalshi" : "polymarket";
  const price = platform === "kalshi" ? kalshi.ask : polymarket.ask;
  return { platform, price, diffPts: Math.abs(diff) };
}

/**
 * Only claim an affiliate relationship for platforms that actually have one --
 * a blanket "contains affiliate links to X and Y" was true for neither
 * platform at one point, which is a real accuracy problem, not just wording.
 */
export function affiliateDisclosure(affiliateStatus: {
  kalshi: { isAffiliate: boolean };
  polymarket?: { isAffiliate: boolean };
}): string {
  const hasPolymarket = Boolean(affiliateStatus.polymarket);
  const live: string[] = [];
  if (affiliateStatus.kalshi.isAffiliate) live.push("Kalshi");
  if (affiliateStatus.polymarket?.isAffiliate) live.push("Polymarket");

  if (live.length === 0) {
    return hasPolymarket
      ? "The Kalshi and Polymarket links on this page are not currently affiliate/referral links -- they go straight to each platform's market page."
      : "The Kalshi link on this page is not currently an affiliate/referral link -- it goes straight to the platform's market page.";
  }
  return `Contains ${live.length > 1 ? "affiliate links" : "an affiliate link"} to ${live.join(
    " and "
  )} -- PredictCentr may earn a commission if you sign up through ${
    live.length > 1 ? "them" : "it"
  }, at no extra cost to you.`;
}
