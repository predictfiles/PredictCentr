import type { NewsArticleBlock } from "@/lib/types";
import type { MarketConfig } from "@/lib/types";

const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

/** Renders `[label](url)` markdown links inline; everything else is plain text. */
function renderInlineText(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  MARKDOWN_LINK.lastIndex = 0;
  while ((match = MARKDOWN_LINK.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(
      <a key={key++} href={match[2]} target="_blank" rel="noopener noreferrer nofollow">
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

/**
 * Renders a NewsArticle's body blocks in order -- paragraphs (with inline
 * markdown-link support) and pull quotes, the latter accented with the
 * related market's category color so it reads as part of the same
 * politics/sports/culture system used everywhere else on the site.
 */
export function NewsArticleBody({
  blocks,
  category,
}: {
  blocks: NewsArticleBlock[];
  category?: MarketConfig["category"];
}) {
  return (
    <>
      {blocks.map((block, i) =>
        block.type === "quote" ? (
          <blockquote
            key={i}
            className={`news-pull-quote${category ? ` news-pull-quote-${category}` : ""}`}
          >
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
