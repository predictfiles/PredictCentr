/**
 * Newspaper glyph for the "News" nav link -- same pure line-art,
 * currentColor treatment as CategoryIcon, kept separate since News isn't a
 * market category.
 */
export function NewsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 14,22 H 74 V 78 A 8,8 0 0 1 66,86 H 22 A 8,8 0 0 1 14,78 Z" />
        <path d="M 74,34 H 86 V 78 A 8,8 0 0 1 78,86 H 66" />
        <line x1="26" y1="38" x2="62" y2="38" />
        <line x1="26" y1="52" x2="62" y2="52" />
        <line x1="26" y1="64" x2="48" y2="64" />
      </g>
    </svg>
  );
}
