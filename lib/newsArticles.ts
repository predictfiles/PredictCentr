import type { NewsArticle } from "./types";
import kawhiSuspensionOddsRaw from "@/data/news/kawhi-leonard-suspension-odds.json";
import talaricoTexasSenatePollsRaw from "@/data/news/talarico-leads-texas-senate-polls.json";
import wnbaTransParticipationMeetingRaw from "@/data/news/wnba-trans-participation-meeting.json";
import trumpBacksVance2028Raw from "@/data/news/trump-backs-vance-2028.json";
import lakersSoldRecord125bnRaw from "@/data/news/lakers-sold-record-12-5bn.json";
import jackLowdenBondOddsSurgeRaw from "@/data/news/jack-lowden-bond-odds-surge.json";
import aocFavoredDemocraticNomineeRaw from "@/data/news/aoc-favored-democratic-nominee.json";

const kawhiSuspensionOdds = kawhiSuspensionOddsRaw as NewsArticle;
const talaricoTexasSenatePolls = talaricoTexasSenatePollsRaw as NewsArticle;
const wnbaTransParticipationMeeting = wnbaTransParticipationMeetingRaw as NewsArticle;
const trumpBacksVance2028 = trumpBacksVance2028Raw as NewsArticle;
const lakersSoldRecord125bn = lakersSoldRecord125bnRaw as NewsArticle;
const jackLowdenBondOddsSurge = jackLowdenBondOddsSurgeRaw as NewsArticle;
const aocFavoredDemocraticNominee = aocFavoredDemocraticNomineeRaw as NewsArticle;

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
];

export function findNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

/** Most recent first -- newsArticles.ts appends new entries to the end. */
export function getRecentNewsArticles(limit: number): NewsArticle[] {
  return [...newsArticles].reverse().slice(0, limit);
}
