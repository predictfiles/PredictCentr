import { NextResponse } from "next/server";
import { getKalshiVanceHistory } from "@/lib/kalshi";
import { getPolymarketVanceHistory } from "@/lib/polymarket";
import type { HistoryResponse } from "@/lib/types";

export const revalidate = 3600;

export async function GET() {
  const [kalshi, polymarket] = await Promise.allSettled([
    getKalshiVanceHistory(),
    getPolymarketVanceHistory(),
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
