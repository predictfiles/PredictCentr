import type { MustReadArticle } from "./types";

// Add a new article by appending an entry here (with its own content file
// under data/must-read/) -- same "add an entry" pattern as lib/markets.ts.
export const mustReadArticles: MustReadArticle[] = [];

export const MUST_READ_CATEGORY_LABELS: Record<MustReadArticle["category"], string> = {
  legality: "Legality Guide",
  analysis: "Market Analysis",
};

export function findMustReadArticle(slug: string): MustReadArticle | undefined {
  return mustReadArticles.find((a) => a.slug === slug);
}

/** Most recent first -- articles.ts appends new entries to the end. */
export function getRecentMustReadArticles(limit: number): MustReadArticle[] {
  return [...mustReadArticles].reverse().slice(0, limit);
}
