# PredictCentr — JD Vance 2028 MVP

Single-page comparison of JD Vance's odds to win the 2028 US presidential
election on Kalshi vs Polymarket, with news context. Built with Next.js
(App Router) and deployed on Vercel.

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## How it works

- `lib/kalshi.ts` / `lib/polymarket.ts` — fetch and normalize live price +
  history data directly from each platform's public API.
- `app/api/odds/route.ts` / `app/api/history/route.ts` — serverless route
  handlers the browser calls instead of hitting Kalshi/Polymarket directly
  (avoids CORS, keeps polling server-cached).
- `app/page.tsx` — server-renders the page with an initial data fetch, then
  `components/OddsComparison.tsx` polls `/api/odds` client-side every 30s.
- `data/content.json` — everything that's manually curated: the market
  brief, news headlines, "what to watch" dates, and affiliate link URLs.
  No CMS — just edit this file and redeploy.

## Before you launch

`data/content.json` has a few placeholders that need a human pass:

- `marketBrief.text` — currently an AI-drafted placeholder. The brief
  requires this to be genuinely human-written; rewrite it in your own voice.
- `marketBrief.author` — put your name.
- `affiliateLinks.kalshi.url` / `affiliateLinks.polymarket.url` — currently
  point straight at the markets (no referral). Swap in your real affiliate
  links once you're approved for each platform's partner program.
- `news` — refresh headlines periodically; they'll go stale.
- `whatToWatch` — several dates are marked `(TBD)` because the 2028 primary
  calendar isn't set yet. Update as real dates are announced.

## Deploy

Push to GitHub, then import the repo in the Vercel dashboard
(vercel.com/new). No environment variables are required — both APIs are
public and unauthenticated. Vercel will detect Next.js automatically.

