import type { NewsArticle } from "./types";
import kawhiSuspensionOddsRaw from "@/data/news/kawhi-leonard-suspension-odds.json";
import talaricoTexasSenatePollsRaw from "@/data/news/talarico-leads-texas-senate-polls.json";
import wnbaTransParticipationMeetingRaw from "@/data/news/wnba-trans-participation-meeting.json";

const kawhiSuspensionOdds = kawhiSuspensionOddsRaw as NewsArticle;
const talaricoTexasSenatePolls = talaricoTexasSenatePollsRaw as NewsArticle;
const wnbaTransParticipationMeeting = wnbaTransParticipationMeetingRaw as NewsArticle;

// Add a new article by appending an entry here (with its own content file
// under data/news/) -- same "add an entry" pattern as lib/markets.ts and
// lib/mustRead.ts.
export const newsArticles: NewsArticle[] = [
  kawhiSuspensionOdds,
  talaricoTexasSenatePolls,
  wnbaTransParticipationMeeting,
];

export function findNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}

/** Most recent first -- newsArticles.ts appends new entries to the end. */
export function getRecentNewsArticles(limit: number): NewsArticle[] {
  return [...newsArticles].reverse().slice(0, limit);
}
