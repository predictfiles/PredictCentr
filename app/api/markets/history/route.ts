import { NextResponse } from "next/server";
import { findMarket } from "@/lib/markets";
import { loadOutcomeHistory } from "@/lib/oddsLoader";

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

  const body = await loadOutcomeHistory(outcome);

  return NextResponse.json(body, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
  });
}
