import Link from "next/link";
import type { MarketConfig, OddsResponse } from "@/lib/types";
import { CardLiveLine } from "@/components/CardLiveLine";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CountdownTimer } from "@/components/CountdownTimer";
import { CATEGORY_LABELS } from "@/lib/markets";

/**
 * Homepage-only card. The bold full-bleed gradient is reserved for the
 * featured Hot Market slot only, so it reads as the one true highlight --
 * every regular category card gets the calmer white-card treatment (colored
 * top border + small icon+label), the same accent language used on
 * individual market page headers. Deliberately separate from MarketCard --
 * the hub pages keep their own plain-list treatment, this is homepage-only.
 */
export function BentoMarketCard({
  market,
  initialOdds,
  featured = false,
}: {
  market: MarketConfig;
  initialOdds: Record<string, OddsResponse>;
  featured?: boolean;
}) {
  const href = `/${market.slug.join("/")}/`;

  if (featured) {
    return (
      <Link className="bento-card bento-card-hot bento-card-featured" href={href}>
        <CategoryIcon category={market.category} className="bento-card-icon" />
        <div className="bento-card-content">
          <div className="bento-card-eyebrow">🔥 Hot Market</div>
          <div className="bento-card-title">{market.content.market.title}</div>
          <div className="bento-card-desc">{market.shortDescription}</div>
          <CardLiveLine
            outcomes={market.outcomes}
            slugPath={market.slug.join("/")}
            initialOdds={initialOdds}
          />
          <CountdownTimer
            targetDate={market.content.market.resolutionDate}
            className="bento-card-countdown"
          />
          <div className="bento-card-cta">View live odds →</div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      className={`bento-card bento-card-calm bento-card-${market.category}`}
      href={href}
    >
      <div className={`category-tag category-tag-${market.category}`}>
        <CategoryIcon category={market.category} className="category-tag-icon" />
        {CATEGORY_LABELS[market.category]}
      </div>
      <div className="bento-card-title">{market.content.market.title}</div>
      <div className="bento-card-desc">{market.shortDescription}</div>
      <CardLiveLine
        outcomes={market.outcomes}
        slugPath={market.slug.join("/")}
        initialOdds={initialOdds}
      />
      <CountdownTimer
        targetDate={market.content.market.resolutionDate}
        className="bento-card-countdown"
      />
      <div className="bento-card-cta">View live odds →</div>
    </Link>
  );
}
