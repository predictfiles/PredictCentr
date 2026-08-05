"use client";

import { useEffect, useRef, useState } from "react";
import { formatRelativeTime } from "@/lib/format";
import type { NewsItem } from "@/lib/types";

const SECONDS_PER_ITEM = 5;

/**
 * Favicon for the story's own domain, not a hand-maintained logo per
 * outlet -- there are dozens of different sources across all the markets'
 * news arrays already, with new ones added constantly, so anything
 * manually curated would go stale immediately. This scales to any source
 * automatically.
 */
function faviconUrl(articleUrl: string): string | null {
  try {
    const { hostname } = new URL(articleUrl);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return null;
  }
}

/**
 * Compact single-line news ticker that sits near the odds/chart, separate
 * from the full News & Context list further down the page. Same continuous
 * scrolling mechanic as the homepage's Breaking News ticker (masked
 * viewport + doubled, duplicated list + linear CSS animation) just sized to
 * show one headline at a time instead of five -- headlines slide past
 * rather than flicking/swapping. Always starts on the most recent story
 * regardless of how the source file happens to order its news array.
 */
export function NewsSpotlight({ items }: { items: NewsItem[] }) {
  const sorted = [...items].sort((a, b) => (a.date < b.date ? 1 : -1));
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const [maskHeight, setMaskHeight] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    if (firstItemRef.current) {
      setMaskHeight(firstItemRef.current.offsetHeight);
    }
  }, [items]);

  if (sorted.length === 0) return null;

  const canScroll = sorted.length > 1;
  const looped = canScroll ? [...sorted, ...sorted] : sorted;
  const durationSeconds = sorted.length * SECONDS_PER_ITEM;

  return (
    <section className="section">
      <div className="section-label">Just In</div>
      <div className="card">
        <div
          className="news-spotlight-mask"
          style={maskHeight ? { height: maskHeight } : undefined}
        >
          <div
            className="news-spotlight-track"
            style={canScroll ? { animationDuration: `${durationSeconds}s` } : undefined}
          >
            {looped.map((item, i) => {
              const favicon = faviconUrl(item.url);
              return (
                <a
                  className="news-spotlight-item"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  key={`${item.url}-${i}`}
                  ref={i === 0 ? firstItemRef : undefined}
                >
                  <div className="news-spotlight-meta">
                    {favicon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="news-spotlight-favicon"
                        src={favicon}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    {item.source} · {now ? formatRelativeTime(item.date, now) : formatRelativeTime(item.date)}
                  </div>
                  <div className="news-spotlight-headline">{item.headline}</div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
