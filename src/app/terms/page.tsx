import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-4xl font-semibold text-ink">Terms of use</h1>
      <p className="mt-4 leading-relaxed text-ink-soft">
        This site is an editorial planning platform, not a wedding agency. Estimates are indicative. Final
        quotes come from planners and vendors you hire yourself. Listing is free; nobody pays for placement.
        Accounts are for couples planning a wedding. Do not scrape, republish or misrepresent the catalog as
        your own research.
      </p>
    </div>
  );
}
