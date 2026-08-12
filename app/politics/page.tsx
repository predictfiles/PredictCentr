import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { CATEGORY_INTRO } from "@/lib/markets";
import { SITE_URL } from "@/lib/site";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Politics",
  description: CATEGORY_INTRO.politics,
  alternates: { canonical: `${SITE_URL}/politics/` },
};

export default function Page() {
  return <CategoryPage category="politics" />;
}
