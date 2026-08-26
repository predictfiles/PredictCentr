import { newsArticles } from "@/lib/newsArticles";
import { SITE_URL } from "@/lib/site";

// Google News sitemap protocol -- deliberately separate from the regular
// sitemap.ts, which lists every page forever. This one only ever lists
// articles published in the last 2 days (Google's own guidance for the
// news:news extension), since its job is fast discovery of new content,
// not being a full archive. Needs the news:news XML namespace, which
// Next's built-in MetadataRoute.Sitemap type has no way to express, so
// this is a raw XML Route Handler instead of an app/*/sitemap.ts file.
export const revalidate = 300;

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const now = Date.now();
  const recentArticles = newsArticles.filter((article) => {
    const publishedTime = new Date(article.publishedAt).getTime();
    return !Number.isNaN(publishedTime) && now - publishedTime <= TWO_DAYS_MS;
  });

  const urlEntries = recentArticles
    .map((article) => {
      const loc = `${SITE_URL}/news/${article.slug}/`;
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>PredictCentr</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${article.publishedAt}</news:publication_date>
      <news:title>${escapeXml(article.headline)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
