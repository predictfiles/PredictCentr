import Link from "next/link";
import type { MarketConfig, OddsResponse } from "@/lib/types";
import { CardLiveLine } from "@/components/CardLiveLine";
import { CategoryIcon } from "@/components/CategoryIcon";

/**
 * Homepage-only card: bold gradient keyed off market.category (not the
 * individual market), with an oversized CategoryIcon bleeding off the
 * corner as a background texture. Deliberately separate from MarketCard --
 * the hub pages keep the calmer white-card treatment, this is homepage-only.
 *
 * Featured (Hot Market) always gets the fixed fire-red/orange treatment
 * instead of its own category's color -- it needs to read as "the featured
 * slot" at a glance, not blend in as just another politics/sports/culture
 * card. The category icon still reflects the underlying market though.
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
  const colorClass = featured ? "bento-card-hot" : `bento-card-${market.category}`;

  return (
    <Link
      className={`bento-card ${colorClass}${featured ? " bento-card-featured" : ""}`}
      href={href}
    >
      <CategoryIcon category={market.category} className="bento-card-icon" />
      <div className="bento-card-content">
        {featured && <div className="bento-card-eyebrow">Hot Market</div>}
        <div className="bento-card-title">{market.content.market.title}</div>
        <div className="bento-card-desc">{market.shortDescription}</div>
        <CardLiveLine
          outcomes={market.outcomes}
          slugPath={market.slug.join("/")}
          initialOdds={initialOdds}
        />
        <div className="bento-card-cta">View live odds →</div>
      </div>
    </Link>
  );
}
