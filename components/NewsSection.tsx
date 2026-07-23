import { formatDate } from "@/lib/format";

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
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="news-thumb"
                  src={item.image}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
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
