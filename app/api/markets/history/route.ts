import { NextResponse } from "next/server";
import { findMarket } from "@/lib/markets";
import { getKalshiMarketHistory } from "@/lib/kalshi";
import { getPolymarketMarketHistory } from "@/lib/polymarket";
import type { HistoryResponse } from "@/lib/types";

export const revalidate = 3600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug")?.split("/") ?? [];
  const outcomeId = searchParams.get("outcome");

  const market = findMarket(slug);
  const outcome = market?.outcomes.find((o) => o.id === outcomeId);
  if (!market || !outcome) {
    return NextResponse.json({ error: "Market or outcome not found" }, { status: 404 });
  }

  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiMarketHistory(outcome.kalshi.seriesTicker, outcome.kalshi.ticker),
    getPolymarketMarketHistory(outcome.polymarket.yesTokenId),
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
