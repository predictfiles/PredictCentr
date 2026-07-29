import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORY_LABELS } from "@/lib/markets";
import type { MarketConfig } from "@/lib/types";

const CATEGORY_ORDER: MarketConfig["category"][] = ["politics", "sports", "culture"];

/**
 * Homepage-only nav linking to each category's own listing page -- colored
 * and iconed the same way as that category's bento cards, so it reads as
 * the same visual language rather than a generic nav bar.
 */
export function CategoryNav() {
  return (
    <nav className="category-nav">
      {CATEGORY_ORDER.map((category) => (
        <Link
          key={category}
          href={`/${category}/`}
          className={`category-nav-link category-nav-link-${category}`}
        >
          <CategoryIcon category={category} className="category-nav-icon" />
          {CATEGORY_LABELS[category]}
        </Link>
      ))}
    </nav>
  );
}
