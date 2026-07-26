# PredictCentr

Prediction market odds compared across platforms, with news context.
Built with Next.js (App Router) and deployed on Vercel.

- `/` — homepage, top to bottom: a "Trending on X" carousel (Owain's own
  manually-picked stories, `data/trending.json`), a manually-pinned "Hot
  Market" feature, then every live market grouped by category (Politics,
  Sports, Culture, ...). A "Top News Stories" sidebar (each market's latest
  headline) runs alongside.
- `/<slug...>/` — one market page. 1 URL segment for a single-event market
  (e.g. `/lebron-james-next-team/`), 2 for a market nested under a race
  (e.g. `/2028-us-presidential-election-winner/jd-vance/`)
- `/<hub-slug>/` — a hub page listing every market nested under it side by
  side. Not election-specific despite the `ELECTIONS` name -- the same
  mechanism powers any "one top-level slug, several nested pages" grouping,
  e.g. `/2028-us-presidential-election-winner/` lists Vance and Trump, and
  `/oscar-winner-2027/` lists Best Picture contenders (starting with The
  Odyssey). Only exists for slugs registered in `ELECTIONS`.

The logo is the real exported file, not a recreation -- `public/logo-
full.png` (the icon + wordmark lockup, background made transparent)
is used directly via `<img>` in the header/hero (`.wordmark-logo` /
`.brand-logo` in `app/globals.css` just control its display size).
Favicons (`app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`) use
Next.js's file-based icon convention -- no manual `<link>` tags needed
-- and are generated from `public/logo-icon-source.png` (just the bars
+ dot, cropped out of the same file, still transparent).

If Owain supplies an updated logo export (same layout: icon then
wordmark, flattened onto a solid black background), regenerate both:

```bash
powershell -File scripts/process-logo-file.ps1 -SourcePath <path-to-new-export>
powershell -File scripts/generate-icons.ps1
```

The first script recovers transparency (un-multiplies each pixel
against black -- correct for a design flattened onto black, not just a
naive "delete near-black pixels" chroma-key) and auto-detects the gap
between the icon and the wordmark to produce the crop; the second
resizes that crop into the three favicon/app-icon sizes.

## Design system (`app/globals.css`)

Fixed theme, not OS-preference-driven. Editorial/premium rather than a
trading-terminal look: a light neutral gray page background (`--bg`,
`#f5f7fa`) with every content section presented on a white "card"
(`--card`) that has a subtle border and soft shadow. Dark charcoal
(`--nav-bg`) is reserved for exactly two things -- the site header and
footer bands -- both rendered as full-bleed `<header>`/`<footer>`
elements outside `.wrap`/`.home-wrap` with their own `.header-inner` /
`.home-header-inner` / `.footer-inner` wrapper holding the actual
content at the page's normal max-width, so the dark band spans edge to
edge while everything else stays constrained.

There are two parallel text-color scales -- mixing them up silently kills
contrast:

- `--fg` / `--muted` -- text sitting directly on the light `--bg` (section
  labels, the odds "last checked" line). Dark colors.
- `--card-fg` / `--card-muted` -- text inside a white `.card`,
  `.market-card`, `.odds-card`, `.trending-card`, `.best-price`, etc. Also
  dark, but kept as separate tokens so a component never has to guess
  whether its ambient text color is safe -- explicit is cheaper than a
  contrast bug.
- `--nav-fg` / `--nav-muted` -- text inside the dark `.header`/`.footer`
  bands only (brand, title, subtitle, tagline, breadcrumb, footer copy).
  Light colors, since they sit on `--nav-bg`.
- `--border` works for dividers both directly on the page and inside white
  cards (page bg and card bg are both light); `--nav-divider` is the
  translucent-white equivalent for the one dark-on-dark hairline inside
  the header/footer bands.

When adding a new element: if it renders inside the header/footer band,
use `--nav-fg`/`--nav-muted`; otherwise use `--fg`/`--muted` on the page
background or `--card-fg`/`--card-muted` inside a white card. `--brand-blue`
is reserved for links, primary actions, active states and chart lines --
avoid using it decoratively. `--kalshi`/`--polymarket`/`--danger`/`--warn`
are tuned for contrast against white cards, since that's the only
background they ever render on.

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
- `app/[...slug]/page.tsx` — a catch-all route handling three cases: a
  2-segment slug that matches a market renders the candidate/market page
  (server-renders an initial data fetch per outcome, then
  `components/OddsComparison.tsx` polls that outcome's `/api/markets/odds`
  endpoint client-side every 30s -- a market with multiple outcomes like
  LeBron renders one odds+chart block per outcome, stacked; a binary market
  just renders one); a 1-segment slug that matches `ELECTIONS` renders the
  hub page (lists every market sharing that first slug segment via
  `components/MarketCard.tsx`, same live-odds-fetch pattern as the
  homepage -- this is a generic "hub" mechanism reused for award-show
  ceremonies as well as elections, despite the name); anything else 404s.
  A candidate page whose first slug segment is a registered hub shows a
  breadcrumb back to it.
