import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Culture",
  description: "Every Culture market tracked on PredictCentr, live odds included.",
};

export default function Page() {
  return <CategoryPage category="culture" />;
}
