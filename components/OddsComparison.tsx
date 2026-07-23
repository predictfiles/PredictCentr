"use client";

import { useEffect, useState } from "react";
import type { OddsResponse } from "@/lib/types";
import { formatPercent, formatRelativeTime } from "@/lib/format";

const POLL_MS = 30_000;
const STALE_MS = 2 * 60_000;

interface AffiliateLink {
  url: string;
}

function PlatformCard({
  name,
  color,
  quote,
  error,
  affiliateUrl,
  now,
}: {
  name: string;
  color: string;
  quote: OddsResponse["kalshi"];
  error: string | null;
  affiliateUrl: string;
  now: number;
}) {
  const stale = quote ? now - new Date(quote.updatedAt).getTime() > STALE_MS : false;

  return (
    <div className="odds-card" style={{ ["--platform-color" as any]: color }}>
      <div className="odds-platform">{name}</div>
      {quote ? (
        <>
          <div className="odds-price">
            {formatPercent(quote.yesPrice)}
            <span className="unit">%</span>
          </div>
          <div className="odds-spread">
            Bid {formatPercent(quote.bid)}% / Ask {formatPercent(quote.ask)}%
          </div>
          <div className={`odds-updated${stale ? " stale" : ""}`}>
            {stale ? "⚠ " : ""}Platform updated {formatRelativeTime(quote.updatedAt, now)}
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

export function OddsComparison({
  initialData,
  kalshiAffiliateUrl,
  polymarketAffiliateUrl,
}: {
  initialData: OddsResponse;
  kalshiAffiliateUrl: string;
  polymarketAffiliateUrl: string;
}) {
  const [data, setData] = useState<OddsResponse>(initialData);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/odds", { cache: "no-store" });
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
  }, []);

  return (
    <section className="section">
      <div className="section-label">Live Odds — Will JD Vance Win?</div>
      <div className="odds-grid">
        <PlatformCard
          name="Kalshi"
          color="var(--kalshi)"
          quote={data.kalshi}
          error={data.kalshiError}
          affiliateUrl={kalshiAffiliateUrl}
          now={now}
        />
        <PlatformCard
          name="Polymarket"
          color="var(--polymarket)"
          quote={data.polymarket}
          error={data.polymarketError}
          affiliateUrl={polymarketAffiliateUrl}
          now={now}
        />
      </div>
      <div className="odds-fetched">
        Last checked {formatRelativeTime(data.fetchedAt, now)} · refreshes
        automatically every 30s
      </div>
    </section>
  );
}
