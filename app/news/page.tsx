import Link from "next/link";
import type { Metadata } from "next";
import { findMarket, CATEGORY_LABELS } from "@/lib/markets";
import { newsArticles } from "@/lib/newsArticles";
import { formatDate } from "@/lib/format";
import { CategoryNav } from "@/components/CategoryNav";
import { SITE_URL } from "@/lib/site";
import type { NewsArticle } from "@/lib/types";

export const revalidate = 30;

const NEWS_INTRO =
  "Breaking news on the stories moving prediction markets — verified against Kalshi and Polymarket as it happens.";

export const metadata: Metadata = {
  title: "News",
  description: NEWS_INTRO,
  alternates: { canonical: `${SITE_URL}/news/` },
};

const CATEGORY_ORDER: NewsArticle["category"][] = ["politics", "sports", "culture"];

export default function NewsHubPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = CATEGORY_ORDER.find((c) => c === searchParams.category);
  const articles = [...newsArticles]
    .reverse()
    .filter((a) => !activeCategory || a.category === activeCategory);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="PredictCentr" className="brand-logo" />
          </Link>
          <h1 className="title">News</h1>
          <p className="subtitle">{NEWS_INTRO}</p>
        </div>
        <CategoryNav />
      </header>

      <main className="wrap">
        <div className="news-category-filter">
          <Link
            href="/news/"
            className={`news-category-filter-pill${
              !activeCategory ? " news-category-filter-pill-active" : ""
            }`}
          >
            All
          </Link>
          {CATEGORY_ORDER.map((category) => (
            <Link
              key={category}
              href={`/news/?category=${category}`}
              className={`news-category-filter-pill news-category-filter-pill-${category}${
                activeCategory === category ? " news-category-filter-pill-active" : ""
              }`}
            >
              {CATEGORY_LABELS[category]}
            </Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <div className="disclaimer">
            {activeCategory
              ? `Nothing in ${CATEGORY_LABELS[activeCategory]} yet - check back soon.`
              : "Nothing here yet - check back soon."}
          </div>
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
