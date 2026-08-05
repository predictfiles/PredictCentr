"use client";

import { useEffect, useState } from "react";

function formatCountdown(targetMs: number, nowMs: number): string {
  const diffMs = targetMs - nowMs;
  if (diffMs <= 0) return "Resolving now";

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

/**
 * Live-ticking "time until resolution" -- reuses each market's existing
 * resolutionDate (already in the data, no new API calls) rather than
 * fetching a platform's exact close_time. Starts at `null` on both server
 * and client's first render so there's no hydration mismatch (same pattern
 * as NewsSpotlight's relative-time text), only switching to the real
 * countdown once mounted client-side.
 */
export function CountdownTimer({
  targetDate,
  className,
}: {
  targetDate: string;
  className?: string;
}) {
  const target = new Date(targetDate).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (Number.isNaN(target) || now === null) return null;

  return <span className={className}>{formatCountdown(target, now)}</span>;
}
