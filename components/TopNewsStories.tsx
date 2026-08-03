import Link from "next/link";
import { getTopNewsItems } from "@/lib/markets";
import { NewsThumb } from "@/components/NewsThumb";

const HOME_NEWS_LIMIT = 5;

export function TopNewsStories() {
  const items = getTopNewsItems().slice(0, HOME_NEWS_LIMIT);

  if (items.length === 0) return null;

  return (
    <section className="section">
      <div className="section-label">Top News Stories</div>
      <div className="card">
        <ul className="news-list">
          {items.map(({ market, news }) => {
            const href = `/${market.slug.join("/")}/`;
            return (
              <li className="news-item" key={market.slug.join("/")}>
                <div className="top-story-row">
                  {news.image && <NewsThumb src={news.image} />}
                  <div>
                    <div className="top-story-headline">{news.headline}</div>
                    <Link className="top-story-market-link" href={href}>
                      Market Affected: {market.content.market.title}
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <Link className="top-news-more-link" href="/news/">
          More News Stories →
        </Link>
      </div>
    </section>
  );
}
