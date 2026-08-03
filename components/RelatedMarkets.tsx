import { MarketCard } from "@/components/MarketCard";
import { CATEGORY_LABELS } from "@/lib/markets";
import type { MarketConfig, OddsResponse } from "@/lib/types";

/**
 * Cross-links a market page to other live markets in the same category --
 * internal linking for SEO (helps Google understand the site's structure,
 * spreads authority between pages) and a real "what else is here" path for
 * a reader who just came in from a single news-driven link.
 */
export function RelatedMarkets({
  category,
  markets,
  oddsByMarket,
}: {
  category: MarketConfig["category"];
  markets: MarketConfig[];
  oddsByMarket: Map<string, Record<string, OddsResponse>>;
}) {
  if (markets.length === 0) return null;

  return (
    <section className="section">
      <div className="section-label">More in {CATEGORY_LABELS[category]}</div>
      <div className="market-card-list">
        {markets.map((market) => (
          <MarketCard
            key={market.slug.join("/")}
            market={market}
            initialOdds={oddsByMarket.get(market.slug.join("/")) ?? {}}
          />
        ))}
      </div>
    </section>
  );
}
