import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Politics",
  description: "Every Politics market tracked on PredictCentr, live odds included.",
};

export default function Page() {
  return <CategoryPage category="politics" />;
}
