import Link from "next/link";
import type { Metadata } from "next";
import { CategoryNav } from "@/components/CategoryNav";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Use Disclosure",
  description: "How PredictCentr uses AI tools in producing its content.",
  alternates: { canonical: `${SITE_URL}/ai-disclosure/` },
};

export default function AiDisclosurePage() {
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="PredictCentr" className="brand-logo" />
          </Link>
          <h1 className="title">AI Use Disclosure</h1>
          <p className="subtitle">How AI tools are used in producing PredictCentr's content.</p>
        </div>
        <CategoryNav />
      </header>

      <main className="wrap">
        <section className="section">
          <div className="card">
            <p className="must-read-paragraph">
              PredictCentr is a one-person operation, and we use AI tools -
              specifically Claude, made by Anthropic - to help produce it.
              We'd rather say so plainly than leave it unstated.
            </p>

            <p className="must-read-paragraph">
              <strong>What AI helps with.</strong> Claude assists with
              drafting news articles and market pages from Owain Flanders'
              own reporting, notes, and wording; researching and
              cross-checking facts against primary and credible secondary
              sources; and building and maintaining the site itself.
            </p>

            <p className="must-read-paragraph">
              <strong>What it doesn't do.</strong> Live odds shown on
              PredictCentr are never AI-generated or estimated - they're
              pulled directly from Kalshi's and Polymarket's own public data
              feeds. Market brief commentary is frequently written by Owain
              himself in his own words; where a first draft is AI-assisted,
              it's reviewed, fact-checked, and edited by him before
              publication, same as every other article on the site.
            </p>

            <p className="must-read-paragraph">
              <strong>Human oversight.</strong> Every piece of content on
              PredictCentr, AI-assisted or not, is reviewed by a human editor
              before or immediately after it's published. If you spot
              something that looks off, we want to know - see our{" "}
              <Link href="/editorial-standards/">editorial standards and corrections</Link>{" "}
              page for how to reach us.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
