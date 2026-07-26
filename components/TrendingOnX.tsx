"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NewsThumb } from "@/components/NewsThumb";

export interface ResolvedTrendingItem {
  headline: string;
  image?: string;
  postVolume?: string;
  marketTitle?: string;
  marketHref?: string;
}

const ROTATE_MS = 6000;

function XLogo() {
  return (
    <svg className="trending-x-logo" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

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
          <div className="trending-badge-row">
            <XLogo />
            <span className="trending-badge">Trending on X</span>
          </div>

          <div className="trending-story-row">
            {item.image && <NewsThumb src={item.image} />}
            <div className="trending-story-text">
              <div className="trending-headline">{item.headline}</div>
              {item.postVolume && <div className="trending-volume">{item.postVolume}</div>}
              {item.marketHref && item.marketTitle && (
                <Link className="trending-market-link" href={item.marketHref}>
                  Market Affected: {item.marketTitle}
                </Link>
              )}
            </div>
          </div>
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
        <div className="trending-progress" role="tablist" aria-label="Trending stories">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to trending story ${i + 1}`}
              className="trending-progress-segment"
              onClick={() => goTo(i)}
            >
              {i < activeIndex && (
                <span className="trending-progress-fill trending-progress-fill-complete" />
              )}
              {i === activeIndex && (
                <span
                  key={activeIndex}
                  className="trending-progress-fill trending-progress-fill-active"
                  style={{
                    animationDuration: `${ROTATE_MS}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
