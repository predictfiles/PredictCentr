import Link from "next/link";

/**
 * Minimal site-wide footer -- mainly exists so /editorial-standards/ and
 * /ai-disclosure/ are reachable from every page instead of sitting as
 * orphan URLs nothing links to.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span className="site-footer-copyright">
          © {new Date().getFullYear()} PredictCentr
        </span>
        <nav className="site-footer-links">
          <Link href="/editorial-standards/">Editorial Standards & Corrections</Link>
          <Link href="/ai-disclosure/">AI Use Disclosure</Link>
        </nav>
      </div>
    </footer>
  );
}
