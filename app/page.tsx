import { markets } from "@/lib/markets";
import { MarketCard } from "@/components/MarketCard";

const CATEGORIES = [
  { id: "politics", label: "Politics" },
  { id: "culture", label: "Culture" },
] as const;

export default function Home() {
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

      {CATEGORIES.map((category) => {
        const categoryMarkets = markets.filter((m) => m.category === category.id);
        if (categoryMarkets.length === 0) return null;
        return (
          <section className="section" key={category.id}>
            <div className="section-label">{category.label}</div>
            <div className="market-card-list">
              {categoryMarkets.map((market) => (
                <MarketCard key={market.slug.join("/")} market={market} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
