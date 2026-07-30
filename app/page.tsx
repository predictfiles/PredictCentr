import Link from "next/link";
import { markets, getHotMarket, findMarket } from "@/lib/markets";
import { loadOutcomeOdds } from "@/lib/oddsLoader";
import { BentoMarketCard } from "@/components/BentoMarketCard";
import { MarketCard } from "@/components/MarketCard";
import { TopNewsStories } from "@/components/TopNewsStories";
import { TrendingOnX } from "@/components/TrendingOnX";
import { CategoryNav } from "@/components/CategoryNav";
import { MustReadHeaderCard } from "@/components/MustReadHeaderCard";
import trending from "@/data/trending.json";
import type { OddsResponse, TrendingItem } from "@/lib/types";

const HOME_CATEGORY_LIMIT = 4;

const CATEGORIES = [
  { id: "politics", label: "Politics" },
  { id: "sports", label: "Sports" },
  { id: "culture", label: "Culture" },
] as const;

export const revalidate = 30;

export default async function Home() {
  const hotMarket = getHotMarket();
  const liveMarkets = markets.filter((m) => !m.content.settled);
  const archivedMarkets = markets.filter((m) => m.content.settled);

  const resolvedTrending = (trending as TrendingItem[]).map((item) => {
    const market = item.marketSlug ? findMarket(item.marketSlug.split("/")) : undefined;
    return {
      headline: item.headline,
      image: item.image,
      postVolume: item.postVolume,
      marketTitle: market?.content.market.title,
      marketHref: market ? `/${market.slug.join("/")}/` : undefined,
    };
  });

  // One live odds fetch per outcome per market, keyed by market slug path
  // so both the featured card and its regular category card can reuse the
  // same fetch instead of hitting the APIs twice for the hot market. A
  // settled market never fetches live -- its card reads its own frozen
  // snapshot, same as its page.
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
    <div className="home-page">
      <header className="header">
        <div className="home-header-inner">
          <div className="home-header-top">
            <h1 className="home-wordmark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-full.png" alt="PredictCentr" className="wordmark-logo" />
            </h1>
            <MustReadHeaderCard />
          </div>
          <p className="home-tagline">
            Breaking news. Live odds. Better decisions.
          </p>
          <p className="subtitle home-subtitle">
            Compare live prediction market prices, discover what's moving
            them, and make better-informed decisions.
          </p>
        </div>
        <CategoryNav />
      </header>

      <main className="home-wrap">
        <div className="home-grid">
          <div className="home-main">
            <TrendingOnX items={resolvedTrending} />

            {hotMarket && (
              <section className="section">
                <BentoMarketCard
                  market={hotMarket}
                  initialOdds={oddsByMarket.get(hotMarket.slug.join("/")) ?? {}}
                  featured
                />
              </section>
            )}

            {CATEGORIES.map((category) => {
              const categoryMarkets = liveMarkets.filter((m) => m.category === category.id);
              if (categoryMarkets.length === 0) return null;
              // Most recently added first -- markets.ts appends new markets
              // to the end of the array, so reversing puts the newest at
              // the top of each category section.
              const orderedMarkets = [...categoryMarkets].reverse();
              const visibleMarkets = orderedMarkets.slice(0, HOME_CATEGORY_LIMIT);
              const hasMore = orderedMarkets.length > HOME_CATEGORY_LIMIT;
              return (
                <section className="section" key={category.id}>
                  <div className="section-label">{category.label}</div>
                  <div className="bento-grid">
                    {visibleMarkets.map((market) => (
                      <BentoMarketCard
                        key={market.slug.join("/")}
                        market={market}
                        initialOdds={oddsByMarket.get(market.slug.join("/")) ?? {}}
                      />
                    ))}
                  </div>
                  {hasMore && (
                    <Link className="show-more-link" href={`/${category.id}/`}>
                      More {category.label} Markets →
                    </Link>
                  )}
                </section>
              );
            })}

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
          </div>

          <div className="home-sidebar">
            <TopNewsStories />
          </div>
        </div>
      </main>
    </div>
  );
}
