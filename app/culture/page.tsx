import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { CATEGORY_INTRO } from "@/lib/markets";
import { SITE_URL } from "@/lib/site";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Culture",
  description: CATEGORY_INTRO.culture,
  alternates: { canonical: `${SITE_URL}/culture/` },
};

export default function Page() {
  return <CategoryPage category="culture" />;
}
