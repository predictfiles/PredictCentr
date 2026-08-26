import Link from "next/link";
import type { Metadata } from "next";
import { CategoryNav } from "@/components/CategoryNav";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Editorial Standards & Corrections",
  description:
    "How PredictCentr sources, writes, and corrects its coverage - and how to report an error.",
  alternates: { canonical: `${SITE_URL}/editorial-standards/` },
};

export default function EditorialStandardsPage() {
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="brand" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-full.png" alt="PredictCentr" className="brand-logo" />
          </Link>
          <h1 className="title">Editorial Standards & Corrections</h1>
          <p className="subtitle">How we source, write, and correct our coverage.</p>
        </div>
        <CategoryNav />
      </header>

      <main className="wrap">
        <section className="section">
          <div className="card">
            <p className="must-read-paragraph">
              PredictCentr is written and edited by Owain Flanders. Every news
              story and market page carries a byline, and every one of them
              is reviewed before it goes live.
            </p>

            <p className="must-read-paragraph">
              <strong>Sourcing.</strong> Our own reporting draws on primary
              sources where possible - official statements, court and league
              filings, platform announcements - and credible reporting from
              established outlets. Where we rely on someone else's reporting,
              we link to it directly in the story so you can check it
              yourself. Live odds are pulled directly from Kalshi's and
              Polymarket's own public data feeds, not estimated or
              AI-generated.
            </p>

            <p className="must-read-paragraph">
              <strong>Independence.</strong> PredictCentr earns revenue
              through affiliate links to Kalshi and Polymarket. We only
              describe a link as an affiliate link where that relationship
              is actually live - each market page states plainly whether its
              platform links are currently affiliate links or not. Affiliate
              relationships have no bearing on which markets we cover or
              what our odds show, since those prices come straight from the
              platforms themselves.
            </p>

            <p className="must-read-paragraph">
              <strong>Corrections.</strong> If we get something wrong, we fix
              it. Minor errors (typos, small factual slips) are corrected
              directly. For a more substantial correction - one that changes
              the meaning or a key fact of a story - we'll note what changed
              and when, on the article itself. We'd rather hear about a
              mistake from you than not hear about it at all.
            </p>

            <p className="must-read-paragraph">
              <strong>Spotted an error, or have feedback?</strong> Email{" "}
              <a href="mailto:owainflanders@gmail.com">owainflanders@gmail.com</a>{" "}
              with the article or market page in question and what looks
              wrong - we read every message.
            </p>

            <p className="must-read-paragraph">
              See also our{" "}
              <Link href="/ai-disclosure/">AI use disclosure</Link>, which
              covers how AI tools are used in producing our content.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
