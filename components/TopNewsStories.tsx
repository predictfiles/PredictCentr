import Link from "next/link";
import { markets, getMostRecentNews } from "@/lib/markets";
import { NewsThumb } from "@/components/NewsThumb";

export function TopNewsStories() {
  const items = markets
    .map((market) => {
      const news = getMostRecentNews(market);
      return news ? { market, news } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => (a.news.date < b.news.date ? 1 : -1));

  if (items.length === 0) return null;

  return (
    <section className="section">
      <div className="section-label">Top News Stories</div>
      <ul className="news-list">
        {items.map(({ market, news }) => (
          <li className="news-item" key={market.slug.join("/")}>
            <Link className="news-link" href={`/${market.slug.join("/")}/`}>
              {news.image && <NewsThumb src={news.image} />}
              <div>
                <div className="news-headline">{news.headline}</div>
                <div className="news-meta">{market.content.market.title}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
