import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { newsArticles, findNewsArticle } from "@/lib/newsArticles";
import { findMarket } from "@/lib/markets";
import { CategoryNav } from "@/components/CategoryNav";
import { NewsArticleBody } from "@/components/NewsArticleBody";
import { ArticleAuthorCard } from "@/components/ArticleAuthorCard";
import { SITE_URL } from "@/lib/site";

export const revalidate = 30;

export function generateStaticParams() {
  return newsArticles.map((a) => ({ articleSlug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { articleSlug: string };
}): Metadata {
  const article = findNewsArticle(params.articleSlug);
  if (!article) return {};
  const { headline: title, image } = article;
  const url = `${SITE_URL}/news/${article.slug}/`;
  const firstParagraph = article.body.find((b) => b.type === "paragraph")?.text;
  return {
    title,
    description: firstParagraph,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: firstParagraph,
      url,
      type: "article",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: firstParagraph,
      images: image ? [image] : undefined,
    },
  };
}

export default function NewsArticlePage({
  params,
}: {
  params: { articleSlug: string };
}) {
  const article = findNewsArticle(params.articleSlug);
  if (!article) notFound();

  const relatedMarket = findMarket(article.relatedMarketSlug.split("/"));

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="PredictCentr" className="brand-logo" />
          </Link>
          <Link className="breadcrumb" href="/news/">
            ← News
          </Link>
          <h1 className="title">{article.headline}</h1>
        </div>
        <CategoryNav />
      </header>

      <main className="wrap">
        <ArticleAuthorCard
          author={article.author}
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
        />

        <div className="news-article-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.image} alt={article.headline} className="news-article-hero-image" />
        </div>

        <section className="section">
          <div className="card">
            <NewsArticleBody blocks={article.body} />
          </div>
        </section>

        {relatedMarket && (
          <section className="section">
            <div className="section-label">Market Affected</div>
            <div className="market-card-list">
              <Link className="market-card" href={`/${relatedMarket.slug.join("/")}/`}>
                <div className="market-card-title">
                  {relatedMarket.content.market.title}
                </div>
                <div className="market-card-desc">{relatedMarket.shortDescription}</div>
                <div className="market-card-cta">View live odds →</div>
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
