"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const VISIBLE_COUNT = 4;
const SECONDS_PER_ITEM = 4.5;

export interface ResolvedHeadlineItem {
  slug: string;
  image: string;
  author: string;
  marketTitle?: string;
  marketHref?: string;
}

/**
 * Sidebar news list -- a continuous bulletin-board ticker, not a paged
 * carousel. The full pool of stories scrolls upward at a constant speed
 * (CSS animation, not a JS interval) with the list duplicated end-to-end so
 * it loops seamlessly; hovering pauses it so a story doesn't scroll away
 * mid-read or mid-click. PredictCentr's own latest articles, each shown as
 * a smaller version of the top "Breaking News" card's full-hero-image
 * treatment -- VISIBLE_COUNT is lower than the old thumbnail-row ticker's
 * since each item is now much taller.
 */
export function TopNewsStories({ items }: { items: ResolvedHeadlineItem[] }) {
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
        PredictCentr Headlines
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
            {looped.map((item, i) => (
              <li
                className="news-item"
                key={`${item.slug}-${i}`}
                ref={i === 0 ? firstItemRef : undefined}
              >
                <Link href={`/news/${item.slug}/`} className="mini-banner-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="mini-banner-image" />
                </Link>
                <div className="mini-banner-body">
                  <div className="mini-banner-meta">By {item.author}</div>
                  {item.marketHref && item.marketTitle && (
                    <Link className="mini-banner-market-link" href={item.marketHref}>
                      Market Affected: {item.marketTitle}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Link className="top-news-more-link" href="/news/">
          PredictCentr News →
        </Link>
      </div>
    </section>
  );
}
