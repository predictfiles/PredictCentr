"use client";

import { StoryCarousel, type StoryCarouselItem } from "@/components/StoryCarousel";
import { formatDate } from "@/lib/format";

export interface ResolvedOtherNewsItem {
  headline: string;
  image?: string;
  source: string;
  date: string;
  marketTitle?: string;
  marketHref?: string;
}

/**
 * Sidebar module, below Trending on X -- third-party coverage per market
 * (each market's own News & Context list), one story at a time. Same
 * carousel shell/interaction as Trending on X (StoryCarousel, "row"
 * layout, prev/next arrows) -- this used to be the sidebar's whole "Other
 * Headlines" ticker before PredictCentr Headlines took over that slot with
 * our own articles.
 */
export function OtherNews({ items }: { items: ResolvedOtherNewsItem[] }) {
  const carouselItems: StoryCarouselItem[] = items.map((item, i) => ({
    key: `${item.headline}-${i}`,
    image: item.image,
    headline: item.headline,
    meta: `${item.source} · ${formatDate(item.date)}`,
    marketHref: item.marketHref,
    marketTitle: item.marketTitle,
  }));

  return <StoryCarousel badge="Other News" items={carouselItems} compact />;
}
