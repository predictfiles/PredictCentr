"use client";

import { StoryCarousel, type StoryCarouselItem } from "@/components/StoryCarousel";
import { NewsIcon } from "@/components/NewsIcon";
import { formatDate } from "@/lib/format";

export interface ResolvedNewsArticleItem {
  slug: string;
  headline: string;
  thumbnail?: string;
  author: string;
  publishedAt: string;
  marketTitle?: string;
  marketHref?: string;
}

/**
 * Homepage's top, full-width slot -- PredictCentr's own written articles,
 * not just links out to other outlets (that's what a market page's News &
 * Context list is for). Same carousel shell as the sidebar's Trending on X
 * module (StoryCarousel), just pointed at a different data source and
 * linking each card straight to the full article instead of only citing a
 * market.
 */
export function HomeNewsSection({ items }: { items: ResolvedNewsArticleItem[] }) {
  const carouselItems: StoryCarouselItem[] = items.map((item) => ({
    key: item.slug,
    image: item.thumbnail,
    headline: item.headline,
    meta: `By ${item.author} · ${formatDate(item.publishedAt)}`,
    href: `/news/${item.slug}/`,
    marketHref: item.marketHref,
    marketTitle: item.marketTitle,
  }));

  return (
    <StoryCarousel
      badge={
        <>
          <NewsIcon className="trending-news-icon" /> Breaking News
        </>
      }
      items={carouselItems}
      layout="banner"
    />
  );
}
