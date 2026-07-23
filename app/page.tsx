import content from "@/data/content.json";
import { getKalshiVanceMarket, getKalshiVanceHistory } from "@/lib/kalshi";
import { getPolymarketVanceMarket, getPolymarketVanceHistory } from "@/lib/polymarket";
import type { HistoryResponse, OddsResponse } from "@/lib/types";
import { MarketBrief } from "@/components/MarketBrief";
import { NewsSection } from "@/components/NewsSection";
import { OddsComparison } from "@/components/OddsComparison";
import { HistoryChart } from "@/components/HistoryChart";
import { WhatToWatch } from "@/components/WhatToWatch";

export const revalidate = 30;

async function loadInitialOdds(): Promise<OddsResponse> {
  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiVanceMarket(),
    getPolymarketVanceMarket(),
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

async function loadInitialHistory(): Promise<HistoryResponse> {
  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiVanceHistory(),
    getPolymarketVanceHistory(),
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

export default async function Home() {
  const [odds, history] = await Promise.all([
    loadInitialOdds(),
    loadInitialHistory(),
  ]);

  return (
    <main className="wrap">
      <header className="header">
        <div className="brand">PredictCentr</div>
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
        kalshiAffiliateUrl={content.affiliateLinks.kalshi.url}
        polymarketAffiliateUrl={content.affiliateLinks.polymarket.url}
      />

      <HistoryChart data={history} />

      <MarketBrief
        text={content.marketBrief.text}
        updatedAt={content.marketBrief.updatedAt}
      />

      <NewsSection items={content.news} />

      <WhatToWatch items={content.whatToWatch} />

      <footer className="footer">
        <div>
          Data sources: Kalshi public API (KXPRESPERSON-28-JVAN) and
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
