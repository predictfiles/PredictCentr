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

/**
 * Only claim an affiliate relationship for platforms that actually have one --
 * a blanket "contains affiliate links to X and Y" was true for neither
 * platform at one point, which is a real accuracy problem, not just wording.
 */
export function affiliateDisclosure(affiliateStatus: {
  kalshi: { isAffiliate: boolean };
  polymarket: { isAffiliate: boolean };
}): string {
  const live: string[] = [];
  if (affiliateStatus.kalshi.isAffiliate) live.push("Kalshi");
  if (affiliateStatus.polymarket.isAffiliate) live.push("Polymarket");

  if (live.length === 0) {
    return "The Kalshi and Polymarket links on this page are not currently affiliate/referral links -- they go straight to each platform's market page.";
  }
  return `Contains ${live.length > 1 ? "affiliate links" : "an affiliate link"} to ${live.join(
    " and "
  )} -- PredictCentr may earn a commission if you sign up through ${
    live.length > 1 ? "them" : "it"
  }, at no extra cost to you.`;
}
