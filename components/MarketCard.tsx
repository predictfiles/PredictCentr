import Link from "next/link";
import type { MarketConfig } from "@/lib/types";

export function MarketCard({ market }: { market: MarketConfig }) {
  const href = `/${market.slug.join("/")}/`;
  return (
    <Link className="market-card" href={href}>
      <div className="market-card-title">{market.content.market.title}</div>
      <div className="market-card-desc">{market.shortDescription}</div>
      <div className="market-card-cta">View live odds →</div>
    </Link>
  );
}
