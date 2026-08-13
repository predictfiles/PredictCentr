import type { NewsArticleBlock } from "@/lib/types";
import { renderInlineText } from "@/components/InlineMarkdownText";
import { formatDate } from "@/lib/format";

/**
 * Renders a NewsArticle's body blocks in order -- paragraphs (with inline
 * markdown-link support), pull quotes (in the site's signature pink brand
 * accent, --trending, since that's a News-pillar treatment not a
 * market-page one), and dated "Update" callouts for after-the-fact
 * additions to a published piece.
 */
export function NewsArticleBody({ blocks }: { blocks: NewsArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
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
        return (
          <p key={i} className="news-article-paragraph">
            {renderInlineText(block.text)}
          </p>
        );
      })}
    </>
  );
}
