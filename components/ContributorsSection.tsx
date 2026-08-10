import Link from "next/link";
import type { Contributor } from "@/lib/types";

/**
 * Footer-level credibility strip -- outside experts who've contributed
 * insight/quotes to PredictCentr's own reporting. Deliberately lightweight
 * and placed below the Archive section so it doesn't compete with the
 * News/Hot Market/category grids for attention; it's a trust signal for
 * readers who've scrolled the full page, not a growth-driving element.
 *
 * Each card is just a teaser (photo/name/title/credential) linking through
 * to the contributor's own page at /contributors/<slug>/, which holds the
 * full bio and outbound link -- kept off the homepage itself. Adding a
 * contributor is just appending to data/contributors.json.
 */
export function ContributorsSection({ contributors }: { contributors: Contributor[] }) {
  if (contributors.length === 0) return null;

  return (
    <section className="section contributors-section">
      <div className="section-label">Contributors</div>
      <div className="contributors-list">
        {contributors.map((c) => (
          <Link className="contributor-card" href={`/contributors/${c.slug}/`} key={c.slug}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.photo} alt={c.name} className="contributor-photo" />
            <div className="contributor-body">
              <div className="contributor-name">{c.name}</div>
              <div className="contributor-title">
                {c.title}, {c.company}
              </div>
              <div className="contributor-credential">{c.credentialLine}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
