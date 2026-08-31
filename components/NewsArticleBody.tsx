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
  const cutoff = Math.floor(new Date(publishedAt).getTime() / 1000);

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
        const history = await loadOutcomeHistory(outcome, "all");
        return (
          <ArticleOddsChart
            key={i}
            data={history}
            cutoff={cutoff}
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
