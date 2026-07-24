import { NextResponse } from "next/server";
import { findMarket } from "@/lib/markets";
import { getKalshiMarket } from "@/lib/kalshi";
import { getPolymarketMarket } from "@/lib/polymarket";
import type { OddsResponse } from "@/lib/types";

export const revalidate = 30;

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
    getKalshiMarket(outcome.kalshi.ticker, outcome.kalshi.url),
    getPolymarketMarket(outcome.polymarket.marketId, outcome.polymarket.url),
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
