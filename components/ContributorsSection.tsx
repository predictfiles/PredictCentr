import type { Contributor } from "@/lib/types";

/**
 * Footer-level credibility strip -- outside experts who've contributed
 * insight/quotes to PredictCentr's own reporting (e.g. a Must Read
 * interview). Deliberately lightweight and placed below the Archive
 * section so it doesn't compete with the News/Hot Market/category grids
 * for attention; it's a trust signal for readers who've scrolled the full
 * page, not a growth-driving element. Each entry is a repeatable card, so
 * adding a contributor is just appending to data/contributors.json.
 */
export function ContributorsSection({ contributors }: { contributors: Contributor[] }) {
  if (contributors.length === 0) return null;

  return (
    <section className="section contributors-section">
      <div className="section-label">Contributors</div>
      <div className="contributors-list">
        {contributors.map((c) => (
          <div className="contributor-card" key={c.slug}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.photo} alt={c.name} className="contributor-photo" />
            <div className="contributor-body">
              <div className="contributor-name">{c.name}</div>
              <div className="contributor-title">
                {c.title},{" "}
                <a href={c.companyUrl} target="_blank" rel="noopener noreferrer">
                  {c.company}
                </a>
              </div>
              <div className="contributor-credential">{c.credentialLine}</div>
              <p className="contributor-bio">{c.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
