# PredictCentr

Prediction market odds compared across platforms, with news context.
Built with Next.js (App Router) and deployed on Vercel.

- `/` — homepage listing every live market
- `/<election-slug>/<candidate-slug>/` — one market page (e.g.
  `/2028-us-presidential-election-winner/jd-vance/`)

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## How it works

- `lib/kalshi.ts` / `lib/polymarket.ts` — generic fetch/normalize functions
  for live price + history data, parameterized by ticker/market ID so any
  market can reuse them.
- `lib/markets.ts` — the market registry: one array entry per market, each
  pointing at its Kalshi ticker, Polymarket market ID, and its content file.
  This is the single place that ties a URL slug to real data.
- `app/api/markets/[electionSlug]/[candidateSlug]/odds|history/route.ts` —
  serverless route handlers the browser polls instead of hitting
  Kalshi/Polymarket directly (avoids CORS, keeps polling server-cached).
- `app/[electionSlug]/[candidateSlug]/page.tsx` — the market page template.
  Server-renders with an initial data fetch, then
  `components/OddsComparison.tsx` polls its market's `/api/markets/.../odds`
  endpoint client-side every 30s.
- `app/page.tsx` — the homepage; lists every market in the registry as a
  card via `components/MarketCard.tsx`.
- `data/markets/<election-slug>/<candidate-slug>.json` — everything
  manually curated for that one market: the brief, news headlines, "what to
  watch" dates, and affiliate link URLs. No CMS — just edit and redeploy.

## Adding a new market

1. Find the market's Kalshi ticker + series ticker, and its Polymarket
   market ID + Yes token ID (same way the JD Vance ones were found — hit
   `gamma-api.polymarket.com` and `api.elections.kalshi.com` directly to
   confirm the real values before wiring them in).
2. Add `data/markets/<election-slug>/<candidate-slug>.json` with the same
   shape as the JD Vance one (`market`, `marketBrief`, `news`,
   `whatToWatch`, `affiliateLinks`).
3. Add one entry to the `markets` array in `lib/markets.ts` pointing at it.
4. Nothing else changes — the page, API routes, and homepage card are all
   driven by that one array.

## Before you launch a new market

Same checklist as before, per market's content file:

- `marketBrief.text` / `marketBrief.author` — needs a genuine human pass,
  not AI-drafted copy.
- `affiliateLinks.kalshi.url` / `affiliateLinks.polymarket.url` — swap in
  real referral links once approved for each platform's partner program.
- `news` — refresh periodically; headlines go stale.
- `whatToWatch` — update `(TBD)` dates as they're announced.

## Deploy

Push to GitHub; Vercel auto-deploys from `main`. No environment variables
are required — both APIs are public and unauthenticated.
