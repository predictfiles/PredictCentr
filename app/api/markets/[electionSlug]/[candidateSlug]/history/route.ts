import { NextResponse } from "next/server";
import { findMarket } from "@/lib/markets";
import { getKalshiMarketHistory } from "@/lib/kalshi";
import { getPolymarketMarketHistory } from "@/lib/polymarket";
import type { HistoryResponse } from "@/lib/types";

export const revalidate = 3600;

export async function GET(
  _req: Request,
  { params }: { params: { electionSlug: string; candidateSlug: string } }
) {
  const market = findMarket(params.electionSlug, params.candidateSlug);
  if (!market) {
    return NextResponse.json({ error: "Market not found" }, { status: 404 });
  }

  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiMarketHistory(market.kalshi.seriesTicker, market.kalshi.ticker),
    getPolymarketMarketHistory(market.polymarket.yesTokenId),
  ]);

  const body: HistoryResponse = {
    kalshi: kalshi.status === "fulfilled" ? kalshi.value : null,
    kalshiError: kalshi.status === "rejected" ? String(kalshi.reason) : null,
    polymarket: polymarket.status === "fulfilled" ? polymarket.value : null,
    polymarketError:
      polymarket.status === "rejected" ? String(polymarket.reason) : null,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(body, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
  });
}
