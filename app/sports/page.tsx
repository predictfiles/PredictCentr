import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { CATEGORY_INTRO } from "@/lib/markets";
import { SITE_URL } from "@/lib/site";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Sports",
  description: CATEGORY_INTRO.sports,
  alternates: { canonical: `${SITE_URL}/sports/` },
};

export default function Page() {
  return <CategoryPage category="sports" />;
}
