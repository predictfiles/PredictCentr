import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  findMarket,
  markets,
  ELECTIONS,
  getElectionInfo,
  getElectionCandidates,
  getRelatedMarkets,
  getMarketThumbnail,
  CATEGORY_LABELS,
} from "@/lib/markets";
import { loadOutcomeOdds, loadOutcomeHistory } from "@/lib/oddsLoader";
import { affiliateDisclosure, formatDate } from "@/lib/format";
import { MarketBrief } from "@/components/MarketBrief";
import { NewsSection } from "@/components/NewsSection";
import { NewsSpotlight } from "@/components/NewsSpotlight";
import { OddsComparison } from "@/components/OddsComparison";
import { HistoryChart } from "@/components/HistoryChart";
import { MultiOutcomeHistoryChart, type ChartSeries } from "@/components/MultiOutcomeHistoryChart";
import { WhatToWatch } from "@/components/WhatToWatch";
import { MarketCard } from "@/components/MarketCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { MustReadTeaser } from "@/components/MustReadTeaser";
import { RelatedMarkets } from "@/components/RelatedMarkets";
import { CountdownTimer } from "@/components/CountdownTimer";
import { CategoryNav } from "@/components/CategoryNav";
import type { HistoryResponse, MarketConfig, OddsResponse } from "@/lib/types";
import { SITE_URL } from "@/lib/site";

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
  const url = `${SITE_URL}/${params.slug.join("/")}/`;
  const market = findMarket(params.slug);
  if (market) {
    const title = market.content.market.title;
    const description = market.shortDescription;
    const image = market.content.news.find((item) => item.image)?.image;
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: "website",
        images: image ? [image] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  }
  if (params.slug.length === 1) {
    const election = getElectionInfo(params.slug[0]);
    if (election) {
      const { title, description } = election;
      return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, type: "website" },
        twitter: { card: "summary_large_image", title, description },
      };
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

  const category = candidates[0].category;

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
          <h1 className="title">{election.title}</h1>
          <p className="subtitle">
            {election.description} Resolves {election.resolutionDate}.
          </p>
        </div>
        <CategoryNav />
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
  const thumbnail = getMarketThumbnail(market);

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

  // A shared chart only makes sense when there's nothing to lose by
  // dropping Polymarket -- if any outcome pairs with Polymarket, the
  // platform-vs-platform comparison on each outcome's own chart is more
  // valuable than an outcome-vs-outcome view would be, so that layout
  // stays per-outcome instead.
  const useCombinedChart = market.outcomes.length > 1 && !hasAnyPolymarket;
  const combinedSeries: ChartSeries[] = outcomesData.map(({ outcome, history }) => ({
    id: outcome.id,
    label: outcome.label,
    data: history.kalshi ?? [],
    historyUrlBase: settled
      ? undefined
      : `/api/markets/history?slug=${encodeURIComponent(slugPath)}&outcome=${encodeURIComponent(
          outcome.id
        )}`,
  }));

  const relatedMarkets = getRelatedMarkets(market);
  const relatedOddsByMarket = new Map<string, Record<string, OddsResponse>>();
  await Promise.all(
    relatedMarkets
      .filter((m) => !m.content.settled)
      .map(async (m) => {
        const entries = await Promise.all(
          m.outcomes.map(async (outcome) => [outcome.id, await loadOutcomeOdds(outcome)] as const)
        );
        relatedOddsByMarket.set(m.slug.join("/"), Object.fromEntries(entries));
      })
  );

  return (
    <>
      <header className={`header header-accent-${market.category}`}>
        <div className="header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="PredictCentr" className="brand-logo" />
          </Link>
          <div className={`category-tag category-tag-${market.category}`}>
            <CategoryIcon category={market.category} className="category-tag-icon" />
            {CATEGORY_LABELS[market.category]}
          </div>
          {parentElection && (
            <Link className="breadcrumb" href={`/${market.slug[0]}/`}>
              ← {parentElection.title}
            </Link>
          )}
          {settled && <div className="status-badge status-settled">Settled</div>}
          <div className="market-heading-row">
            {thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnail} alt="" className="market-heading-thumb" />
            )}
            <div className="market-heading-text">
              <h1 className="title">{content.market.title}</h1>
              {settled ? (
                <p className="subtitle">
                  Resolved {formatDate(settled.resolvedAt)}: {settled.result}
                </p>
              ) : (
                <p className="subtitle">
                  {hasAnyPolymarket ? "Kalshi vs Polymarket, compared live" : "Live odds from Kalshi"}
                  . Resolves {formatDate(content.market.resolutionDate)}
                  {" · "}
                  <CountdownTimer
                    targetDate={content.market.resolutionDate}
                    className="subtitle-countdown"
                  />
                </p>
              )}
            </div>
          </div>
        </div>
        <CategoryNav />
      </header>

      <main className="wrap">
        <div className="disclaimer">
          Prediction market prices reflect trader sentiment, not a guaranteed
          outcome. Nothing on this page is financial advice or a promise of any
          return.
        </div>

        {useCombinedChart && <MultiOutcomeHistoryChart series={combinedSeries} />}

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
            {!useCombinedChart && (
              <HistoryChart
                data={history}
                candidateName={outcome.label}
                hasPolymarket={Boolean(outcome.polymarket)}
                historyUrlBase={
                  settled
                    ? undefined
                    : `/api/markets/history?slug=${encodeURIComponent(
                        slugPath
                      )}&outcome=${encodeURIComponent(outcome.id)}`
                }
              />
            )}
          </div>
        ))}

        <NewsSpotlight items={content.news} />

        <MarketBrief
          text={content.marketBrief.text}
          updatedAt={content.marketBrief.updatedAt}
          author={content.marketBrief.author}
        />

        <section className="section">
          <div className="section-label">How This Resolves</div>
          <div className="card">
            <ul className="resolution-note-list">
              {content.market.resolutionNote.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </section>

        <NewsSection items={content.news} />

        <WhatToWatch items={content.whatToWatch} />

        <RelatedMarkets
          category={market.category}
          markets={relatedMarkets}
          oddsByMarket={relatedOddsByMarket}
        />

        <MustReadTeaser />
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
