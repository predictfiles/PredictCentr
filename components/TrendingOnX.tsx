"use client";

import { StoryCarousel, type StoryCarouselItem } from "@/components/StoryCarousel";

export interface ResolvedTrendingItem {
  headline: string;
  image?: string;
  postVolume?: string;
  marketTitle?: string;
  marketHref?: string;
}

function XLogo() {
  return (
    <svg className="trending-x-logo" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/**
 * Sidebar module, directly beneath Breaking News -- Owain's own daily pick
 * from X's "Today's News" panel. Lives in the sidebar (not the homepage's
 * top slot, which is now the "News" section for PredictCentr's own
 * articles) so it stays visible as a secondary, curated-from-X signal.
 */
export function TrendingOnX({ items }: { items: ResolvedTrendingItem[] }) {
  const carouselItems: StoryCarouselItem[] = items.map((item, i) => ({
    key: `${item.headline}-${i}`,
    image: item.image,
    headline: item.headline,
    meta: item.postVolume,
    marketHref: item.marketHref,
    marketTitle: item.marketTitle,
  }));

  return (
    <StoryCarousel
      badge={
        <>
          Trending on <XLogo />
        </>
      }
      items={carouselItems}
      compact
    />
  );
}
