"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export interface ResolvedTrendingItem {
  headline: string;
  marketTitle?: string;
  marketHref?: string;
}

const ROTATE_MS = 6000;

export function TrendingOnX({ items }: { items: ResolvedTrendingItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % items.length);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [paused, items.length, activeIndex]);

  if (items.length === 0) return null;

  const item = items[activeIndex];

  function goTo(index: number) {
    setActiveIndex(((index % items.length) + items.length) % items.length);
  }

  return (
    <section className="section">
      <div
        className="trending-card"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.length > 1 && (
          <button
            type="button"
            className="trending-arrow trending-arrow-prev"
            aria-label="Previous trending story"
            onClick={() => goTo(activeIndex - 1)}
          >
            ‹
          </button>
        )}

        <div className="trending-body" aria-live="polite">
          <span className="trending-badge">Trending on X</span>
          <div className="trending-headline">{item.headline}</div>
          {item.marketHref && item.marketTitle && (
            <Link className="trending-market-link" href={item.marketHref}>
              Market Affected: {item.marketTitle}
            </Link>
          )}
        </div>

        {items.length > 1 && (
          <button
            type="button"
            className="trending-arrow trending-arrow-next"
            aria-label="Next trending story"
            onClick={() => goTo(activeIndex + 1)}
          >
            ›
          </button>
        )}
      </div>

      {items.length > 1 && (
        <div className="trending-dots" role="tablist" aria-label="Trending stories">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to trending story ${i + 1}`}
              className={`trending-dot${i === activeIndex ? " trending-dot-active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
