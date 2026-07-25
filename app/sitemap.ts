import type { MetadataRoute } from "next";
import { markets, ELECTIONS } from "@/lib/markets";
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

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    ...hubPages,
    ...marketPages,
  ];
}
