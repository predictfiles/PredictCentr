import type { NewsArticleBlock } from "@/lib/types";

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
