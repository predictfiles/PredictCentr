import type { MetadataRoute } from "next";
import { markets } from "@/lib/markets";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const marketPages: MetadataRoute.Sitemap = markets.map((market) => ({
    url: `${SITE_URL}/${market.electionSlug}/${market.candidateSlug}/`,
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    ...marketPages,
  ];
}
