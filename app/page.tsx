import { markets, getHotMarket } from "@/lib/markets";
import { loadOutcomeOdds } from "@/lib/oddsLoader";
import { MarketCard } from "@/components/MarketCard";
import type { OddsResponse } from "@/lib/types";

const CATEGORIES = [
  { id: "politics", label: "Politics" },
  { id: "sports", label: "Sports" },
] as const;

export const revalidate = 30;

export default async function Home() {
  const hotMarket = getHotMarket();

  // One live odds fetch per outcome per market, keyed by market slug path
  // so both the featured card and its regular category card can reuse the
  // same fetch instead of hitting the APIs twice for the hot market.
  const oddsByMarket = new Map<string, Record<string, OddsResponse>>();
  await Promise.all(
    markets.map(async (market) => {
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
    <main className="wrap">
      <header className="header">
        <h1 className="home-wordmark">
          Predict<span className="home-wordmark-accent">Centr</span>
        </h1>
        <p className="home-tagline">
          Breaking news. Live odds. Better decisions.
        </p>
        <p className="subtitle home-subtitle">
          Compare live prediction market prices, discover what's moving
          them, and make better-informed decisions.
        </p>
      </header>

      {hotMarket && (
        <section className="section">
          <div className="market-card-list">
            <MarketCard
              market={hotMarket}
              initialOdds={oddsByMarket.get(hotMarket.slug.join("/")) ?? {}}
              featured
            />
          </div>
        </section>
      )}

      {CATEGORIES.map((category) => {
        const categoryMarkets = markets.filter((m) => m.category === category.id);
        if (categoryMarkets.length === 0) return null;
        return (
          <section className="section" key={category.id}>
            <div className="section-label">{category.label}</div>
            <div className="market-card-list">
              {categoryMarkets.map((market) => (
                <MarketCard
                  key={market.slug.join("/")}
                  market={market}
                  initialOdds={oddsByMarket.get(market.slug.join("/")) ?? {}}
                />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
