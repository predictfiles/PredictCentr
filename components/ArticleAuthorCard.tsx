import { formatDate } from "@/lib/format";

const AUTHOR_ROLES: Record<string, { role: string; photo: string }> = {
  "Owain Flanders": { role: "Chief Editor", photo: "/authors/owain-flanders.jpg" },
};

export function ArticleAuthorCard({
  author,
  publishedAt,
  updatedAt,
}: {
  author: string;
  publishedAt: string;
  updatedAt: string;
}) {
  const info = AUTHOR_ROLES[author];

  return (
    <section className="section">
      <div className="card article-author-card">
        {info?.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={info.photo} alt={author} className="article-author-photo" />
        )}
        <div>
          <div className="article-author-name">
            Written by {author}
            {info?.role ? ` · ${info.role}` : ""}
          </div>
          <div className="article-author-date">
            Published {formatDate(publishedAt)}
            {updatedAt !== publishedAt && ` · Updated ${formatDate(updatedAt)}`}
          </div>
        </div>
      </div>
    </section>
  );
}
