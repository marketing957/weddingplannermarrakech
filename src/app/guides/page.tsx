import type { Metadata } from "next";
import { LocaleLink } from "@/i18n/LocaleLink";
import { Suspense } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { getGuides } from "@/lib/data";

export const metadata: Metadata = {
  title: "Marrakesh wedding guides",
  description:
    "Legal requirements, seasons, venues and a 12-month plan — practical guides from Wedding Planner Marrakesh.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-14">
      <p className="kicker">Guides</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">Planning a Marrakesh wedding</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        The honest version of what you need to know before you book anything.
      </p>
      <Suspense fallback={<div className="mt-10 h-64 animate-pulse rounded-2xl bg-sand" />}>
        <GuidesList />
      </Suspense>
    </div>
  );
}

async function GuidesList() {
  const guides = await getGuides();
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      {guides.map((g) => (
        <LocaleLink
          key={g.id}
          href={`/guides/${g.slug}`}
          className="group flex flex-col border border-sand-deep bg-white p-6 transition hover:border-ink"
        >
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="border border-sand-deep px-2.5 py-0.5 font-semibold uppercase tracking-[0.1em] text-ink">{g.category}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {g.read_minutes} min
            </span>
          </div>
          <h2 className="mt-4 font-display text-2xl font-medium text-ink">{g.title}</h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{g.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
            Read the guide <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </LocaleLink>
      ))}
    </div>
  );
}
