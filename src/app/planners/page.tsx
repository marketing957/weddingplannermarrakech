import type { Metadata } from "next";
import { Suspense } from "react";
import { PlannerCard } from "@/components/site/PlannerCard";
import { getPlanners } from "@/lib/data";

export const metadata: Metadata = {
  title: "Wedding planners in Marrakech",
  description:
    "Every Marrakech wedding planner we have written about, listed alphabetically. No rankings, no scores, no paid placement.",
};

export default function PlannersPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Directory</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
        Wedding planners in Marrakech
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        Listed alphabetically. We do not rank them and we do not score them. No planner pays to appear, and we
        take no commission.
      </p>
      <Suspense fallback={<Grid skeleton />}>
        <PlannersGrid />
      </Suspense>
    </div>
  );
}

async function PlannersGrid() {
  const planners = await getPlanners();
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {planners.map((p) => (
        <PlannerCard key={p.id} planner={p} />
      ))}
    </div>
  );
}

function Grid({ skeleton }: { skeleton?: boolean }) {
  if (!skeleton) return null;
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-52 animate-pulse rounded-2xl bg-sand" />
      ))}
    </div>
  );
}
