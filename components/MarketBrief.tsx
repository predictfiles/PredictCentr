import { formatDate } from "@/lib/format";

export function MarketBrief({
  text,
  updatedAt,
}: {
  text: string;
  updatedAt: string;
}) {
  return (
    <section className="section">
      <div className="section-label">Market Brief</div>
      <div className="card">
        <p className="brief-text">{text}</p>
        <div className="brief-meta">
          Last updated by hand — {formatDate(updatedAt)}
        </div>
      </div>
    </section>
  );
}
