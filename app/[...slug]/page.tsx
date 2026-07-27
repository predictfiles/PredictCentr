import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  findMarket,
  markets,
  ELECTIONS,
  getElectionInfo,
  getElectionCandidates,
} from "@/lib/markets";
import { loadOutcomeOdds, loadOutcomeHistory } from "@/lib/oddsLoader";
import { affiliateDisclosure, formatDate } from "@/lib/format";
import { MarketBrief } from "@/components/MarketBrief";
import { NewsSection } from "@/components/NewsSection";
import { OddsComparison } from "@/components/OddsComparison";
import { HistoryChart } from "@/components/HistoryChart";
import { WhatToWatch } from "@/components/WhatToWatch";
import { MarketCard } from "@/components/MarketCard";
import type { HistoryResponse, MarketConfig, OddsResponse } from "@/lib/types";

export const revalidate = 30;

export function generateStaticParams() {
  const marketParams = markets.map((m) => ({ slug: m.slug }));
  const hubParams = ELECTIONS.map((e) => ({ slug: [e.slug] }));
  return [...marketParams, ...hubParams];
}

export function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Metadata {
  const market = findMarket(params.slug);
  if (market) {
    return { title: market.content.market.title, description: market.shortDescription };
  }
  if (params.slug.length === 1) {
    const election = getElectionInfo(params.slug[0]);
    if (election) {
      return { title: election.title, description: election.description };
    }
  }
  return {};
}

const EMPTY_ODDS: OddsResponse = {
  kalshi: null,
  kalshiError: null,
  polymarket: null,
  polymarketError: null,
  fetchedAt: new Date(0).toISOString(),
};

const EMPTY_HISTORY: HistoryResponse = {
  kalshi: null,
  kalshiError: null,
  polymarket: null,
  polymarketError: null,
  fetchedAt: new Date(0).toISOString(),
};

async function ElectionHubPage({ electionSlug }: { electionSlug: string }) {
  const election = getElectionInfo(electionSlug);
  const candidates = getElectionCandidates(electionSlug);
  if (!election || candidates.length === 0) notFound();

  const oddsByMarket = new Map<string, Record<string, OddsResponse>>();
  await Promise.all(
    candidates.map(async (market) => {
      const entries = await Promise.all(
        market.outcomes.map(
          async (outcome) => [outcome.id, await loadOutcomeOdds(outcome)] as const
        )
      );
      oddsByMarket.set(market.slug.join("/"), Object.fromEntries(entries));
    })
  );

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="PredictCentr" className="brand-logo" />
          </Link>
          <h1 className="title">{election.title}</h1>
          <p className="subtitle">
            {election.description} Resolves {election.resolutionDate}.
          </p>
        </div>
      </header>

      <main className="wrap">
        <div className="disclaimer">
          Prediction market prices reflect trader sentiment, not a guaranteed
          outcome. Nothing on this page is financial advice or a promise of any
          return.
        </div>

        <section className="section">
          <div className="section-label">Candidates</div>
          <div className="market-card-list">
            {candidates.map((market) => (
              <MarketCard
                key={market.slug.join("/")}
                market={market}
                initialOdds={oddsByMarket.get(market.slug.join("/")) ?? {}}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

async function CandidateMarketPage({ market }: { market: MarketConfig }) {
  const slugPath = market.slug.join("/");
  const { content } = market;
  const hasAnyPolymarket = market.outcomes.some((o) => o.polymarket);
  const settled = content.settled;
  const parentElection = market.slug.length > 1 ? getElectionInfo(market.slug[0]) : undefined;

  // A settled market never hits Kalshi/Polymarket again -- it reads the
  // frozen snapshot captured at settlement instead of polling live.
  const outcomesData = settled
    ? market.outcomes.map((outcome) => ({
        outcome,
        odds: settled.finalOdds[outcome.id] ?? EMPTY_ODDS,
        history: settled.finalHistory[outcome.id] ?? EMPTY_HISTORY,
      }))
    : await Promise.all(
        market.outcomes.map(async (outcome) => {
          const [odds, history] = await Promise.all([
            loadOutcomeOdds(outcome),
            loadOutcomeHistory(outcome),
          ]);
          return { outcome, odds, history };
        })
      );

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="PredictCentr" className="brand-logo" />
          </Link>
          {parentElection && (
            <Link className="breadcrumb" href={`/${market.slug[0]}/`}>
              ← {parentElection.title}
            </Link>
          )}
          {settled && <div className="status-badge status-settled">Settled</div>}
          <h1 className="title">{content.market.title}</h1>
          {settled ? (
            <p className="subtitle">
              Resolved {formatDate(settled.resolvedAt)}: {settled.result}
            </p>
          ) : (
            <p className="subtitle">
              {hasAnyPolymarket ? "Kalshi vs Polymarket, compared live" : "Live odds from Kalshi"}
              . Resolves {content.market.resolutionDate}.
            </p>
          )}
          <ul className="resolution-note-list">
            {content.market.resolutionNote.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      </header>

      <main className="wrap">
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
              pollUrl={
                settled
                  ? undefined
                  : `/api/markets/odds?slug=${encodeURIComponent(
                      slugPath
                    )}&outcome=${encodeURIComponent(outcome.id)}`
              }
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
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            Data sources: Kalshi public API
            {hasAnyPolymarket ? " and Polymarket Gamma/CLOB API" : ""}.
            {settled
              ? " Odds shown are the final snapshot as of settlement."
              : " Prices are cached up to 30 seconds."}
          </div>
          <div>{affiliateDisclosure(content.affiliateStatus)}</div>
        </div>
      </footer>
    </>
  );
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const market = findMarket(params.slug);
  if (market) {
    return <CandidateMarketPage market={market} />;
  }
  if (params.slug.length === 1) {
    const election = getElectionInfo(params.slug[0]);
    if (election) {
      return <ElectionHubPage electionSlug={params.slug[0]} />;
    }
  }
  notFound();
}
