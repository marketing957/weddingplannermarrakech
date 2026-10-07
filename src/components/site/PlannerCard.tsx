import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Planner } from "@/lib/supabase/types";

export function PlannerRow({ planner }: { planner: Planner }) {
  return (
    <Link
      href={`/planners/${planner.slug}`}
      className="group flex items-center justify-between gap-4 border-b border-sand-deep/70 py-4 transition hover:bg-sand/50 sm:px-2"
    >
      <div className="min-w-0">
        <p className="font-display text-lg font-semibold text-ink group-hover:text-teal">{planner.name}</p>
        {planner.tagline ? <p className="truncate text-sm text-muted">{planner.tagline}</p> : null}
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-teal">
        Read the profile <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function PlannerCard({ planner }: { planner: Planner }) {
  return (
    <Link
      href={`/planners/${planner.slug}`}
      className="group flex flex-col rounded-2xl border border-sand-deep bg-white/70 p-6 shadow-card transition hover:-translate-y-0.5 hover:border-teal/40"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-semibold text-ink group-hover:text-teal">{planner.name}</h3>
        {planner.featured ? (
          <span className="rounded-full bg-saffron-soft px-2.5 py-0.5 text-xs font-semibold text-ink">Featured</span>
        ) : null}
      </div>
      {planner.tagline ? <p className="mt-1 text-sm text-muted">{planner.tagline}</p> : null}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {planner.specialties.slice(0, 3).map((s) => (
          <span key={s} className="rounded-full bg-sand px-2.5 py-1 text-xs text-ink-soft">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-muted">
          {planner.price_model === "Commission"
            ? `${planner.price_from}% commission`
            : planner.price_from
              ? `From €${planner.price_from.toLocaleString("en-IE")}`
              : "Price on request"}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-teal">
          Profile <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
