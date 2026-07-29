import Link from "next/link";
import { getRecentMustReadArticles } from "@/lib/mustRead";

/**
 * Homepage-header-only card previewing the latest Must Read article --
 * distinct from the plain "Must Read" nav treatment used elsewhere, per
 * request, since the header has room for a thumbnail + headline.
 */
export function MustReadHeaderCard() {
  const [latest] = getRecentMustReadArticles(1);

  return (
    <Link
      className="must-read-header-card"
      href={latest ? `/must-read/${latest.slug}/` : "/must-read/"}
    >
      <div className="must-read-header-card-eyebrow">Must Read</div>
      {latest ? (
        <div className="must-read-thumb-row">
          {latest.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={latest.image} alt="" className="must-read-thumb" />
          )}
          <div className="must-read-header-card-title">{latest.title}</div>
        </div>
      ) : (
        <div className="must-read-header-card-title">
          New guides and analysis, coming soon
        </div>
      )}
    </Link>
  );
}
