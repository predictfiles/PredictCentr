import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORY_LABELS } from "@/lib/markets";
import type { MarketConfig } from "@/lib/types";

const CATEGORY_ORDER: MarketConfig["category"][] = ["politics", "sports", "culture"];

/**
 * Full-width bar linking to each category's own listing page, present in
 * every page header. Sits as a direct child of <header> (not inside
 * .header-inner/.home-header-inner) so it can span the full page width
 * instead of being boxed to the header's max-width content column. Just
 * colored text+icon, no pill background -- the bar itself carries the
 * color story.
 *
 * `wide` matches the inner content's max-width to whichever header it's
 * paired with -- the homepage's .home-header-inner is 1080px, every other
 * page's .header-inner is 760px -- so "Politics" always lines up with the
 * title/text directly above it instead of drifting left or right.
 */
export function CategoryNav({ wide = false }: { wide?: boolean }) {
  return (
    <nav className="category-bar">
      <div className={`category-bar-inner${wide ? " category-bar-inner-wide" : ""}`}>
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
