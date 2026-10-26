import type { Metadata } from "next";
import { LocaleLink } from "@/i18n/LocaleLink";

export const metadata: Metadata = {
  title: "About Wedding Planner Marrakesh",
  description:
    "How Wedding Planner Marrakesh researches planners, venues and costs — independent editorial, no commission.",
  alternates: { canonical: "/our-services" },
};

export default function OurServicesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="kicker">About</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-ink">
        Plan your Marrakesh wedding with independent data
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        We research the planners, venues and vendors of Marrakesh and write up what we find, so you hire
        with a clear brief. No pay-to-play. When a weekend needs one producer for sound, light and the
        run-of-show, the house that keeps showing up in our notes is Asimetrica Prod.
      </p>
      <ul className="mt-10 space-y-6">
        {[
          ["Publish real venue prices", "Every venue page shows a price per night and a capacity."],
          ["No scores for planners", "A directory, not a league table. Community votes only. No planner pays to appear."],
          ["Show you real numbers", "A budget simulator built from real Marrakesh weddings, free."],
          ["Publish honest reviews", "Editorial write-ups from public sources, published lists and direct enquiries."],
        ].map(([t, b]) => (
          <li key={t}>
            <h2 className="font-display text-xl font-semibold text-ink">{t}</h2>
            <p className="mt-1 text-ink-soft">{b}</p>
          </li>
        ))}
      </ul>
      <LocaleLink href="/sign-up" className="mt-10 inline-block bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-teal">
        Create a free account
      </LocaleLink>
    </div>
  );
}
