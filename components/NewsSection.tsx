import { formatDate } from "@/lib/format";
import { NewsThumb } from "@/components/NewsThumb";

interface NewsItem {
  headline: string;
  source: string;
  date: string;
  url: string;
  image?: string;
}

export function NewsSection({ items }: { items: NewsItem[] }) {
  return (
    <section className="section">
      <div className="section-label">News &amp; Context</div>
      <ul className="news-list">
        {items.map((item) => (
          <li className="news-item" key={item.url}>
            <a
              className="news-link"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {item.image && <NewsThumb src={item.image} />}
              <div>
                <div className="news-headline">{item.headline}</div>
                <div className="news-meta">
                  {item.source} · {formatDate(item.date)}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
