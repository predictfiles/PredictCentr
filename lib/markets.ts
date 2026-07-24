import type { MarketConfig, NewsItem } from "./types";
import jdVance2028 from "@/data/markets/2028-us-presidential-election-winner/jd-vance.json";
import senateDemocrats2026 from "@/data/markets/2026-us-senate-control/democrats.json";
import lebronNextTeam from "@/data/markets/lebron-james-next-team.json";

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
      "Live odds on where LeBron James plays next season -- Heat vs. Cavaliers -- compared across Kalshi and Polymarket.",
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
];

export function findMarket(slug: string[]): MarketConfig | undefined {
  return markets.find(
    (m) => m.slug.length === slug.length && m.slug.every((s, i) => s === slug[i])
  );
}

// The homepage's featured "Hot Market" slot -- manually set, no auto-ranking
// yet. Change this one value to feature a different market; update by hand
// whenever the hot market changes.
export const HOT_MARKET_SLUG = ["lebron-james-next-team"];

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
