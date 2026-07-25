import type { ElectionInfo, MarketConfig, NewsItem } from "./types";
import jdVance2028 from "@/data/markets/2028-us-presidential-election-winner/jd-vance.json";
import donaldTrump2028 from "@/data/markets/2028-us-presidential-election-winner/donald-trump.json";
import senateDemocrats2026 from "@/data/markets/2026-us-senate-control/democrats.json";
import lebronNextTeam from "@/data/markets/lebron-james-next-team.json";
import grokOdysseyFilm from "@/data/markets/grok-imagine-odyssey-film.json";

// Add a new market by appending an entry here (with its own content file
// under data/markets/) -- nothing else needs to change for it to get a
// page, API routes, and a homepage card. Most markets are binary and only
// need one entry in `outcomes`; a multi-outcome market like LeBron's next
// team tracks a handful of real contenders as separate outcome entries.
export const markets: MarketConfig[] = [
  {
    slug: ["2028-us-presidential-election-winner", "jd-vance"],
    category: "politics",
    shortDescription:
      "Live odds on JD Vance winning the 2028 presidential election, compared across Kalshi and Polymarket.",
    outcomes: [
      {
        id: "jd-vance",
        label: "JD Vance",
        question: "Will JD Vance win?",
        kalshi: {
          ticker: "KXPRESPERSON-28-JVAN",
          seriesTicker: "KXPRESPERSON",
          url: "https://kalshi.com/markets/kxpresperson/kxpresperson-28?selectedMarketTicker=KXPRESPERSON-28-JVAN",
        },
        polymarket: {
          marketId: "561229",
          yesTokenId:
            "16040015440196279900485035793550429453516625694844857319147506590755961451627",
          url: "https://polymarket.com/event/presidential-election-winner-2028/will-jd-vance-win-the-2028-us-presidential-election",
        },
      },
    ],
    content: jdVance2028,
  },
  {
    slug: ["2028-us-presidential-election-winner", "donald-trump"],
    category: "politics",
    shortDescription:
      "Live odds on Donald Trump winning the 2028 presidential election, compared across Kalshi and Polymarket.",
    outcomes: [
      {
        id: "donald-trump",
        label: "Donald Trump",
        question: "Will Donald Trump win?",
        kalshi: {
          ticker: "KXPRESPERSON-28-DTRU",
          seriesTicker: "KXPRESPERSON",
          url: "https://kalshi.com/markets/kxpresperson/kxpresperson-28?selectedMarketTicker=KXPRESPERSON-28-DTRU",
        },
        polymarket: {
          marketId: "561243",
          yesTokenId:
            "11807691644868166983390207408868795383945915035851758101409310535538572683733",
          url: "https://polymarket.com/event/presidential-election-winner-2028/will-donald-trump-win-the-2028-us-presidential-election",
        },
      },
    ],
    content: donaldTrump2028,
  },
  {
    slug: ["2026-us-senate-control", "democrats"],
    category: "politics",
    shortDescription:
      "Live odds on Democrats winning control of the US Senate in 2026, compared across Kalshi and Polymarket.",
    outcomes: [
      {
        id: "democrats",
        label: "Democrats",
        question: "Will Democrats win the Senate?",
        kalshi: {
          ticker: "CONTROLS-2026-D",
          seriesTicker: "CONTROLS",
          url: "https://kalshi.com/markets/controls/controls-2026?selectedMarketTicker=CONTROLS-2026-D",
        },
        polymarket: {
          marketId: "562793",
          yesTokenId:
            "113287701564209339913693347405685749986285999146352375265161592243948562084773",
          url: "https://polymarket.com/event/which-party-will-win-the-senate-in-2026/will-the-democratic-party-control-the-senate-after-the-2026-midterm-elections",
        },
      },
    ],
    content: senateDemocrats2026,
  },
  {
    slug: ["lebron-james-next-team"],
    category: "sports",
    shortDescription:
      "Settled: LeBron signed with Philadelphia. See how Heat vs. Cavaliers odds moved beforehand on Kalshi and Polymarket.",
    outcomes: [
      {
        id: "miami-heat",
        label: "Miami Heat",
        question: "Will LeBron sign with the Heat?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26LJAM-MIA",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26ljam?selectedMarketTicker=KXNEXTTEAMNBA-26LJAM-MIA",
        },
        polymarket: {
          marketId: "1931114",
          yesTokenId:
            "62429084067171308316390058541012087925567325563248051217584518806867987132248",
          url: "https://polymarket.com/event/nba-lebron-james-next-team/will-lebron-james-play-for-the-miami-heat-in-2026-27",
        },
      },
      {
        id: "cleveland-cavaliers",
        label: "Cleveland Cavaliers",
        question: "Will LeBron return to the Cavaliers?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26LJAM-CLE",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26ljam?selectedMarketTicker=KXNEXTTEAMNBA-26LJAM-CLE",
        },
        polymarket: {
          marketId: "1931104",
          yesTokenId:
            "67044318499994712064109988308237618254832029882233414790755517483383764496170",
          url: "https://polymarket.com/event/nba-lebron-james-next-team/will-lebron-james-play-for-the-cleveland-cavaliers-in-2026-27",
        },
      },
    ],
    content: lebronNextTeam,
  },
  {
    slug: ["grok-imagine-odyssey-film"],
    category: "culture",
    shortDescription:
      "Live odds on whether xAI's Grok Imagine releases a full-length Odyssey film by the end of 2026, tracked on Kalshi.",
    outcomes: [
      {
        id: "released-2026",
        label: "Grok Imagine's Odyssey Film",
        question: "Will the film release in 2026?",
        kalshi: {
          ticker: "KXMOVIERELEASEDATE-GRO-27JAN01",
          seriesTicker: "KXMOVIERELEASEDATE",
          url: "https://kalshi.com/markets/kxmoviereleasedate/when-will-movie-release/kxmoviereleasedate-gro?selectedMarketTicker=KXMOVIERELEASEDATE-GRO-27JAN01",
        },
        // Kalshi only -- no Polymarket market exists for this one.
      },
    ],
    content: grokOdysseyFilm,
  },
];

