import type { Metadata } from "next";
import Image from "next/image";
import { LocaleLink } from "@/i18n/LocaleLink";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, AtSign, ExternalLink, Globe } from "lucide-react";
import { PriceLock } from "@/components/site/PriceLock";
import { getAuthUser } from "@/lib/auth";
import { JsonLd } from "@/components/site/JsonLd";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { VoteButtons } from "@/components/site/VoteButtons";
import { getPlannerBySlug, getPlanners, getVoteTallies, revealPlannerPrices } from "@/lib/data";
import { shownVotes } from "@/lib/vendor-sentiment";
import { companyLogoSrc } from "@/lib/logos";
import { breadcrumbLd } from "@/lib/seo";
import { AsimetricaDossier } from "@/components/site/AsimetricaDossier";
import { isHousePlanner } from "@/lib/partners";
import { plannerPhotos } from "@/lib/planner-media";
import { money } from "@/lib/format";
import { getRequestCurrency } from "@/lib/currency-server";
import { getRequestLocale } from "@/i18n/request";

export async function generateStaticParams() {
  const planners = await getPlanners();
  return planners.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/planners/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const planner = await getPlannerBySlug(slug);
  if (!planner) return { title: "Planner not found" };
  const description =
    planner.tagline ??
    `${planner.name} is a wedding planner in Marrakesh. Independent profile on Wedding Planner Marrakesh.`;
  return {
    title: `${planner.name} — wedding planner in Marrakesh`,
    description,
    alternates: { canonical: `/planners/${slug}` },
  };
}

export default async function PlannerPage({ params }: PageProps<"/planners/[slug]">) {
  const { slug } = await params;
  const planner = await getPlannerBySlug(slug);
  if (!planner) notFound();

  return (
    <article className={`mx-auto px-5 pb-10 pt-12 ${isHousePlanner(planner.slug) ? "max-w-6xl" : "max-w-4xl"}`}>
      <JsonLd
        data={breadcrumbLd([
          { name: "Wedding Planner Marrakesh", path: "/" },
          { name: "Wedding planners in Marrakesh", path: "/planners" },
          { name: planner.name, path: `/planners/${planner.slug}` },
        ])}
      />
      <LocaleLink href="/planners" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline">
        <ArrowLeft className="h-4 w-4" /> All planners
      </LocaleLink>

      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          {isHousePlanner(planner.slug) ? "House production desk" : "Planner profile"}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <CompanyLogo
            name={planner.name}
            src={companyLogoSrc({ slug: planner.slug, name: planner.name, website: planner.website, websiteDomain: planner.website_domain })}
            size={56}
          />
          <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">{planner.name}</h1>
        </div>
        {planner.tagline ? <p className="mt-3 text-lg text-ink-soft">{planner.tagline}</p> : null}
        <Suspense fallback={null}>
          <PlannerRank slug={planner.slug} />
        </Suspense>
      </header>

      {isHousePlanner(planner.slug) ? (
        <Suspense fallback={<div className="mt-10 h-96 animate-pulse bg-sand" />}>
          <AsimetricaDossier />
        </Suspense>
      ) : null}

      {isHousePlanner(planner.slug) ? null : <PlannerGallery slug={planner.slug} name={planner.name} domain={planner.website_domain} />}

      {isHousePlanner(planner.slug) ? null : (
      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_280px]">
        <div className="prose">
          {planner.bio?.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          {planner.review_verdict ? (
            <blockquote className="mt-8 border-l-2 border-saffron pl-4 font-display text-xl font-medium text-ink">
              {planner.review_verdict}
            </blockquote>
          ) : null}
          <div className="mt-8 border border-sand-deep bg-saffron-soft/50 p-5 text-sm text-ink-soft">
            <p className="font-semibold text-ink">How we write these</p>
            <p className="mt-1">
              Planners have a written profile and no score. Nobody pays to appear, and we take no commission.
              Test every planner on three signals: a price before you ask, real weddings they have run, and a
              reply within a day.
            </p>
          </div>
        </div>

        <aside className="h-fit space-y-5 border border-sand-deep bg-white p-5">
          <Suspense fallback={<p className="text-sm text-muted">Pricing…</p>}>
            <PlannerPrice slug={planner.slug} />
          </Suspense>
          {planner.founded_year ? (
            <Fact
              label={isHousePlanner(planner.slug) ? "Producing since" : "Planning since"}
              value={String(planner.founded_year)}
            />
          ) : null}
          {planner.languages.length ? <Fact label="Languages" value={planner.languages.join(" · ")} /> : null}
          {planner.specialties.length ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Specialties</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {planner.specialties.map((s) => (
                  <span key={s} className="border border-sand-deep px-2.5 py-1 text-xs text-ink-soft">
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
                className="flex items-center gap-2 text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink"
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
          <LocaleLink
            href="/#simulator"
            className="block bg-ink px-4 py-2.5 text-center text-sm font-semibold text-cream transition hover:bg-teal"
          >
            Build your budget first
          </LocaleLink>
        </aside>
      </div>
      )}
    </article>
  );
}

async function PlannerRank({ slug }: { slug: string }) {
  const [planners, votes, user] = await Promise.all([
    getPlanners(),
    getVoteTallies("planner"),
    getAuthUser(),
  ]);
  const ranked = [...planners].sort((a, b) => {
    const likes = shownVotes(b.slug, votes[b.id]).up - shownVotes(a.slug, votes[a.id]).up;
    if (likes) return likes;
    return a.name.localeCompare(b.name);
  });
  const index = ranked.findIndex((p) => p.slug === slug);
  const planner = ranked[index];
  if (!planner || index < 0) return null;
  const tally = shownVotes(planner.slug, votes[planner.id]);
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-saffron">
        Rank {String(index + 1).padStart(2, "0")}
      </p>
      <VoteButtons
        targetType="planner"
        targetId={planner.id}
        up={tally.up}
        down={tally.down}
        signedIn={!!user}
        returnTo={`/planners/${slug}`}
      />
    </div>
  );
}

async function PlannerPrice({ slug }: { slug: string }) {
  const [user, planner, currency, locale] = await Promise.all([
    getAuthUser(),
    getPlannerBySlug(slug),
    getRequestCurrency(),
    getRequestLocale(),
  ]);
  const priced = user && planner ? (await revealPlannerPrices([planner]))[0] : planner;
  const from = priced?.price_from ?? null;
  const model = priced?.price_model ?? null;
  const price =
    model === "Commission"
      ? `${from}% of vendor spend`
      : from
        ? `From ${money(from, currency, locale)} flat fee`
        : "On request";
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Pricing</p>
      <div className="mt-1 text-sm font-medium text-ink">
        <PriceLock revealed={!!user} href={`/planners/${slug}`}>
          {price}
        </PriceLock>
      </div>
    </div>
  );
}

function PlannerGallery({ slug, name, domain }: { slug: string; name: string; domain: string | null }) {
  const photos = plannerPhotos(slug, name);
  if (!photos.length) return null;
  return (
    <section className="mt-10">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {photos.map((photo, index) => (
          <figure
            key={photo.src}
            className={`relative overflow-hidden border border-sand-deep bg-sand ${index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 960px) 560px, 100vw"
              className="object-cover"
              priority={index === 0}
            />
          </figure>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted">
        Photographs published by {name}
        {domain ? ` on ${domain}` : ""}.
      </p>
    </section>
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
