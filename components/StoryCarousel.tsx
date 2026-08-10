"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NewsThumb } from "@/components/NewsThumb";

export interface StoryCarouselItem {
  key: string;
  image?: string;
  headline: string;
  /** Small line under the headline -- a stat ("737 posts") or a source/date string. */
  meta?: string;
  /** Wraps the headline/image in a link to the full story, e.g. a News article page. Omit for items with no story page of their own (Trending on X). */
  href?: string;
  marketHref?: string;
  marketTitle?: string;
}

const ROTATE_MS = 6000;

/**
 * Shared rotating single-story card, used for both the sidebar's
 * "Trending on X" module and the homepage's full-width "News" section --
 * same visual language (one card, prev/next arrows, progress dots) with
 * different badges/data/link behavior passed in.
 */
export function StoryCarousel({
  badge,
  items,
  compact = false,
  thumbFit = "cover",
  layout = "row",
}: {
  badge: React.ReactNode;
  items: StoryCarouselItem[];
  compact?: boolean;
  thumbFit?: "cover" | "contain";
  /** "banner" is the PredictCentr News treatment: full-width image up top,
   * capped height so it can't outgrow the Hot Market card, headline in
   * white underneath, whole card one link. "row" (default) is the
   * original thumbnail + text layout used by Trending on X. */
  layout?: "row" | "banner";
}) {
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

  const headlineBlock = (
    <>
      <div className="trending-headline">{item.headline}</div>
      {item.meta && <div className="trending-volume">{item.meta}</div>}
    </>
  );

  const storyRow = (
    <div className="trending-story-row">
      {item.image && <NewsThumb src={item.image} fit={thumbFit} />}
      <div className="trending-story-text">
        {item.href ? (
          <Link href={item.href} className="trending-story-link">
            {headlineBlock}
          </Link>
        ) : (
          headlineBlock
        )}
        {item.marketHref && item.marketTitle && (
          <Link className="trending-market-link" href={item.marketHref}>
            Market Affected: {item.marketTitle}
          </Link>
        )}
      </div>
    </div>
  );

  const bannerMedia = (
    <div className="trending-banner-media">
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt="" className="trending-banner-image" />
      )}
      <span className="trending-badge trending-badge-overlay">{badge}</span>
    </div>
  );

  const bannerBody = (
    <div className="trending-banner-body">
      <div className="trending-banner-headline">{item.headline}</div>
      {item.meta && <div className="trending-banner-meta">{item.meta}</div>}
    </div>
  );

  const banner = (
    <div className={`trending-card trending-card-banner`}>
      {items.length > 1 && (
        <button
          type="button"
          className="trending-arrow trending-arrow-prev trending-arrow-overlay"
          aria-label="Previous story"
          onClick={(e) => {
            e.preventDefault();
            goTo(activeIndex - 1);
          }}
        >
          ‹
        </button>
      )}
      {item.href ? (
        <Link href={item.href} className="trending-banner-link">
          {bannerMedia}
          {bannerBody}
        </Link>
      ) : (
        <div className="trending-banner-link">
          {bannerMedia}
          {bannerBody}
        </div>
      )}
      {items.length > 1 && (
        <button
          type="button"
          className="trending-arrow trending-arrow-next trending-arrow-overlay"
          aria-label="Next story"
          onClick={(e) => {
            e.preventDefault();
            goTo(activeIndex + 1);
          }}
        >
          ›
        </button>
      )}
      {item.marketHref && item.marketTitle && (
        <Link className="trending-market-link trending-market-link-banner" href={item.marketHref}>
          Market Affected: {item.marketTitle}
        </Link>
      )}
    </div>
  );

  const progressDots = items.length > 1 && (
    <div className="trending-progress" role="tablist" aria-label="Stories">
      {items.map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          aria-label={`Go to story ${i + 1}`}
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
  );

  if (layout === "banner") {
    return (
      <section
        className="section"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div aria-live="polite">{banner}</div>
        {progressDots}
      </section>
    );
  }

  return (
    <section className="section">
      <div
        className={`trending-card${compact ? " trending-card-compact" : ""}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.length > 1 && (
          <button
            type="button"
            className="trending-arrow trending-arrow-prev"
            aria-label="Previous story"
            onClick={() => goTo(activeIndex - 1)}
          >
            ‹
          </button>
        )}

        <div className="trending-body" aria-live="polite">
          <span className="trending-badge">{badge}</span>
          {storyRow}
        </div>

        {items.length > 1 && (
          <button
            type="button"
            className="trending-arrow trending-arrow-next"
            aria-label="Next story"
            onClick={() => goTo(activeIndex + 1)}
          >
            ›
          </button>
        )}
      </div>

      {progressDots}
    </section>
  );
}
