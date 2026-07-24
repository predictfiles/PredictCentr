import Link from "next/link";
import type { MarketConfig } from "@/lib/types";

export function MarketCard({
  market,
  featured = false,
}: {
  market: MarketConfig;
  featured?: boolean;
}) {
  const href = `/${market.slug.join("/")}/`;
  return (
    <Link
      className={`market-card${featured ? " market-card-featured" : ""}`}
      href={href}
    >
      {featured && <div className="market-card-eyebrow">Hot Market</div>}
      <div className="market-card-title">{market.content.market.title}</div>
      <div className="market-card-desc">{market.shortDescription}</div>
      <div className="market-card-cta">View live odds →</div>
    </Link>
  );
}
