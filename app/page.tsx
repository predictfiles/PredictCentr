import { markets } from "@/lib/markets";
import { MarketCard } from "@/components/MarketCard";

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

      <section className="section">
        <div className="market-card-list">
          {markets.map((market) => (
            <MarketCard
              key={`${market.electionSlug}/${market.candidateSlug}`}
              market={market}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
