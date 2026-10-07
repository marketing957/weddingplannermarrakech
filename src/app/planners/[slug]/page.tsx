import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AtSign, ExternalLink, Globe } from "lucide-react";
import { getPlannerBySlug, getPlanners } from "@/lib/data";

export async function generateStaticParams() {
  const planners = await getPlanners();
  return planners.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/planners/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const planner = await getPlannerBySlug(slug);
  if (!planner) return { title: "Planner not found" };
  return { title: planner.name, description: planner.tagline ?? undefined };
}

export default async function PlannerPage({ params }: PageProps<"/planners/[slug]">) {
  const { slug } = await params;
  const planner = await getPlannerBySlug(slug);
  if (!planner) notFound();

  const price =
    planner.price_model === "Commission"
      ? `${planner.price_from}% of vendor spend`
      : planner.price_from
        ? `From €${planner.price_from.toLocaleString("en-IE")} flat fee`
        : "On request";

  return (
    <article className="mx-auto max-w-4xl px-5 pb-10 pt-12">
      <Link href="/planners" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline">
        <ArrowLeft className="h-4 w-4" /> All planners
      </Link>

      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Planner profile</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">{planner.name}</h1>
        {planner.tagline ? <p className="mt-3 text-lg text-ink-soft">{planner.tagline}</p> : null}
      </header>

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_280px]">
        <div className="prose">
          {planner.bio?.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <div className="mt-8 rounded-2xl border border-saffron/40 bg-saffron-soft/50 p-5 text-sm text-ink-soft">
            <p className="font-semibold text-ink">How we write these</p>
            <p className="mt-1">
              Planners have a written profile and no score. Nobody pays to appear, and we take no commission.
              Test every planner on three signals: a price before you ask, real weddings they have run, and a
              reply within a day.
            </p>
          </div>
        </div>

        <aside className="h-fit space-y-5 rounded-2xl border border-sand-deep bg-white/70 p-5 shadow-card">
          <Fact label="Pricing" value={price} />
          {planner.founded_year ? <Fact label="Planning since" value={String(planner.founded_year)} /> : null}
          {planner.languages.length ? <Fact label="Languages" value={planner.languages.join(" · ")} /> : null}
          {planner.specialties.length ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Specialties</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {planner.specialties.map((s) => (
                  <span key={s} className="rounded-full bg-sand px-2.5 py-1 text-xs text-ink-soft">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="space-y-2 border-t border-sand-deep pt-4 text-sm">
            {planner.website ? (
              <a
                href={planner.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-teal hover:underline"
              >
                <Globe className="h-4 w-4" /> Website <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
            {planner.instagram ? (
              <span className="flex items-center gap-2 text-ink-soft">
                <AtSign className="h-4 w-4" /> {planner.instagram}
              </span>
            ) : null}
          </div>
          <Link
            href="/#simulator"
            className="block rounded-full bg-teal px-4 py-2.5 text-center text-sm font-semibold text-cream transition hover:bg-teal-deep"
          >
            Build your budget first
          </Link>
        </aside>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
