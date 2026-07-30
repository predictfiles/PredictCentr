import { NextResponse } from "next/server";
import { findMarket } from "@/lib/markets";
import { loadOutcomeHistory } from "@/lib/oddsLoader";
import type { HistoryRange } from "@/lib/types";

export const revalidate = 60;

const VALID_RANGES: HistoryRange[] = ["1h", "6h", "1d", "1w", "1m", "all"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug")?.split("/") ?? [];
  const outcomeId = searchParams.get("outcome");
  const rangeParam = searchParams.get("range");
  const range: HistoryRange = VALID_RANGES.includes(rangeParam as HistoryRange)
    ? (rangeParam as HistoryRange)
    : "all";

  const market = findMarket(slug);
  const outcome = market?.outcomes.find((o) => o.id === outcomeId);
  if (!market || !outcome) {
    return NextResponse.json({ error: "Market or outcome not found" }, { status: 404 });
  }

  const body = await loadOutcomeHistory(outcome, range);

  const maxAge = range === "all" ? 3600 : 60;
  return NextResponse.json(body, {
    headers: {
      "Cache-Control": `public, s-maxage=${maxAge}, stale-while-revalidate=${Math.round(maxAge / 6)}`,
    },
  });
}
