import Link from "next/link";
import type { Metadata } from "next";
import { findMarket } from "@/lib/markets";
import { newsArticles } from "@/lib/newsArticles";
import { formatDate } from "@/lib/format";
import { CategoryNav } from "@/components/CategoryNav";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "News",
  description: "PredictCentr's own reporting on the stories moving our tracked markets.",
};

export default function NewsHubPage() {
  const articles = [...newsArticles].reverse();

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="PredictCentr" className="brand-logo" />
          </Link>
          <h1 className="title">News</h1>
          <p className="subtitle">
            PredictCentr's own reporting on the stories moving the markets we track.
          </p>
        </div>
        <CategoryNav />
      </header>

      <main className="wrap">
        {articles.length === 0 ? (
          <div className="disclaimer">Nothing here yet - check back soon.</div>
        ) : (
          <section className="section">
            <div className="market-card-list">
              {articles.map((article) => {
                const market = findMarket(article.relatedMarketSlug.split("/"));
                return (
                  <Link
                    key={article.slug}
                    className="market-card"
                    href={`/news/${article.slug}/`}
                  >
                    <div className="must-read-thumb-row">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.thumbnail ?? article.image}
                        alt=""
                        className="must-read-thumb"
                      />
                      <div>
                        <div className="market-card-eyebrow">
                          By {article.author} · {formatDate(article.publishedAt)}
                        </div>
                        <div className="market-card-title">{article.headline}</div>
                      </div>
                    </div>
                    {market && (
                      <div className="market-card-cta">
                        Market Affected: {market.content.market.title}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
