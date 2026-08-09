const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;
const MARKDOWN_ITALIC = /\*([^*]+)\*/g;

/** Renders `*text*` italics (e.g. publication names) inline within a plain-text segment. */
function renderItalics(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  MARKDOWN_ITALIC.lastIndex = 0;
  while ((match = MARKDOWN_ITALIC.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(<em key={`${keyPrefix}-em-${i++}`}>{match[1]}</em>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

/** Renders `[label](url)` markdown links and `*text*` italics inline; everything else is plain text. */
export function renderInlineText(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  MARKDOWN_LINK.lastIndex = 0;
  while ((match = MARKDOWN_LINK.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(...renderItalics(text.slice(lastIndex, match.index), `pre-${key}`));
    }
    nodes.push(
      <a key={key} href={match[2]} target="_blank" rel="noopener noreferrer nofollow">
        {renderItalics(match[1], `link-${key}`)}
      </a>
    );
    key++;
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(...renderItalics(text.slice(lastIndex), `post-${key}`));
  }
  return nodes;
}
