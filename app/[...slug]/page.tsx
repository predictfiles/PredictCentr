import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findMarket, markets } from "@/lib/markets";
import { loadOutcomeOdds, loadOutcomeHistory } from "@/lib/oddsLoader";
import { affiliateDisclosure } from "@/lib/format";
import { MarketBrief } from "@/components/MarketBrief";
import { NewsSection } from "@/components/NewsSection";
import { OddsComparison } from "@/components/OddsComparison";
import { HistoryChart } from "@/components/HistoryChart";
import { WhatToWatch } from "@/components/WhatToWatch";

export const revalidate = 30;

export function generateStaticParams() {
  return markets.map((m) => ({ slug: m.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Metadata {
  const market = findMarket(params.slug);
  if (!market) return {};
  return {
    title: market.content.market.title,
    description: market.shortDescription,
  };
}

export default async function MarketPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const market = findMarket(params.slug);
  if (!market) notFound();

  const slugPath = market.slug.join("/");
  const { content } = market;
  const hasAnyPolymarket = market.outcomes.some((o) => o.polymarket);

  const outcomesData = await Promise.all(
    market.outcomes.map(async (outcome) => {
      const [odds, history] = await Promise.all([
        loadOutcomeOdds(outcome),
        loadOutcomeHistory(outcome),
      ]);
      return { outcome, odds, history };
    })
  );

  return (
    <main className="wrap">
      <header className="header">
        <Link className="brand" href="/">
          PredictCentr
        </Link>
        <h1 className="title">{content.market.title}</h1>
        <p className="subtitle">
          {hasAnyPolymarket ? "Kalshi vs Polymarket, compared live" : "Live odds from Kalshi"}
          . Resolves {content.market.resolutionDate}.
        </p>
        <p className="resolution-note">{content.market.resolutionNote}</p>
      </header>

      <div className="disclaimer">
        Prediction market prices reflect trader sentiment, not a guaranteed
        outcome. Nothing on this page is financial advice or a promise of any
        return.
      </div>

      {outcomesData.map(({ outcome, odds, history }) => (
        <div className="outcome-block" key={outcome.id}>
          {market.outcomes.length > 1 && (
            <h2 className="outcome-heading">{outcome.label}</h2>
          )}
          <OddsComparison
            initialData={odds}
            pollUrl={`/api/markets/odds?slug=${encodeURIComponent(
              slugPath
            )}&outcome=${encodeURIComponent(outcome.id)}`}
            question={outcome.question}
            kalshiAffiliateUrl={outcome.kalshi.url}
            polymarketAffiliateUrl={outcome.polymarket?.url}
          />
          <HistoryChart
            data={history}
            candidateName={outcome.label}
            hasPolymarket={Boolean(outcome.polymarket)}
          />
        </div>
      ))}

      <MarketBrief
        text={content.marketBrief.text}
        updatedAt={content.marketBrief.updatedAt}
        author={content.marketBrief.author}
      />

      <NewsSection items={content.news} />

      <WhatToWatch items={content.whatToWatch} />

      <footer className="footer">
        <div>
          Data sources: Kalshi public API
          {hasAnyPolymarket ? " and Polymarket Gamma/CLOB API" : ""}. Prices
          are cached up to 30 seconds.
        </div>
        <div>{affiliateDisclosure(content.affiliateStatus)}</div>
      </footer>
    </main>
  );
}
