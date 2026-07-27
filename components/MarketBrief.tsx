import { formatDate } from "@/lib/format";

export function MarketBrief({
  text,
  updatedAt,
  author,
}: {
  text: string[];
  updatedAt: string;
  author?: string;
}) {
  return (
    <section className="section">
      <div className="section-label">Market Brief</div>
      <div className="card">
        <ul className="brief-text-list">
          {text.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
        <div className="brief-meta">
          {author ? `By ${author} · ` : ""}Updated by hand{" "}
          {formatDate(updatedAt)}
        </div>
      </div>
    </section>
  );
}
