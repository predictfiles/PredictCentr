import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORY_LABELS } from "@/lib/markets";
import type { MarketConfig } from "@/lib/types";

const CATEGORY_ORDER: MarketConfig["category"][] = ["politics", "sports", "culture"];

/**
 * Homepage-only, full-width bar linking to each category's own listing
 * page. Sits as a direct child of the dark <header> (not inside
 * .home-header-inner) so it can span the full page width instead of being
 * boxed to the header's max-width content column. Just colored text+icon,
 * no pill background -- the bar itself carries the color story.
 */
export function CategoryNav() {
  return (
    <nav className="category-bar">
      <div className="category-bar-inner">
        {CATEGORY_ORDER.map((category) => (
          <Link
            key={category}
            href={`/${category}/`}
            className={`category-bar-link category-bar-link-${category}`}
          >
            <CategoryIcon category={category} className="category-bar-icon" />
            {CATEGORY_LABELS[category]}
          </Link>
        ))}
      </div>
    </nav>
  );
}
