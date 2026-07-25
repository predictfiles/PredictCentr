import Link from "next/link";
import type { MarketConfig, OddsResponse } from "@/lib/types";
import { CardLiveLine } from "@/components/CardLiveLine";

export function MarketCard({
  market,
  initialOdds,
  featured = false,
}: {
  market: MarketConfig;
  initialOdds: Record<string, OddsResponse>;
  featured?: boolean;
}) {
  const href = `/${market.slug.join("/")}/`;
  const settled = market.content.settled;

  return (
    <Link
      className={`market-card${featured ? " market-card-featured" : ""}${
        settled ? " market-card-settled" : ""
      }`}
      href={href}
    >
      {featured && <div className="market-card-eyebrow">Hot Market</div>}
      {settled && <div className="market-card-eyebrow market-card-eyebrow-settled">Settled</div>}
      <div className="market-card-title">{market.content.market.title}</div>
      <div className="market-card-desc">{market.shortDescription}</div>
      {settled ? (
        <div className="market-card-live market-card-resolved">Resolved: {settled.result}</div>
      ) : (
        <CardLiveLine
          outcomes={market.outcomes}
          slugPath={market.slug.join("/")}
          initialOdds={initialOdds}
        />
      )}
      <div className="market-card-cta">{settled ? "View result →" : "View live odds →"}</div>
    </Link>
  );
}
