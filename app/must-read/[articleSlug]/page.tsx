import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  mustReadArticles,
  findMustReadArticle,
  MUST_READ_CATEGORY_LABELS,
} from "@/lib/mustRead";
import { formatDate } from "@/lib/format";
import { findMarket } from "@/lib/markets";
import { CategoryNav } from "@/components/CategoryNav";
import { ArticleAuthorCard } from "@/components/ArticleAuthorCard";
import { MustReadBody } from "@/components/MustReadBody";
import { SITE_URL } from "@/lib/site";

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
  const { title, teaser: description, image } = article;
  const url = `${SITE_URL}/must-read/${article.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
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

  const otherMustReads = (article.relatedMustReadSlugs ?? [])
    .map((slug) => findMustReadArticle(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

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
          <p className="subtitle">{MUST_READ_CATEGORY_LABELS[article.category]}</p>
        </div>
        <CategoryNav />
      </header>

      <main className="wrap">
        <ArticleAuthorCard
          author={article.author}
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
        />

        {article.image && (
          <div className="must-read-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.image} alt={article.title} className="must-read-hero-image" />
          </div>
        )}

        <section className="section">
          <div className="card">
            <MustReadBody blocks={article.body} />
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

        {otherMustReads.length > 0 && (
          <section className="section">
            <div className="section-label">Other Must Read Articles</div>
            <div className="market-card-list">
              {otherMustReads.map((other) => (
                <Link
                  key={other.slug}
                  className="market-card"
                  href={`/must-read/${other.slug}/`}
                >
                  <div className="must-read-thumb-row">
                    {other.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={other.image} alt="" className="must-read-thumb" />
                    )}
                    <div>
                      <div className="market-card-eyebrow">
                        {MUST_READ_CATEGORY_LABELS[other.category]}
                      </div>
                      <div className="market-card-title">{other.title}</div>
                      <div className="market-card-desc">{other.teaser}</div>
                    </div>
                  </div>
                  <div className="market-card-cta">
                    {formatDate(other.publishedAt)} · By {other.author}
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
