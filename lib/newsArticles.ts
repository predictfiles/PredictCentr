import type { NewsArticle } from "./types";
import kawhiSuspensionOddsRaw from "@/data/news/kawhi-leonard-suspension-odds.json";
import talaricoTexasSenatePollsRaw from "@/data/news/talarico-leads-texas-senate-polls.json";
import wnbaTransParticipationMeetingRaw from "@/data/news/wnba-trans-participation-meeting.json";
import trumpBacksVance2028Raw from "@/data/news/trump-backs-vance-2028.json";
import lakersSoldRecord125bnRaw from "@/data/news/lakers-sold-record-12-5bn.json";
import jackLowdenBondOddsSurgeRaw from "@/data/news/jack-lowden-bond-odds-surge.json";
import aocFavoredDemocraticNomineeRaw from "@/data/news/aoc-favored-democratic-nominee.json";
import curryTradeRumorsClickbaitRaw from "@/data/news/curry-trade-rumors-clickbait.json";
import belichickTightLippedLombardiRaw from "@/data/news/belichick-tight-lipped-lombardi.json";
import trumpCutsSouthKoreaMilitaryDrillsRaw from "@/data/news/trump-cuts-south-korea-military-drills.json";
import nbaBlastsEspnClippersInaccuraciesRaw from "@/data/news/nba-blasts-espn-clippers-inaccuracies.json";
import freedomMocksAngelReesePaulGeorgeRaw from "@/data/news/freedom-mocks-angel-reese-paul-george.json";
import callumTurnerNoCommentBondSurgesRaw from "@/data/news/callum-turner-no-comment-bond-surges.json";
import gta6GameplayLeaksReleaseOddsRaw from "@/data/news/gta-6-gameplay-leaks-release-odds.json";
import polymarketArchivesFreedomWnbaMarketRaw from "@/data/news/polymarket-archives-freedom-wnba-market.json";
import turkeyInterpolRedNoticeNetanyahuRaw from "@/data/news/turkey-interpol-red-notice-netanyahu.json";
import israelTurkeyTensionsMilitaryClashOddsRaw from "@/data/news/israel-turkey-tensions-military-clash-odds.json";
import senateControl5050TrumpImpeachmentOddsRaw from "@/data/news/senate-control-50-50-trump-impeachment-odds.json";
import freedomKickedOutWnbaGameRaw from "@/data/news/freedom-kicked-out-wnba-game.json";
import usCanadaTradeWarTerritoryOddsRaw from "@/data/news/us-canada-trade-war-territory-odds.json";
import jackBartonBondFrontrunnerRaw from "@/data/news/jack-barton-bond-frontrunner.json";
import israelGreeceDefensePactClashOddsRaw from "@/data/news/israel-greece-defense-pact-clash-odds.json";
import spacexMarsOddsAllTimeLowRaw from "@/data/news/spacex-mars-odds-all-time-low.json";
import clippersFineKeepingKawhiLeonardRaw from "@/data/news/clippers-fine-keeping-kawhi-leonard.json";

const kawhiSuspensionOdds = kawhiSuspensionOddsRaw as NewsArticle;
const talaricoTexasSenatePolls = talaricoTexasSenatePollsRaw as NewsArticle;
const wnbaTransParticipationMeeting = wnbaTransParticipationMeetingRaw as NewsArticle;
const trumpBacksVance2028 = trumpBacksVance2028Raw as NewsArticle;
const lakersSoldRecord125bn = lakersSoldRecord125bnRaw as NewsArticle;
const jackLowdenBondOddsSurge = jackLowdenBondOddsSurgeRaw as NewsArticle;
const aocFavoredDemocraticNominee = aocFavoredDemocraticNomineeRaw as NewsArticle;
const curryTradeRumorsClickbait = curryTradeRumorsClickbaitRaw as NewsArticle;
const belichickTightLippedLombardi = belichickTightLippedLombardiRaw as NewsArticle;
const trumpCutsSouthKoreaMilitaryDrills = trumpCutsSouthKoreaMilitaryDrillsRaw as NewsArticle;
const nbaBlastsEspnClippersInaccuracies = nbaBlastsEspnClippersInaccuraciesRaw as NewsArticle;
const freedomMocksAngelReesePaulGeorge = freedomMocksAngelReesePaulGeorgeRaw as NewsArticle;
const callumTurnerNoCommentBondSurges = callumTurnerNoCommentBondSurgesRaw as NewsArticle;
const gta6GameplayLeaksReleaseOdds = gta6GameplayLeaksReleaseOddsRaw as NewsArticle;
const polymarketArchivesFreedomWnbaMarket = polymarketArchivesFreedomWnbaMarketRaw as NewsArticle;
const turkeyInterpolRedNoticeNetanyahu = turkeyInterpolRedNoticeNetanyahuRaw as NewsArticle;
const israelTurkeyTensionsMilitaryClashOdds = israelTurkeyTensionsMilitaryClashOddsRaw as NewsArticle;
const senateControl5050TrumpImpeachmentOdds = senateControl5050TrumpImpeachmentOddsRaw as NewsArticle;
const freedomKickedOutWnbaGame = freedomKickedOutWnbaGameRaw as NewsArticle;
const usCanadaTradeWarTerritoryOdds = usCanadaTradeWarTerritoryOddsRaw as NewsArticle;
const jackBartonBondFrontrunner = jackBartonBondFrontrunnerRaw as NewsArticle;
const israelGreeceDefensePactClashOdds = israelGreeceDefensePactClashOddsRaw as NewsArticle;
const spacexMarsOddsAllTimeLow = spacexMarsOddsAllTimeLowRaw as NewsArticle;
const clippersFineKeepingKawhiLeonard = clippersFineKeepingKawhiLeonardRaw as NewsArticle;

// Add a new article by appending an entry here (with its own content file
// under data/news/) -- same "add an entry" pattern as lib/markets.ts and
// lib/mustRead.ts.
export const newsArticles: NewsArticle[] = [
  kawhiSuspensionOdds,
  talaricoTexasSenatePolls,
  wnbaTransParticipationMeeting,
  trumpBacksVance2028,
  lakersSoldRecord125bn,
  jackLowdenBondOddsSurge,
  aocFavoredDemocraticNominee,
  curryTradeRumorsClickbait,
  belichickTightLippedLombardi,
  trumpCutsSouthKoreaMilitaryDrills,
  nbaBlastsEspnClippersInaccuracies,
  freedomMocksAngelReesePaulGeorge,
  callumTurnerNoCommentBondSurges,
  gta6GameplayLeaksReleaseOdds,
  polymarketArchivesFreedomWnbaMarket,
  turkeyInterpolRedNoticeNetanyahu,
  israelTurkeyTensionsMilitaryClashOdds,
  senateControl5050TrumpImpeachmentOdds,
  freedomKickedOutWnbaGame,
  usCanadaTradeWarTerritoryOdds,
  jackBartonBondFrontrunner,
  israelGreeceDefensePactClashOdds,
  spacexMarsOddsAllTimeLow,
  clippersFineKeepingKawhiLeonard,
];

export function findNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

/** Most recent first -- newsArticles.ts appends new entries to the end. */
export function getRecentNewsArticles(limit: number): NewsArticle[] {
  return [...newsArticles].reverse().slice(0, limit);
}
