"use client";

import { useEffect, useState } from "react";
import type { OddsResponse } from "@/lib/types";
import { bestPrice, formatPercent, formatRelativeTime } from "@/lib/format";

const POLL_MS = 30_000;

function PlatformCard({
  name,
  color,
  quote,
  error,
  affiliateUrl,
}: {
  name: string;
  color: string;
  quote: OddsResponse["kalshi"];
  error: string | null;
  affiliateUrl: string;
}) {
  return (
    <div className="odds-card" style={{ ["--platform-color" as any]: color }}>
      <div className="odds-platform">{name}</div>
      {quote ? (
        <>
          <div className="odds-price">
            <span className="odds-price-label">Chance of Yes</span>
            {formatPercent(quote.yesPrice)}
            <span className="unit">%</span>
          </div>
          <div className="odds-spread">
            Bid {formatPercent(quote.bid)}% / Ask {formatPercent(quote.ask)}%
          </div>
        </>
      ) : (
        <div className="odds-unavailable">
          Live price unavailable{error ? ` — ${error}` : ""}. We won&apos;t
          show a number we&apos;re not confident is current.
        </div>
      )}
      <a
        className="cta-btn"
        href={affiliateUrl}
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
      >
        View on {name} →
      </a>
    </div>
  );
}

function BestPrice({
  kalshi,
  polymarket,
}: {
  kalshi: OddsResponse["kalshi"];
  polymarket: OddsResponse["polymarket"];
}) {
  const best = bestPrice(kalshi, polymarket);
  if (!best) return null;

  if (best.diffPts === 0) {
    return (
      <div className="best-price">
        Best available price: <strong>tied</strong> — Kalshi and Polymarket
        are both asking {formatPercent(best.price)}%
      </div>
    );
  }

  const winnerName = best.platform === "kalshi" ? "Kalshi" : "Polymarket";
  const color = best.platform === "kalshi" ? "var(--kalshi)" : "var(--polymarket)";
  const ptsLabel = Number.isInteger(best.diffPts)
    ? best.diffPts.toFixed(0)
    : best.diffPts.toFixed(1);

  return (
    <div className="best-price">
      Best available price:{" "}
      <strong style={{ color }}>
        {winnerName} (+{ptsLabel} pts)
      </strong>
    </div>
  );
}

export function OddsComparison({
  initialData,
  pollUrl,
  question,
  kalshiAffiliateUrl,
  polymarketAffiliateUrl,
}: {
  initialData: OddsResponse;
  /** Omit to freeze the display -- no polling, no ticking "last checked" clock. Used for settled markets. */
  pollUrl?: string;
  question: string;
  kalshiAffiliateUrl: string;
  polymarketAffiliateUrl?: string;
}) {
  const hasPolymarket = Boolean(polymarketAffiliateUrl);
  const frozen = !pollUrl;
  const [data, setData] = useState<OddsResponse>(initialData);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    if (!pollUrl) return;
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(pollUrl!, { cache: "no-store" });
        if (!res.ok) return;
        const json: OddsResponse = await res.json();
        if (!cancelled) setData(json);
      } catch {
        // keep showing last known-good data; the per-card "unavailable"
        // state only triggers when the API itself reports no quote
      } finally {
        if (!cancelled) setNow(Date.now());
      }
    }

    const interval = setInterval(poll, POLL_MS);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
      clearInterval(tick);
    };
  }, [pollUrl]);

  return (
    <section className="section">
      <div className="section-label">
        {frozen ? "Final Odds" : "Live Odds"} — {question}
      </div>
      <div className={hasPolymarket ? "odds-grid" : "odds-grid odds-grid-single"}>
        <PlatformCard
          name="Kalshi"
          color="var(--kalshi)"
          quote={data.kalshi}
          error={data.kalshiError}
          affiliateUrl={kalshiAffiliateUrl}
        />
        {hasPolymarket && (
          <PlatformCard
            name="Polymarket"
            color="var(--polymarket)"
            quote={data.polymarket}
            error={data.polymarketError}
            affiliateUrl={polymarketAffiliateUrl!}
          />
        )}
      </div>
      {hasPolymarket && <BestPrice kalshi={data.kalshi} polymarket={data.polymarket} />}
      <div className="odds-fetched">
        {frozen
          ? "Final odds as of settlement — no longer updating"
          : `Last checked ${formatRelativeTime(data.fetchedAt, now)} · refreshes automatically every 30s`}
      </div>
    </section>
  );
}
