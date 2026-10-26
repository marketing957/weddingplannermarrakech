import type { Metadata } from "next";
import { LocaleLink } from "@/i18n/LocaleLink";
import { TIMELINE } from "@/lib/checklist";

export const metadata: Metadata = {
  title: "12-month Marrakesh wedding timeline",
  description: "Month-by-month plan from first budget to wedding week — for couples working with a wedding planner in Marrakesh.",
  alternates: { canonical: "/timeline" },
};

export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Free tool</p>
      <h1 className="mt-3 font-display text-4xl font-semibold italic text-ink sm:text-5xl">
        twelve months
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Working backwards from a peak-season weekend. Compress it if you are marrying in summer; stretch it
        if you want a palace buyout in April.
      </p>
      <ol className="relative mt-12 space-y-0 border-l border-sand-deep pl-8">
        {TIMELINE.map((step) => (
          <li key={step.month} className="relative pb-10 last:pb-0">
            <span className="absolute -left-[37px] top-1 h-3 w-3 rounded-full bg-teal ring-4 ring-cream" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal">{step.month}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-ink">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
            <LocaleLink href={step.href} className="mt-2 inline-block text-sm font-semibold text-teal">
              Open related tool →
            </LocaleLink>
          </li>
        ))}
      </ol>
    </div>
  );
}
