import Link from "next/link";
import { getRecentMustReadArticles, MUST_READ_CATEGORY_LABELS } from "@/lib/mustRead";

/**
 * Sits at the very bottom of a market page, below What to Watch -- deliberately
 * not in the header/nav, so it never competes with getting a visitor to the
 * odds and Market Brief first. Shows the latest article with a thumbnail;
 * otherwise just a plain link out to the hub.
 */
export function MustReadTeaser() {
  const [latest] = getRecentMustReadArticles(1);

  return (
    <section className="section">
      <div className="section-label">PredictCentr Must Read</div>
      <div className="card">
        {latest && (
          <Link
            className="must-read-thumb-row must-read-teaser-link"
            href={`/must-read/${latest.slug}/`}
          >
            {latest.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={latest.image} alt="" className="must-read-thumb" />
            )}
            <div>
              <div className="must-read-teaser-eyebrow">
                {MUST_READ_CATEGORY_LABELS[latest.category]}
              </div>
              <div className="must-read-teaser-title">{latest.title}</div>
            </div>
          </Link>
        )}
        <Link className="must-read-teaser-cta" href="/must-read/">
          See all Must Read guides and analysis →
        </Link>
      </div>
    </section>
  );
}
