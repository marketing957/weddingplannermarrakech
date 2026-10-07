import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BadgeCheck, Receipt, ShieldCheck } from "lucide-react";
import { BudgetSimulator } from "@/components/simulator/BudgetSimulator";
import { Accordion } from "@/components/site/Accordion";
import { PlannerRow } from "@/components/site/PlannerCard";
import { getFaqs, getPlanners, getPricingConfig } from "@/lib/data";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-sand-deep/70 bg-sand">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #0e4f5c 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-16 sm:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Editorial · Independent</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] text-ink sm:text-6xl">
            Wedding Planner <span className="text-teal">Marrakech</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Start here. Free budget simulator anchored in real Marrakech weddings, plus every planner, venue
            and vendor we cover. No sign-up.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-olive" /> Sourced · 200+ real weddings
            </span>
            <span className="inline-flex items-center gap-2">
              <Receipt className="h-4 w-4 text-olive" /> 1,500+ verified invoices
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-olive" /> No commission, no paid placement
            </span>
          </div>
        </div>
      </section>

      {/* Simulator */}
      <section className="mx-auto max-w-6xl px-5 pt-12">
        <Suspense fallback={<SimulatorSkeleton />}>
          <SimulatorLoader />
        </Suspense>
      </section>

      {/* Planners */}
      <section id="planners" className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Wedding planners in Marrakech
            </h2>
            <p className="mt-3 text-ink-soft">
              Every planner we have written about, listed alphabetically. We do not rank them and we do not
              score them. No planner pays to appear, and we take no commission.
            </p>
          </div>
          <Link
            href="/planners"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:underline"
          >
            Full directory <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Suspense fallback={<ListSkeleton rows={5} />}>
          <PlannersPreview />
        </Suspense>
      </section>

      {/* Honest version */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Hiring a wedding planner in Marrakech: the honest version
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Almost every couple planning a Marrakech wedding from abroad lands on the same question. Do we
              need a planner here, and how do we find one we can actually trust? Here is what we tell them,
              after researching these weddings since 2019.
            </p>
          </div>
          <Suspense fallback={<ListSkeleton rows={6} />}>
            <PlannerGuideFaq />
          </Suspense>
        </div>
      </section>

      {/* Methodology */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <div className="rounded-3xl bg-teal px-6 py-12 text-cream sm:px-12">
          <h2 className="max-w-3xl font-display text-3xl font-semibold sm:text-4xl">
            How we research Marrakech weddings (and take no commission)
          </h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-teal-soft">
            Every venue, planner and vendor on this site is researched by our editorial team, which has worked
            with destination weddings in Marrakech since 2019. We take no commission from venues or planners.
            Venues carry an editorial rating; planners have a written profile with no score, and no one pays
            to appear.
          </p>
          <p className="mt-6 text-sm font-medium text-saffron">Wissal · Wedding Planner Marrakech editorial team</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-24">
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
          Frequently asked questions about Marrakech weddings
        </h2>
        <div className="mt-8">
          <Suspense fallback={<ListSkeleton rows={8} />}>
            <GeneralFaq />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function SimulatorLoader() {
  const config = await getPricingConfig();
  return <BudgetSimulator config={config} />;
}

async function PlannersPreview() {
  const planners = await getPlanners();
  return (
    <div className="mt-8">
      {planners.slice(0, 6).map((p) => (
        <PlannerRow key={p.id} planner={p} />
      ))}
      <div className="pt-5">
        <Link
          href="/planners"
          className="inline-flex items-center gap-2 rounded-full border border-teal px-5 py-2.5 text-sm font-semibold text-teal transition hover:bg-teal hover:text-cream"
        >
          See all {planners.length} planners <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

async function PlannerGuideFaq() {
  const items = await getFaqs("planner_guide");
  return <Accordion items={items} defaultOpenFirst />;
}

async function GeneralFaq() {
  const items = await getFaqs("general");
  return <Accordion items={items} />;
}

function SimulatorSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-sand" />
        ))}
      </div>
      <div className="h-[520px] animate-pulse rounded-2xl bg-sand" />
    </div>
  );
}

function ListSkeleton({ rows }: { rows: number }) {
  return (
    <div className="mt-8 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-sand" />
      ))}
    </div>
  );
}
