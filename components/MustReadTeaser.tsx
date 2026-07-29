import Link from "next/link";
import { getRecentMustReadArticles, MUST_READ_CATEGORY_LABELS } from "@/lib/mustRead";

/**
 * Sits at the very bottom of a market page, below What to Watch -- deliberately
 * not in the header/nav, so it never competes with getting a visitor to the
 * odds and Market Brief first. Shows a couple of recent articles when any
 * exist; otherwise just a plain link out to the hub.
 */
export function MustReadTeaser() {
  const recentArticles = getRecentMustReadArticles(2);

  return (
    <section className="section">
      <div className="section-label">PredictCentr Must Read</div>
      <div className="card">
        {recentArticles.length > 0 && (
          <div className="must-read-teaser-list">
            {recentArticles.map((article) => (
              <Link
                key={article.slug}
                className="must-read-teaser-link"
                href={`/must-read/${article.slug}/`}
              >
                <div className="must-read-teaser-eyebrow">
                  {MUST_READ_CATEGORY_LABELS[article.category]}
                </div>
                <div className="must-read-teaser-title">{article.title}</div>
                <div className="must-read-teaser-desc">{article.teaser}</div>
              </Link>
            ))}
          </div>
        )}
        <Link className="must-read-teaser-cta" href="/must-read/">
          See all Must Read guides and analysis →
        </Link>
      </div>
    </section>
  );
}