- `lib/oddsLoader.ts` — the live-fetch functions shared by every page that
  needs a fresh read for an outcome (market pages, the homepage). One code
  path, so numbers can't drift between where they're shown.
- `app/page.tsx` — the homepage; groups `markets` by `category` and lists
  each as a card via `components/MarketCard.tsx`. Also renders
  `getHotMarket()`'s market as a featured card above everything else. Each
  card shows a live best-price (binary markets) or current-leader
  (multi-outcome markets) line via `components/CardLiveLine.tsx`, which
  polls the same `/api/markets/odds` endpoint the page itself uses and
  shares `lib/format.ts#bestPrice()` with the page's own callout.
- `HOT_MARKET_SLUG` in `lib/markets.ts` — the one manually-set value
  controlling the homepage's "Hot Market" feature. No auto-ranking (price
  swings, traffic, volume) yet -- just change this array to feature a
  different market. Revisit as real ranking logic once there are enough
  markets that the hottest one isn't obvious at a glance (8-10+ pages).
- `data/trending.json` + `components/TrendingOnX.tsx` — the "Trending on
  X" carousel. Purely manual, no API: each entry is `{ headline, image?,
  postVolume?, marketSlug? }`. `image` renders via the same
  `components/NewsThumb.tsx` used by Top News Stories -- reuse an image
  already sourced for that market's `news` array where one fits rather
  than sourcing something new each time. `postVolume` is a free-text
  figure typed by hand alongside the headline (e.g. `"312K posts"`),
  mirroring what X's own "Today's News" panel shows -- no live data pull.
  `marketSlug` is the joined slug path of the market the story relates to
  (omit it to render an unlinked story); `app/page.tsx` resolves it via
  `findMarket()` before rendering, same "Market Affected: {title}" pattern
  as the Top News Stories sidebar -- the headline itself is plain text,
  with a separate link below it naming and pointing at the affected market
  page. Auto-rotates every 6s, pauses on hover, has arrow controls plus a
  segmented progress bar (click any segment to jump straight to that
  story). Add/remove/reorder entries by hand as stories trend and fade --
  same pattern as `HOT_MARKET_SLUG`.
- `data/markets/<slug...>.json` — everything manually curated for that one
  market: the brief, news headlines, "what to watch" dates, and affiliate
  status. No CMS — just edit and redeploy.

## Adding a new market

1. Find the market's Kalshi ticker + series ticker, and (if it exists on
   Polymarket too) market ID + Yes token ID for each outcome you want to
   track (same way every market so far was found — hit
   `gamma-api.polymarket.com` and `api.elections.kalshi.com` directly to
   confirm real, current values; never trust a news article's snapshot).
   An outcome's `polymarket` field is entirely optional — omit it for a
   single-platform/novelty market that only exists on Kalshi (e.g. the
   Grok Imagine Odyssey market); the odds card, chart, and homepage line
   all adapt automatically to show just Kalshi with no "best price"
   comparison.
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
   driven by that one array. To add a second nested page under an
   *existing* hub (same slug's first segment as one already in
   `lib/markets.ts`, e.g. a second Best Picture contender under
   `oscar-winner-2027`), this is all you need -- the hub page at
   `/<hub-slug>/` picks it up automatically since it just lists every
   market sharing that first segment. To start a *new* hub (a new election,
   or a new awards ceremony/year), also add an entry to `ELECTIONS` --
   despite the name it's a generic hub registry (`slug`, `title`,
   `resolutionDate`, `description`), not specific to elections.

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

## Settling a market

When the real-world event happens:

1. Pull the final live odds and full price history for every outcome
   directly from the Kalshi/Polymarket APIs one last time (same way you'd
   check them for a new market) -- this becomes the permanent historical
   record, so get it while the data's still fresh.
2. Add a `settled` object to the market's content file: `resolvedAt`,
   `result` (human-readable, e.g. "Philadelphia 76ers -- 2-year, $8M
   contract"), `finalOdds` and `finalHistory` (both keyed by outcome id,
   same shape the live API routes return).
3. That's it. `app/[...slug]/page.tsx` reads `content.settled` and switches
   the whole page over automatically: "Settled" badge, frozen odds/chart
   (no more live fetches for this market at all, on the page or the
   homepage card), and the footer/subtitle copy adjusts its wording.
   `app/page.tsx` moves the market from its live category section into a
   bottom-of-page "Archive" section with a muted card style.
4. Update `marketBrief.text` to close out the story, and check whether the
   outcome-level `kalshi.url` / `polymarket.url` in `lib/markets.ts` still
   resolve -- if a platform's specific contract page goes dead after
   settlement, point it at that platform's general markets page instead.
5. If the settled market was `HOT_MARKET_SLUG`, pick a new one.

## Deploy

Push to GitHub; Vercel auto-deploys from `main`. No environment variables
are required — both APIs are public and unauthenticated.
