"use client";

import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/format";
import type { NewsItem } from "@/lib/types";

const ROTATE_MS = 5000;

/**
 * Compact single-headline rotator that sits near the odds/chart, separate
 * from the full News & Context list further down the page -- crossfades to
 * the next story on a timer (Polymarket's own market widgets do this in the
 * corner next to their chart). Always starts on the most recent story
 * regardless of how the source file happens to order its news array.
 */
export function NewsSpotlight({ items }: { items: NewsItem[] }) {
  const sorted = [...items].sort((a, b) => (a.date < b.date ? 1 : -1));
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    if (sorted.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % sorted.length);
      setNow(Date.now());
    }, ROTATE_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted.length]);

  if (sorted.length === 0) return null;

  const item = sorted[index];

  return (
    <section className="section">
      <div className="section-label">Just In</div>
      <a
        className="news-spotlight"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        <div className="news-spotlight-content" key={item.url}>
          <div className="news-spotlight-meta">
            {item.source} · {now ? formatRelativeTime(item.date, now) : formatRelativeTime(item.date)}
          </div>
          <div className="news-spotlight-headline">{item.headline}</div>
        </div>
      </a>
    </section>
  );
}
