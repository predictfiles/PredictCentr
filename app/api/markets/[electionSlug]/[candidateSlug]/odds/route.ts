import { NextResponse } from "next/server";
import { findMarket } from "@/lib/markets";
import { getKalshiMarket } from "@/lib/kalshi";
import { getPolymarketMarket } from "@/lib/polymarket";
import type { OddsResponse } from "@/lib/types";

export const revalidate = 30;

export async function GET(
  _req: Request,
  { params }: { params: { electionSlug: string; candidateSlug: string } }
) {
  const market = findMarket(params.electionSlug, params.candidateSlug);
  if (!market) {
    return NextResponse.json({ error: "Market not found" }, { status: 404 });
  }

  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiMarket(market.kalshi.ticker, market.content.affiliateLinks.kalshi.url),
    getPolymarketMarket(
      market.polymarket.marketId,
      market.content.affiliateLinks.polymarket.url
    ),
  ]);

  const body: OddsResponse = {
    kalshi: kalshi.status === "fulfilled" ? kalshi.value : null,
    kalshiError: kalshi.status === "rejected" ? String(kalshi.reason) : null,
    polymarket: polymarket.status === "fulfilled" ? polymarket.value : null,
    polymarketError:
      polymarket.status === "rejected" ? String(polymarket.reason) : null,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15" },
  });
}