export function findMarket(slug: string[]): MarketConfig | undefined {
  return markets.find(
    (m) => m.slug.length === slug.length && m.slug.every((s, i) => s === slug[i])
  );
}

// Metadata for each "race" that 2-segment candidate markets nest under.
// Add an entry here (matching the shared first slug segment) to get a hub
// page at /<electionSlug>/ listing every candidate market registered under
// it -- no page/route work needed, same "add an entry" pattern as markets.
export const ELECTIONS: ElectionInfo[] = [
  {
    slug: "2028-us-presidential-election-winner",
    title: "2028 U.S. Presidential Election Winner",
    resolutionDate: "2028-11-07",
    description:
      "Compare odds across candidates in the 2028 U.S. Presidential Election, tracked on Kalshi and Polymarket.",
  },
];

export function getElectionInfo(electionSlug: string): ElectionInfo | undefined {
  return ELECTIONS.find((e) => e.slug === electionSlug);
}

/** Every candidate market registered under a given election's slug. */
export function getElectionCandidates(electionSlug: string): MarketConfig[] {
  return markets.filter((m) => m.slug.length === 2 && m.slug[0] === electionSlug);
}

// The homepage's featured "Hot Market" slot -- manually set, no auto-ranking
// yet. Change this one value to feature a different market; update by hand
// whenever the hot market changes.
export const HOT_MARKET_SLUG = ["2028-us-presidential-election-winner", "donald-trump"];

export function getHotMarket(): MarketConfig | undefined {
  return findMarket(HOT_MARKET_SLUG);
}

/**
 * The single most recent news item for a market, by actual date comparison
 * -- not just "whichever is first in the array" -- so this stays correct
 * even if a news list is ever appended to out of order.
 */
export function getMostRecentNews(market: MarketConfig): NewsItem | null {
  return market.content.news.reduce<NewsItem | null>(
    (newest, item) => (!newest || item.date > newest.date ? item : newest),
    null
  );
}
