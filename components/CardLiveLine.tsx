"use client";

import { useEffect, useState } from "react";
import type { MarketOutcome, OddsResponse, PlatformId } from "@/lib/types";
import { bestPrice, formatPercent } from "@/lib/format";

const POLL_MS = 30_000;

function platformColor(platform: PlatformId) {
  return platform === "kalshi" ? "var(--kalshi)" : "var(--polymarket)";
}

function platformName(platform: PlatformId) {
  return platform === "kalshi" ? "Kalshi" : "Polymarket";
}

export function CardLiveLine({
  outcomes,
  slugPath,
  initialOdds,
}: {
  outcomes: MarketOutcome[];
  slugPath: string;
  initialOdds: Record<string, OddsResponse>;
}) {
  const [oddsByOutcome, setOddsByOutcome] =
    useState<Record<string, OddsResponse>>(initialOdds);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const results = await Promise.all(
        outcomes.map(async (outcome): Promise<[string, OddsResponse] | null> => {
          try {
            const res = await fetch(
              `/api/markets/odds?slug=${encodeURIComponent(slugPath)}&outcome=${encodeURIComponent(
                outcome.id
              )}`,
              { cache: "no-store" }
            );
            if (!res.ok) return null;
            return [outcome.id, (await res.json()) as OddsResponse];
          } catch {
            return null;
          }
        })
      );
      if (cancelled) return;
      setOddsByOutcome((prev) => {
        const next = { ...prev };
        for (const result of results) {
          if (result) next[result[0]] = result[1];
        }
        return next;
      });
    }

    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [outcomes, slugPath]);

  // Binary market: reuse the exact same "cheapest ask" logic as the page's
  // "Best available price" callout, just condensed to platform + price.
  if (outcomes.length === 1) {
    const odds = oddsByOutcome[outcomes[0].id];
    const best = odds ? bestPrice(odds.kalshi, odds.polymarket) : null;
    if (!best) return null;
    return (
      <div className="market-card-live">
        Best:{" "}
        <strong style={{ color: platformColor(best.platform) }}>
          {platformName(best.platform)} {formatPercent(best.price)}%
        </strong>
      </div>
    );
  }

  // Multi-outcome: the current frontrunner, computed live -- never hardcode
  // which outcome is "leading" in copy, since that can flip at any time.
  let leader: { label: string; price: number; platform: PlatformId } | null = null;
  for (const outcome of outcomes) {
    const odds = oddsByOutcome[outcome.id];
    if (!odds) continue;
    const candidates: Array<{ platform: PlatformId; price: number }> = [];
    if (odds.kalshi) candidates.push({ platform: "kalshi", price: odds.kalshi.yesPrice });
    if (odds.polymarket)
      candidates.push({ platform: "polymarket", price: odds.polymarket.yesPrice });
    for (const candidate of candidates) {
      if (!leader || candidate.price > leader.price) {
        leader = { label: outcome.label, ...candidate };
      }
    }
  }
  if (!leader) return null;

  return (
    <div className="market-card-live">
      <strong>{leader.label}</strong> favored —{" "}
      <strong style={{ color: platformColor(leader.platform) }}>
        {formatPercent(leader.price)}% ({platformName(leader.platform)})
      </strong>
    </div>
  );
}
