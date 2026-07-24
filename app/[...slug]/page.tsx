import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findMarket, markets } from "@/lib/markets";
import { getKalshiMarket, getKalshiMarketHistory } from "@/lib/kalshi";
import { getPolymarketMarket, getPolymarketMarketHistory } from "@/lib/polymarket";
import type { HistoryResponse, MarketOutcome, OddsResponse } from "@/lib/types";
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

async function loadOutcomeOdds(outcome: MarketOutcome): Promise<OddsResponse> {
  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiMarket(outcome.kalshi.ticker, outcome.kalshi.url),
    getPolymarketMarket(outcome.polymarket.marketId, outcome.polymarket.url),
  ]);
  return {
    kalshi: kalshi.status === "fulfilled" ? kalshi.value : null,
    kalshiError: kalshi.status === "rejected" ? String(kalshi.reason) : null,
    polymarket: polymarket.status === "fulfilled" ? polymarket.value : null,
    polymarketError:
      polymarket.status === "rejected" ? String(polymarket.reason) : null,
    fetchedAt: new Date().toISOString(),
  };
}

async function loadOutcomeHistory(outcome: MarketOutcome): Promise<HistoryResponse> {
  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiMarketHistory(outcome.kalshi.seriesTicker, outcome.kalshi.ticker),
    getPolymarketMarketHistory(outcome.polymarket.yesTokenId),
  ]);
  return {
    kalshi: kalshi.status === "fulfilled" ? kalshi.value : null,
    kalshiError: kalshi.status === "rejected" ? String(kalshi.reason) : null,
    polymarket: polymarket.status === "fulfilled" ? polymarket.value : null,
    polymarketError:
      polymarket.status === "rejected" ? String(polymarket.reason) : null,
    fetchedAt: new Date().toISOString(),
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
          Kalshi vs Polymarket, compared live. Resolves{" "}
          {content.market.resolutionDate}.
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
            polymarketAffiliateUrl={outcome.polymarket.url}
          />
          <HistoryChart data={history} candidateName={outcome.label} />
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
          Data sources: Kalshi public API and Polymarket Gamma/CLOB API.
          Prices are cached up to 30 seconds.
        </div>
        <div>{affiliateDisclosure(content.affiliateStatus)}</div>
      </footer>
    </main>
  );
}
