import type { NewsArticleBlock } from "@/lib/types";
import { renderInlineText } from "@/components/InlineMarkdownText";

/**
 * Renders a NewsArticle's body blocks in order -- paragraphs (with inline
 * markdown-link support) and pull quotes, the latter in the site's
 * signature pink brand accent (--trending) rather than a category color,
 * since a pull quote is a News-pillar treatment, not a market-page one.
 */
export function NewsArticleBody({ blocks }: { blocks: NewsArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, i) =>
        block.type === "quote" ? (
          <blockquote key={i} className="news-pull-quote">
            &ldquo;{block.text}&rdquo;
          </blockquote>
        ) : (
          <p key={i} className="news-article-paragraph">
            {renderInlineText(block.text)}
          </p>
        )
      )}
    </>
  );
}
