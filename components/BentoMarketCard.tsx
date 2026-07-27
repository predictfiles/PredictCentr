import Link from "next/link";
import type { MarketConfig, OddsResponse } from "@/lib/types";
import { CardLiveLine } from "@/components/CardLiveLine";
import { CategoryIcon } from "@/components/CategoryIcon";

/**
 * Homepage-only card: bold gradient keyed off market.category (not the
 * individual market), with an oversized CategoryIcon bleeding off the
 * corner as a background texture. Deliberately separate from MarketCard --
 * the hub pages keep the calmer white-card treatment, this is homepage-only.
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

  return (
    <Link
      className={`bento-card bento-card-${market.category}${featured ? " bento-card-featured" : ""}`}
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
