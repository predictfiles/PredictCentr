import { formatDate } from "@/lib/format";

interface NewsItem {
  headline: string;
  source: string;
  date: string;
  url: string;
}

export function NewsSection({ items }: { items: NewsItem[] }) {
  return (
    <section className="section">
      <div className="section-label">News &amp; Context</div>
      <ul className="news-list">
        {items.map((item) => (
          <li className="news-item" key={item.url}>
            <a
              className="news-headline"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {item.headline}
            </a>
            <div className="news-meta">
              {item.source} · {formatDate(item.date)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
