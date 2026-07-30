import Link from "next/link";
import type { Metadata } from "next";
import { mustReadArticles, MUST_READ_CATEGORY_LABELS } from "@/lib/mustRead";
import { formatDate } from "@/lib/format";
import { CategoryNav } from "@/components/CategoryNav";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "PredictCentr Must Read",
  description:
    "Longer-form guides and market analysis from PredictCentr - state-by-state prediction market legality guides and opinion pieces on specific markets.",
};

export default function MustReadHubPage() {
  const articles = [...mustReadArticles].reverse();

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="PredictCentr" className="brand-logo" />
          </Link>
          <h1 className="title">PredictCentr Must Read</h1>
          <p className="subtitle">
            Longer-form guides and market analysis - separate from the live
            odds tracked on our market pages.
          </p>
        </div>
        <CategoryNav />
      </header>

      <main className="wrap">
        {articles.length === 0 ? (
          <div className="disclaimer">
            Nothing published here yet - check back soon for legality guides
            and market analysis pieces.
          </div>
        ) : (
          <section className="section">
            <div className="market-card-list">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  className="market-card"
                  href={`/must-read/${article.slug}/`}
                >
                  <div className="must-read-thumb-row">
                    {article.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={article.image} alt="" className="must-read-thumb" />
                    )}
                    <div>
                      <div className="market-card-eyebrow">
                        {MUST_READ_CATEGORY_LABELS[article.category]}
                      </div>
                      <div className="market-card-title">{article.title}</div>
                      <div className="market-card-desc">{article.teaser}</div>
                    </div>
                  </div>
                  <div className="market-card-cta">
                    {formatDate(article.publishedAt)} · By {article.author}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
