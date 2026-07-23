import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PredictCentr — Live Prediction Market Odds",
    template: "%s | PredictCentr",
  },
  description:
    "Live prediction market odds compared across platforms, with the news that's actually moving them.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
