/**
 * Magnifying-glass glyph for the homepage task bar's market search --
 * same pure line-art, currentColor treatment as NewsIcon/CategoryIcon.
 */
export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="42" cy="42" r="26" />
        <line x1="61" y1="61" x2="86" y2="86" />
      </g>
    </svg>
  );
}
