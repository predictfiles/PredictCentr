import type { MarketConfig } from "@/lib/types";

type Category = MarketConfig["category"];

/**
 * One icon per category, not per market -- the whole point is that a new
 * market automatically inherits the right look with zero design work.
 * Pure line art via currentColor so the same markup works both as a small
 * inline glyph and as an oversized, low-opacity background bleed.
 */
export function CategoryIcon({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {category === "politics" && (
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="12,34 50,10 88,34" />
          <line x1="8" y1="34" x2="92" y2="34" />
          <line x1="18" y1="42" x2="18" y2="78" />
          <line x1="36" y1="42" x2="36" y2="78" />
          <line x1="50" y1="42" x2="50" y2="78" />
          <line x1="64" y1="42" x2="64" y2="78" />
          <line x1="82" y1="42" x2="82" y2="78" />
          <line x1="6" y1="86" x2="94" y2="86" />
        </g>
      )}
      {category === "sports" && (
        <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="50" cy="50" r="38" />
          <path d="M 22,28 Q 46,50 22,72" />
          <path d="M 78,28 Q 54,50 78,72" />
        </g>
      )}
      {category === "culture" && (
        <g strokeLinecap="round" strokeLinejoin="round">
          <rect x="10" y="18" width="80" height="64" rx="8" fill="none" stroke="currentColor" strokeWidth="5" />
          <line x1="10" y1="34" x2="90" y2="34" stroke="currentColor" strokeWidth="5" />
          <line x1="10" y1="66" x2="90" y2="66" stroke="currentColor" strokeWidth="5" />
          <circle cx="24" cy="26" r="3" fill="currentColor" />
          <circle cx="24" cy="74" r="3" fill="currentColor" />
          <circle cx="76" cy="26" r="3" fill="currentColor" />
          <circle cx="76" cy="74" r="3" fill="currentColor" />
        </g>
      )}
    </svg>
  );
}
