"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NewsThumb } from "@/components/NewsThumb";
import type { MarketConfig, NewsItem } from "@/lib/types";

const VISIBLE_COUNT = 5;
const SECONDS_PER_ITEM = 4.5;

export interface TopNewsEntry {
  market: MarketConfig;
  news: NewsItem;
}

/**
 * Sidebar news list -- a continuous bulletin-board ticker, not a paged
 * carousel. The full pool of stories scrolls upward at a constant speed
 * (CSS animation, not a JS interval) with the list duplicated end-to-end so
 * it loops seamlessly; hovering pauses it so a story doesn't scroll away
 * mid-read or mid-click.
 */
export function TopNewsStories({ items }: { items: TopNewsEntry[] }) {
  const firstItemRef = useRef<HTMLLIElement>(null);
  const [maskHeight, setMaskHeight] = useState<number | null>(null);

  useEffect(() => {
    if (firstItemRef.current) {
      setMaskHeight(firstItemRef.current.offsetHeight * VISIBLE_COUNT);
    }
  }, [items]);

  if (items.length === 0) return null;

  // Content is doubled so translateY(-50%) lands on an identical copy of
  // the start -- the loop point is invisible instead of snapping/jumping.
  const looped = [...items, ...items];
  const durationSeconds = items.length * SECONDS_PER_ITEM;

  return (
    <section className="section">
      <div className="home-category-heading home-category-heading-news">
        Other Headlines
      </div>
      <div className="card">
        <div
          className="news-ticker-mask"
          style={maskHeight ? { height: maskHeight } : undefined}
        >
          <ul
            className="news-list news-ticker-track"
            style={{ animationDuration: `${durationSeconds}s` }}
          >
            {looped.map(({ market, news }, i) => {
              const href = `/${market.slug.join("/")}/`;
              return (
                <li
                  className="news-item"
                  key={`${market.slug.join("/")}-${i}`}
                  ref={i === 0 ? firstItemRef : undefined}
                >
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
        </div>
        <Link className="top-news-more-link" href="/news/">
          PredictCentr News →
        </Link>
      </div>
    </section>
  );
}
