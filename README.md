# PredictCentr

Prediction market odds compared across platforms, with news context.
Built with Next.js (App Router) and deployed on Vercel.

- `/` — homepage listing every live market, grouped by category (Politics,
  Culture, ...)
- `/<slug...>/` — one market page. 1 URL segment for a single-event market
  (e.g. `/lebron-james-next-team/`), 2 for a market nested under a race
  (e.g. `/2028-us-presidential-election-winner/jd-vance/`)

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## How it works

- `lib/kalshi.ts` / `lib/polymarket.ts` — generic fetch/normalize functions
  for live price + history data, parameterized by ticker/market ID so any
  outcome on any market can reuse them.
- `lib/markets.ts` — the market registry: one array entry per market, each
  with a URL `slug` (1+ path segments), a `category`, and one or more
  `outcomes` (a binary market has one outcome; a multi-outcome market like
  "LeBron's next team" tracks the real contenders as separate outcomes,
  each with its own Kalshi ticker + Polymarket market ID + content). This
  is the single place that ties a URL to real data.
- `app/api/markets/odds/route.ts` and `.../history/route.ts` — serverless
  route handlers the browser polls instead of hitting Kalshi/Polymarket
  directly (avoids CORS, keeps polling server-cached). Takes `?slug=` and
  `?outcome=` query params to identify which market/outcome to fetch.
- `app/[...slug]/page.tsx` — the market page template (catch-all route, so
  it handles both 1- and 2-segment URLs). Server-renders with an initial
  data fetch per outcome, then `components/OddsComparison.tsx` polls that
  outcome's `/api/markets/odds` endpoint client-side every 30s. A market
  with multiple outcomes (LeBron) renders one odds+chart block per outcome,
  stacked; a binary market (Vance, Senate) just renders one.
- `app/page.tsx` — the homepage; groups `markets` by `category` and lists
  each as a card via `components/MarketCard.tsx`.
- `data/markets/<slug...>.json` — everything manually curated for that one
  market: the brief, news headlines, "what to watch" dates, and affiliate
  status. No CMS — just edit and redeploy.

## Adding a new market

1. Find the market's Kalshi ticker + series ticker, and Polymarket market
   ID + Yes token ID for each outcome you want to track (same way every
   market so far was found — hit `gamma-api.polymarket.com` and
   `api.elections.kalshi.com` directly to confirm real, current values;
   never trust a news article's snapshot).
2. Check resolution criteria actually match between platforms (exact
   dates, fallback/tie-break rules) before building anything — this has
   caught real problems twice already (a stale "which way is this market
   leaning" narrative, and a genuine multi-day gap between two platforms'
   deadlines). Document anything non-identical in `market.resolutionNote`.
3. Add `data/markets/<slug...>.json` with the same shape as an existing
   one (`market`, `marketBrief`, `news`, `whatToWatch`, `affiliateStatus`).
4. Add one entry to the `markets` array in `lib/markets.ts` pointing at it
   — a `slug` array, `category`, and one `outcomes` entry per contender
   you're tracking.
5. Nothing else changes — the page, API routes, and homepage card are all
   driven by that one array.

## Before you launch a new market

Same checklist as before, per market's content file:

- `marketBrief.text` / `marketBrief.author` — needs a genuine human pass,
  not AI-drafted copy, unless you've been told otherwise for that market.
- `affiliateStatus.kalshi.isAffiliate` / `.polymarket.isAffiliate` — leave
  `false` until a real referral deal exists for that platform; the
  footer's disclosure text is generated from these flags, so it only ever
  claims what's actually true. The outcome-level `kalshi.url` /
  `polymarket.url` in `lib/markets.ts` can point at the plain market page
  in the meantime.
- `news` — refresh periodically; headlines go stale. Broader context
  about what could move the market, not recaps of the odds themselves
  (the odds comparison already covers that). Every item needs a
  thumbnail — pull `og:image` from the linked article, or borrow one from
  another article covering the same event if the original has none.
- `whatToWatch` — update `(TBD)` dates as they're announced.

## Deploy

Push to GitHub; Vercel auto-deploys from `main`. No environment variables
are required — both APIs are public and unauthenticated.
