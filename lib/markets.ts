import type { ElectionInfo, MarketConfig, MarketContent, NewsItem } from "./types";
import jdVance2028Raw from "@/data/markets/2028-us-presidential-election-winner/jd-vance.json";
import donaldTrump2028Raw from "@/data/markets/2028-us-presidential-election-winner/donald-trump.json";
import kamalaHarris2028Raw from "@/data/markets/2028-us-presidential-election-winner/kamala-harris.json";
import senateDemocrats2026Raw from "@/data/markets/2026-us-senate-control/democrats.json";
import lebronNextTeamRaw from "@/data/markets/lebron-james-next-team.json";
import grokOdysseyFilmRaw from "@/data/markets/grok-imagine-odyssey-film.json";
import oscarOdysseyBestPictureRaw from "@/data/markets/oscar-winner-2027/the-odyssey.json";
import starshipMarsRaw from "@/data/markets/starship-humans-to-mars-2030.json";
import kawhiNextTeamRaw from "@/data/markets/kawhi-leonard-next-team.json";

// JSON imports infer string literal fields (e.g. "platform": "kalshi") as
// plain `string`, not the PlatformId union MarketContent actually needs --
// JSON has no way to express literal types. Cast once here rather than at
// every usage site; the underlying values are always valid, this just
// tells TypeScript what we already know to be true.
const jdVance2028 = jdVance2028Raw as MarketContent;
const donaldTrump2028 = donaldTrump2028Raw as MarketContent;
const kamalaHarris2028 = kamalaHarris2028Raw as MarketContent;
const senateDemocrats2026 = senateDemocrats2026Raw as MarketContent;
const lebronNextTeam = lebronNextTeamRaw as MarketContent;
const grokOdysseyFilm = grokOdysseyFilmRaw as MarketContent;
const oscarOdysseyBestPicture = oscarOdysseyBestPictureRaw as MarketContent;
const starshipMars = starshipMarsRaw as MarketContent;
const kawhiNextTeam = kawhiNextTeamRaw as MarketContent;

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
    slug: ["2028-us-presidential-election-winner", "kamala-harris"],
    category: "politics",
    shortDescription:
      "Live odds on Kamala Harris winning the 2028 presidential election, compared across Kalshi and Polymarket.",
    outcomes: [
      {
        id: "kamala-harris",
        label: "Kamala Harris",
        question: "Will Kamala Harris win?",
        kalshi: {
          ticker: "KXPRESPERSON-28-KHAR",
          seriesTicker: "KXPRESPERSON",
          url: "https://kalshi.com/markets/kxpresperson/kxpresperson-28?selectedMarketTicker=KXPRESPERSON-28-KHAR",
        },
        polymarket: {
          marketId: "561239",
          yesTokenId:
            "70663352401606372246362604193214664065595751757222752105245221905399175050480",
          url: "https://polymarket.com/event/presidential-election-winner-2028/will-kamala-harris-win-the-2028-us-presidential-election",
        },
      },
    ],
    content: kamalaHarris2028,
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
  {
    slug: ["oscar-winner-2027", "the-odyssey"],
    category: "culture",
    shortDescription:
      "Live odds on The Odyssey winning Best Picture at the 99th Academy Awards, tracked on Kalshi.",
    outcomes: [
      {
        id: "the-odyssey",
        label: "The Odyssey",
        question: "Will The Odyssey win Best Picture?",
        kalshi: {
          ticker: "KXOSCARPIC-27-ODY",
          seriesTicker: "KXOSCARPIC",
          url: "https://kalshi.com/markets/kxoscarpic/oscar-for-best-picture/kxoscarpic-27?selectedMarketTicker=KXOSCARPIC-27-ODY",
        },
        // Kalshi only -- Polymarket currently has just a Best Picture
        // NOMINATIONS market for The Odyssey, not a winner market.
      },
    ],
    content: oscarOdysseyBestPicture,
  },
  {
    slug: ["starship-humans-to-mars-2030"],
    category: "culture",
    shortDescription:
      "Live odds on SpaceX launching a manned Starship mission to Mars before 2030, tracked on Kalshi.",
    outcomes: [
      {
        id: "humans-to-mars",
        label: "Starship: Humans to Mars",
        question: "Will SpaceX launch a manned Starship mission to Mars before 2030?",
        kalshi: {
          ticker: "STARSHIPMARS-29DEC31",
          seriesTicker: "STARSHIPMARS",
          url: "https://kalshi.com/markets/kxstarshipmars/starship-launch-to-mars/starshipmars?selectedMarketTicker=STARSHIPMARS-29DEC31",
        },
        // Kalshi only -- no confirmed Polymarket market with matching
        // crewed-by-2030 resolution criteria. Don't confuse with Kalshi's
        // separate "will SpaceX land anything on Mars" market (uncrewed
        // included, prices notably higher) -- see resolutionNote.
      },
    ],
    content: starshipMars,
  },
  {
    slug: ["kawhi-leonard-next-team"],
    category: "sports",
    shortDescription:
      "Live odds on Kawhi Leonard's next team, compared across Kalshi and Polymarket.",
    outcomes: [
      {
        id: "toronto-raptors",
        label: "Toronto Raptors",
        question: "Will Kawhi Leonard's next team be the Raptors?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26KLEONARD2-TOR",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26kleonard2?selectedMarketTicker=KXNEXTTEAMNBA-26KLEONARD2-TOR",
        },
        polymarket: {
          marketId: "2730704",
          yesTokenId:
            "71442248608680775392175387904764925142154791124955324705502495372378633558564",
          url: "https://polymarket.com/event/nba-kawhi-leonard-next-team-20260629144203996/will-kawhi-play-for-the-toronto-raptors-in-2026-27-20260629144043516",
        },
      },
      {
        id: "los-angeles-clippers",
        label: "Los Angeles Clippers",
        question: "Will Kawhi Leonard stay with the Clippers?",
        kalshi: {
          ticker: "KXNEXTTEAMNBA-26KLEONARD2-LAC",
          seriesTicker: "KXNEXTTEAMNBA",
          url: "https://kalshi.com/markets/kxnextteamnba/next-nba-team/kxnextteamnba-26kleonard2?selectedMarketTicker=KXNEXTTEAMNBA-26KLEONARD2-LAC",
        },
        polymarket: {
          marketId: "2730689",
          yesTokenId:
            "37336475921711580283973873539558313505893324704942938603043928250201423680809",
          url: "https://polymarket.com/event/nba-kawhi-leonard-next-team-20260629144203996/will-kawhi-play-for-the-los-angeles-clippers-in-2026-27-20260629144043501",
        },
      },
    ],
    content: kawhiNextTeam,
  },
];

export const CATEGORY_LABELS: Record<MarketConfig["category"], string> = {
  politics: "Politics",
  sports: "Sports",
  culture: "Culture",
};

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
  {
    slug: "oscar-winner-2027",
    title: "Best Picture Winner — 99th Academy Awards",
    resolutionDate: "2027-03-14",
    description:
      "Compare odds on which film wins Best Picture at the 99th Academy Awards (nominations announced January 21, 2027; ceremony March 14, 2027), tracked on Kalshi.",
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
