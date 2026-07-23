import { NextResponse } from "next/server";
import { getKalshiVanceMarket } from "@/lib/kalshi";
import { getPolymarketVanceMarket } from "@/lib/polymarket";
import type { OddsResponse } from "@/lib/types";

export const revalidate = 30;

export async function GET() {
  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiVanceMarket(),
    getPolymarketVanceMarket(),
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
