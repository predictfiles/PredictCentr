import type { MarketConfig } from "./types";
import jdVance2028 from "@/data/markets/2028-us-presidential-election-winner/jd-vance.json";
import senateDemocrats2026 from "@/data/markets/2026-us-senate-control/democrats.json";

// Add a new market by appending an entry here (with its own content file
// under data/markets/<electionSlug>/<candidateSlug>.json) -- nothing else
// needs to change for it to get a page, API routes, and a homepage card.
export const markets: MarketConfig[] = [
  {
    electionSlug: "2028-us-presidential-election-winner",
    candidateSlug: "jd-vance",
    shortDescription:
      "Live odds on JD Vance winning the 2028 presidential election, compared across Kalshi and Polymarket.",
    kalshi: {
      ticker: "KXPRESPERSON-28-JVAN",
      seriesTicker: "KXPRESPERSON",
    },
    polymarket: {
      marketId: "561229",
      yesTokenId:
        "16040015440196279900485035793550429453516625694844857319147506590755961451627",
    },
    content: jdVance2028,
  },
  {
    electionSlug: "2026-us-senate-control",
    candidateSlug: "democrats",
    shortDescription:
      "Live odds on Democrats winning control of the US Senate in 2026, compared across Kalshi and Polymarket.",
    kalshi: {
      ticker: "CONTROLS-2026-D",
      seriesTicker: "CONTROLS",
    },
    polymarket: {
      marketId: "562793",
      yesTokenId:
        "113287701564209339913693347405685749986285999146352375265161592243948562084773",
    },
    content: senateDemocrats2026,
  },
];

export function findMarket(
  electionSlug: string,
  candidateSlug: string
): MarketConfig | undefined {
  return markets.find(
    (m) => m.electionSlug === electionSlug && m.candidateSlug === candidateSlug
  );
}
