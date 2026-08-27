import type { MustReadBlock } from "@/lib/types";
import { renderInlineText } from "@/components/InlineMarkdownText";

/**
 * Renders a MustReadArticle's body blocks in order -- paragraphs (with
 * inline markdown-link/italics support), pull quotes, and inline images
 * (e.g. a supporting chart placed above the paragraph it illustrates).
 * Same pull-quote treatment as NewsArticleBody, reused rather than
 * duplicated since it's the same visual language.
 */
export function MustReadBody({ blocks }: { blocks: MustReadBlock[] }) {
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
        if (block.type === "image") {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={block.src}
              alt={block.alt ?? ""}
              className="must-read-inline-image"
            />
          );
        }
        if (block.type === "question") {
          return (
            <p key={i} className="must-read-question">
              {renderInlineText(block.text)}
            </p>
          );
        }
        return (
          <p key={i} className="must-read-paragraph">
            {renderInlineText(block.text)}
          </p>
        );
      })}
    </>
  );
}
