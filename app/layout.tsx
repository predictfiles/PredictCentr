import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PredictCentr — JD Vance 2028 Odds: Kalshi vs Polymarket",
  description:
    "Live JD Vance 2028 presidential election odds compared across Kalshi and Polymarket, with news context and price history.",
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
