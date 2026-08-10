import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { contributors, findContributor } from "@/lib/contributors";
import { findMustReadArticle } from "@/lib/mustRead";
import { findNewsArticle } from "@/lib/newsArticles";
import { CategoryNav } from "@/components/CategoryNav";
import { SITE_URL } from "@/lib/site";

export const revalidate = 30;

export function generateStaticParams() {
  return contributors.map((c) => ({ contributorSlug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { contributorSlug: string };
}): Metadata {
  const contributor = findContributor(params.contributorSlug);
  if (!contributor) return {};
  const { name, credentialLine: description } = contributor;
  const url = `${SITE_URL}/contributors/${contributor.slug}/`;
  const image = contributor.heroImage ?? contributor.photo;
  return {
    title: name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: name,
      description,
      url,
      type: "profile",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default function ContributorPage({
  params,
}: {
  params: { contributorSlug: string };
}) {
  const contributor = findContributor(params.contributorSlug);
  if (!contributor) notFound();

  const relatedMustReads = (contributor.relatedMustReadSlugs ?? [])
    .map((slug) => findMustReadArticle(slug))
    .filter((a) => a !== undefined);
  const relatedNews = (contributor.relatedNewsSlugs ?? [])
    .map((slug) => findNewsArticle(slug))
    .filter((a) => a !== undefined);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="PredictCentr" className="brand-logo" />
          </Link>
          <Link className="breadcrumb" href="/">
            ← Home
          </Link>
          <h1 className="title">{contributor.name}</h1>
          <p className="subtitle">
            {contributor.title},{" "}
            <a
              className="company-link"
              href={contributor.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {contributor.company}
            </a>
          </p>
        </div>
        <CategoryNav />
      </header>

      <main className="wrap">
        <div className="must-read-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={contributor.heroImage ?? contributor.photo}
            alt={contributor.name}
            className="must-read-hero-image"
          />
        </div>

        <section className="section">
          <div className="card">
            <div className="contributor-credential contributor-page-credential">
              {contributor.credentialLine}
            </div>
            <p className="must-read-paragraph">{contributor.bio}</p>
            <a
              className="contributor-visit-btn"
              href={contributor.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit {contributor.company} →
            </a>
          </div>
        </section>

        {(relatedMustReads.length > 0 || relatedNews.length > 0) && (
          <section className="section">
            <div className="section-label">Contributions</div>
            <div className="market-card-list">
              {relatedMustReads.map((article) => (
                <Link
                  key={article.slug}
                  className="market-card"
                  href={`/must-read/${article.slug}/`}
                >
                  <div className="market-card-title">{article.title}</div>
                  <div className="market-card-desc">{article.teaser}</div>
                </Link>
              ))}
              {relatedNews.map((article) => (
                <Link key={article.slug} className="market-card" href={`/news/${article.slug}/`}>
                  <div className="market-card-title">{article.headline}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
