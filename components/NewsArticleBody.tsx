import type { NewsArticleBlock } from "@/lib/types";
import { renderInlineText } from "@/components/InlineMarkdownText";
import { formatDate } from "@/lib/format";
import { findMarket } from "@/lib/markets";
import { loadOutcomeHistory } from "@/lib/oddsLoader";
import { ArticleOddsChart } from "@/components/ArticleOddsChart";

/**
 * Renders a NewsArticle's body blocks in order -- paragraphs (with inline
 * markdown-link support), pull quotes (in the site's signature pink brand
 * accent, --trending, since that's a News-pillar treatment not a
 * market-page one), dated "Update" callouts for after-the-fact additions to
 * a published piece, and frozen odds-chart embeds. Async because a `chart`
 * block needs a server-side history fetch before it can render.
 */
export async function NewsArticleBody({
  blocks,
  relatedMarketSlug,
  publishedAt,
}: {
  blocks: NewsArticleBlock[];
  relatedMarketSlug: string;
  publishedAt: string;
}) {
  // End of the publish day (23:59:59 UTC), not its first second -- Kalshi's
  // daily candles are bucketed to end at 04:00 UTC, so a market that opened
  // the same day this article went up can have its only candle land just
  // after a plain midnight-UTC cutoff and get filtered out entirely.
  const cutoff = Math.floor(new Date(publishedAt).getTime() / 1000) + 86400 - 1;

  const rendered = await Promise.all(
    blocks.map(async (block, i) => {
      if (block.type === "quote") {
        return (
          <blockquote key={i} className="news-pull-quote">
            &ldquo;{block.text}&rdquo;
          </blockquote>
        );
      }
      if (block.type === "update") {
        return (
          <div key={i} className="news-update-box">
            <div className="news-update-label">Update &mdash; {formatDate(block.date)}</div>
            <p className="news-update-text">{renderInlineText(block.text)}</p>
          </div>
        );
      }
      if (block.type === "chart") {
        const market = findMarket(relatedMarketSlug.split("/"));
        const outcome = market?.outcomes.find((o) => o.id === block.outcomeId);
        if (!outcome) return null;
        // A settled market (e.g. archived by the exchange) has no live
        // price feed left to fetch -- use its already-frozen finalHistory
        // instead of a live call, same source the market page itself uses.
        const settledHistory = market?.content.settled?.finalHistory[block.outcomeId];
        const history = settledHistory ?? (await loadOutcomeHistory(outcome, "all"));
        // A settled market's own history can run past the article's
        // publishedAt (e.g. it kept trading for days after this piece went
        // up) -- clipping to publishedAt there would silently drop points
        // or empty the chart entirely. Use the market's own last data point
        // as the cutoff instead, so the caption honestly reads "as of
        // <when it actually stopped trading>" rather than the article date.
        let chartCutoff = cutoff;
        if (settledHistory) {
          const allT = [...(settledHistory.kalshi ?? []), ...(settledHistory.polymarket ?? [])].map(
            (p) => p.t
          );
          if (allT.length > 0) chartCutoff = Math.max(...allT);
        }
        return (
          <ArticleOddsChart
            key={i}
            data={history}
            cutoff={chartCutoff}
            caption={block.caption}
            idPrefix={`news-chart-${i}`}
          />
        );
      }
      return (
        <p key={i} className="news-article-paragraph">
          {renderInlineText(block.text)}
        </p>
      );
    })
  );

  return <>{rendered}</>;
}
