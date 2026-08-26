import type { MetadataRoute } from "next";
import { markets, ELECTIONS } from "@/lib/markets";
import { newsArticles } from "@/lib/newsArticles";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const marketPages: MetadataRoute.Sitemap = markets.map((market) => ({
    url: `${SITE_URL}/${market.slug.join("/")}/`,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  const hubPages: MetadataRoute.Sitemap = ELECTIONS.map((election) => ({
    url: `${SITE_URL}/${election.slug}/`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  // The Google-News-specific feed at /news-sitemap.xml only ever lists the
  // last 2 days of articles (that protocol's own requirement) -- these
  // entries are what let Google discover and index the older ones too.
  const newsPages: MetadataRoute.Sitemap = newsArticles.map((article) => ({
    url: `${SITE_URL}/news/${article.slug}/`,
    lastModified: article.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/news/`,
      changeFrequency: "hourly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/editorial-standards/`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/ai-disclosure/`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...hubPages,
    ...marketPages,
    ...newsPages,
  ];
}
