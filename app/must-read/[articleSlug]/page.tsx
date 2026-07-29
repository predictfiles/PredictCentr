import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  mustReadArticles,
  findMustReadArticle,
  MUST_READ_CATEGORY_LABELS,
} from "@/lib/mustRead";
import { findMarket } from "@/lib/markets";
import { formatDate } from "@/lib/format";

export const revalidate = 30;

export function generateStaticParams() {
  return mustReadArticles.map((a) => ({ articleSlug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { articleSlug: string };
}): Metadata {
  const article = findMustReadArticle(params.articleSlug);
  if (!article) return {};
  return { title: article.title, description: article.teaser };
}

export default function MustReadArticlePage({
  params,
}: {
  params: { articleSlug: string };
}) {
  const article = findMustReadArticle(params.articleSlug);
  if (!article) notFound();

  const relatedMarket = article.relatedMarketSlug
    ? findMarket(article.relatedMarketSlug.split("/"))
    : undefined;

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="PredictCentr" className="brand-logo" />
          </Link>
          <Link className="breadcrumb" href="/must-read/">
            ← PredictCentr Must Read
          </Link>
          <h1 className="title">{article.title}</h1>
          <p className="subtitle">
            {MUST_READ_CATEGORY_LABELS[article.category]} · By {article.author} ·{" "}
            Published {formatDate(article.publishedAt)}
            {article.updatedAt !== article.publishedAt &&
              ` · Updated ${formatDate(article.updatedAt)}`}
          </p>
        </div>
      </header>

      <main className="wrap">
        {article.image && (
          <div className="must-read-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.image} alt={article.title} className="must-read-hero-image" />
          </div>
        )}

        <section className="section">
          <div className="card">
            {article.body.map((paragraph, i) => (
              <p key={i} className="must-read-paragraph">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {article.disclaimer && (
          <div className="disclaimer">{article.disclaimer}</div>
        )}

        {relatedMarket && (
          <section className="section">
            <div className="section-label">Related Market</div>
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
