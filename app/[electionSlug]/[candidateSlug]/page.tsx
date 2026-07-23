import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { findMarket, markets } from "@/lib/markets";
import { getKalshiMarket, getKalshiMarketHistory } from "@/lib/kalshi";
import { getPolymarketMarket, getPolymarketMarketHistory } from "@/lib/polymarket";
import type { HistoryResponse, MarketConfig, OddsResponse } from "@/lib/types";
import { MarketBrief } from "@/components/MarketBrief";
import { NewsSection } from "@/components/NewsSection";
import { OddsComparison } from "@/components/OddsComparison";
import { HistoryChart } from "@/components/HistoryChart";
import { WhatToWatch } from "@/components/WhatToWatch";

export const revalidate = 30;

export function generateStaticParams() {
  return markets.map((m) => ({
    electionSlug: m.electionSlug,
    candidateSlug: m.candidateSlug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { electionSlug: string; candidateSlug: string };
}): Metadata {
  const market = findMarket(params.electionSlug, params.candidateSlug);
  if (!market) return {};
  return {
    title: `${market.content.market.candidate} — ${market.content.market.title}`,
    description: market.shortDescription,
  };
}

async function loadInitialOdds(market: MarketConfig): Promise<OddsResponse> {
  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiMarket(market.kalshi.ticker, market.content.affiliateLinks.kalshi.url),
    getPolymarketMarket(
      market.polymarket.marketId,
      market.content.affiliateLinks.polymarket.url
    ),
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

async function loadInitialHistory(market: MarketConfig): Promise<HistoryResponse> {
  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiMarketHistory(market.kalshi.seriesTicker, market.kalshi.ticker),
    getPolymarketMarketHistory(market.polymarket.yesTokenId),
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
  params: { electionSlug: string; candidateSlug: string };
}) {
  const market = findMarket(params.electionSlug, params.candidateSlug);
  if (!market) notFound();

  const [odds, history] = await Promise.all([
    loadInitialOdds(market),
    loadInitialHistory(market),
  ]);

  const { content } = market;
  const apiPath = `/api/markets/${market.electionSlug}/${market.candidateSlug}`;

  return (
    <main className="wrap">
      <header className="header">
        <Link className="brand" href="/">
          PredictCentr
        </Link>
        <h1 className="title">
          {content.market.candidate} — {content.market.title}
        </h1>
        <p className="subtitle">
          Kalshi vs Polymarket, compared live. Resolves{" "}
          {content.market.resolutionDate}.
        </p>
      </header>

      <div className="disclaimer">
        Prediction market prices reflect trader sentiment, not a guaranteed
        outcome. Nothing on this page is financial advice or a promise of any
        return.
      </div>

      <OddsComparison
        initialData={odds}
        apiPath={apiPath}
        candidateName={content.market.candidate}
        kalshiAffiliateUrl={content.affiliateLinks.kalshi.url}
        polymarketAffiliateUrl={content.affiliateLinks.polymarket.url}
      />

      <HistoryChart data={history} candidateName={content.market.candidate} />

      <MarketBrief
        text={content.marketBrief.text}
        updatedAt={content.marketBrief.updatedAt}
        author={content.marketBrief.author}
      />

      <NewsSection items={content.news} />

      <WhatToWatch items={content.whatToWatch} />

      <footer className="footer">
        <div>
          Data sources: Kalshi public API ({market.kalshi.ticker}) and
          Polymarket Gamma/CLOB API. Prices are cached up to 30 seconds.
        </div>
        <div>
          Contains affiliate links to Kalshi and Polymarket — PredictCentr may
          earn a commission if you sign up through them, at no extra cost to
          you.
        </div>
      </footer>
    </main>
  );
}
