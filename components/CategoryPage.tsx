import Link from "next/link";
import { markets, CATEGORY_LABELS } from "@/lib/markets";
import { loadOutcomeOdds } from "@/lib/oddsLoader";
import { BentoMarketCard } from "@/components/BentoMarketCard";
import { MarketCard } from "@/components/MarketCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import type { MarketConfig, OddsResponse } from "@/lib/types";

/**
 * Shared by the three static category routes (app/politics, app/sports,
 * app/culture) so adding a fourth category later is a one-file change here
 * instead of three. Static routes, not a dynamic [category] segment --
 * Next.js won't allow a dynamic segment as a sibling of the [...slug]
 * catch-all at the same level, so each category gets its own literal folder
 * that just calls this with a hardcoded category.
 */
export async function CategoryPage({ category }: { category: MarketConfig["category"] }) {
  const categoryMarkets = markets.filter((m) => m.category === category);
  const liveMarkets = categoryMarkets.filter((m) => !m.content.settled);
  const archivedMarkets = categoryMarkets.filter((m) => m.content.settled);

  const oddsByMarket = new Map<string, Record<string, OddsResponse>>();
  await Promise.all(
    liveMarkets.map(async (market) => {
      const slugPath = market.slug.join("/");
      const entries = await Promise.all(
        market.outcomes.map(
          async (outcome) => [outcome.id, await loadOutcomeOdds(outcome)] as const
        )
      );
      oddsByMarket.set(slugPath, Object.fromEntries(entries));
    })
  );

  return (
    <>
      <header className={`header header-accent-${category}`}>
        <div className="header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="PredictCentr" className="brand-logo" />
          </Link>
          <div className={`category-tag category-tag-${category}`}>
            <CategoryIcon category={category} className="category-tag-icon" />
            {CATEGORY_LABELS[category]}
          </div>
          <h1 className="title">{CATEGORY_LABELS[category]}</h1>
          <p className="subtitle">
            Every {CATEGORY_LABELS[category]} market tracked on PredictCentr, live odds included.
          </p>
        </div>
      </header>

      <main className="wrap">
        <div className="disclaimer">
          Prediction market prices reflect trader sentiment, not a guaranteed
          outcome. Nothing on this page is financial advice or a promise of any
          return.
        </div>

        {liveMarkets.length > 0 && (
          <section className="section">
            <div className="section-label">Live Markets</div>
            <div className="bento-grid">
              {liveMarkets.map((market) => (
                <BentoMarketCard
                  key={market.slug.join("/")}
                  market={market}
                  initialOdds={oddsByMarket.get(market.slug.join("/")) ?? {}}
                />
              ))}
            </div>
          </section>
        )}

        {archivedMarkets.length > 0 && (
          <section className="section">
            <div className="section-label">Archive</div>
            <div className="market-card-list">
              {archivedMarkets.map((market) => (
                <MarketCard key={market.slug.join("/")} market={market} initialOdds={{}} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
