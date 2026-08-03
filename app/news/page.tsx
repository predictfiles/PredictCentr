import Link from "next/link";
import type { Metadata } from "next";
import { getTopNewsItems } from "@/lib/markets";
import { formatDate } from "@/lib/format";
import { CategoryNav } from "@/components/CategoryNav";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "News",
  description:
    "The latest news story behind every live PredictCentr market - politics, sports, and culture.",
};

export default function NewsHubPage() {
  const items = getTopNewsItems();

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
            The latest story behind every live market we track - the news, not just the odds.
          </p>
        </div>
        <CategoryNav />
      </header>

      <main className="wrap">
        {items.length === 0 ? (
          <div className="disclaimer">Nothing here yet - check back soon.</div>
        ) : (
          <section className="section">
            <div className="market-card-list">
              {items.map(({ market, news }) => (
                <Link
                  key={market.slug.join("/")}
                  className="market-card"
                  href={`/${market.slug.join("/")}/`}
                >
                  <div className="must-read-thumb-row">
                    {news.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={news.image} alt="" className="must-read-thumb" />
                    )}
                    <div>
                      <div className="market-card-eyebrow">
                        {news.source} · {formatDate(news.date)}
                      </div>
                      <div className="market-card-title">{news.headline}</div>
                    </div>
                  </div>
                  <div className="market-card-cta">
                    Market Affected: {market.content.market.title}
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
