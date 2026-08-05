"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NewsThumb } from "@/components/NewsThumb";
import type { MarketConfig, NewsItem } from "@/lib/types";

const PAGE_SIZE = 5;
const ROTATE_MS = 9000;

export interface TopNewsEntry {
  market: MarketConfig;
  news: NewsItem;
}

/**
 * Sidebar news list -- shows PAGE_SIZE stories at a time, then quietly
 * advances to the next page of the full pool on a timer, looping back to
 * the start. Deliberately not styled like TrendingOnX's single-spotlight
 * carousel (no progress bar, no arrows) -- it's the same plain list, just
 * auto-paginating through everything instead of freezing on the newest 5.
 */
export function TopNewsStories({ items }: { items: TopNewsEntry[] }) {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  const pageCount = Math.ceil(items.length / PAGE_SIZE);

  useEffect(() => {
    if (paused || pageCount <= 1) return;
    const interval = setInterval(() => {
      setPage((p) => (p + 1) % pageCount);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [paused, pageCount]);

  if (items.length === 0) return null;

  const visible = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section
      className="section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="section-label">Top News Stories</div>
      <div className="card">
        <ul className="news-list" aria-live="polite">
          {visible.map(({ market, news }) => {
            const href = `/${market.slug.join("/")}/`;
            return (
              <li className="news-item" key={market.slug.join("/")}>
                <div className="top-story-row">
                  {news.image && <NewsThumb src={news.image} />}
                  <div>
                    <div className="top-story-headline">{news.headline}</div>
                    <Link className="top-story-market-link" href={href}>
                      Market Affected: {market.content.market.title}
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <Link className="top-news-more-link" href="/news/">
          More News Stories →
        </Link>
      </div>
    </section>
  );
}
