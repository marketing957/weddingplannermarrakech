import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { getGuides } from "@/lib/data";

export const metadata: Metadata = {
  title: "Marrakech wedding guides",
  description: "Legal requirements, seasons, venues and a complete 12-month plan for a Marrakech wedding.",
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Guides</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">Planning a Marrakech wedding</h1>
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
        <Link
          key={g.id}
          href={`/guides/${g.slug}`}
          className="group flex flex-col rounded-2xl border border-sand-deep bg-white/70 p-6 shadow-card transition hover:-translate-y-0.5 hover:border-teal/40"
        >
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="rounded-full bg-teal-soft px-2.5 py-0.5 font-semibold text-teal">{g.category}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {g.read_minutes} min
            </span>
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold text-ink group-hover:text-teal">{g.title}</h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{g.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
            Read the guide <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}
