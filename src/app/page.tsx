import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { BudgetSimulator } from "@/components/simulator/BudgetSimulator";
import { Accordion } from "@/components/site/Accordion";
import { JsonLd } from "@/components/site/JsonLd";
import { PlannerRow } from "@/components/site/PlannerCard";
import { getFaqs, getMonths, getPlanners, getPricingConfig, getVendors, getVenues, getVoteTallies } from "@/lib/data";
import { shownVotes } from "@/lib/vendor-sentiment";
import { faqLd, pageAlternates } from "@/lib/seo";
import { pinForVenue } from "@/lib/geo";
import { mapPhotoFields } from "@/lib/photos";
import { companyLogoSrc } from "@/lib/logos";
import { ToolDock } from "@/components/home/ToolDock";
import { HomeTools } from "@/components/home/HomeTools";
import { InteractiveHero } from "@/components/home/InteractiveHero";
import { getDictionary, t } from "@/i18n";
import { getRequestLocale } from "@/i18n/request";
import { LocaleLink } from "@/i18n/LocaleLink";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);
  return {
    title: { absolute: dict.meta.title },
    description: dict.meta.description,
    alternates: pageAlternates(locale, "/"),
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: locale === "fr" ? "/fr" : "/",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
    },
  };
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeBody />
    </Suspense>
  );
}

async function HomeBody() {
  const dict = getDictionary(await getRequestLocale());
  return (
    <>
      <InteractiveHero />

      <div className="mx-auto max-w-6xl px-5">
        <ToolDock />
      </div>

      <section id="simulator" className="mx-auto max-w-6xl scroll-mt-36 px-5">
        <Suspense fallback={<SimulatorSkeleton />}>
          <SimulatorLoader />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-16">
        <Suspense fallback={<div className="h-[480px] animate-pulse bg-sand" />}>
          <ToolsLoader />
        </Suspense>
      </section>

      <section id="planners" className="mx-auto max-w-6xl scroll-mt-36 px-5 pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand-deep pb-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-medium text-ink">{dict.home.plannersTitle}</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">{dict.home.plannersLede}</p>
          </div>
          <LocaleLink
            href="/planners"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink"
          >
            {dict.home.fullDirectory} <ArrowRight className="h-4 w-4" />
          </LocaleLink>
        </div>
        <Suspense fallback={<ListSkeleton rows={5} />}>
          <PlannersPreview />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-start">
          <div>
            <h2 className="font-display text-4xl font-medium text-ink">{dict.home.hiringTitle}</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">{dict.home.hiringLede}</p>
          </div>
          <Suspense fallback={<ListSkeleton rows={6} />}>
            <PlannerGuideFaq />
          </Suspense>
        </div>
      </section>

      <section className="mt-24 bg-ink">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="kicker text-saffron">Editorial</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-medium text-cream">{dict.home.methodTitle}</h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/60">{dict.home.methodBody}</p>
          <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-saffron">{dict.home.methodBy}</p>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl scroll-mt-36 px-5 pt-24 pb-4">
        <h2 className="font-display text-4xl font-medium text-ink">{dict.home.faqTitle}</h2>
        <div className="mt-8">
          <Suspense fallback={<ListSkeleton rows={8} />}>
            <GeneralFaq />
          </Suspense>
        </div>
      </section>
      <Suspense>
        <HomeFaqSchema />
      </Suspense>
    </>
  );
}

async function SimulatorLoader() {
  const config = await getPricingConfig();
  return <BudgetSimulator config={config} />;
}

async function ToolsLoader() {
  const [venues, planners, vendors, months, locale] = await Promise.all([
    getVenues(),
    getPlanners(),
    getVendors(),
    getMonths(),
    getRequestLocale(),
  ]);
  const pins = venues.map((v) => {
    const { lat, lng } = pinForVenue(v.slug, v.zone);
    return {
      slug: v.slug,
      name: v.name,
      zone: v.zone,
      capacity: v.capacity_seated,
      tier: v.tier,
      lat,
      lng,
      ...mapPhotoFields(v, locale),
    };
  });
  return (
    <HomeTools
      pins={pins}
      months={months}
      venues={venues.map((v) => ({
        slug: v.slug,
        name: v.name,
        meta: `${v.zone} · ${v.capacity_seated} seated`,
        href: `/venues/${v.slug}`,
        logoSrc: companyLogoSrc({ slug: v.slug, name: v.name }),
      }))}
      planners={planners.map((p) => ({
        slug: p.slug,
        name: p.name,
        meta: p.tagline ?? "Wedding planner in Marrakesh",
        href: `/planners/${p.slug}`,
        logoSrc: companyLogoSrc({ slug: p.slug, name: p.name, website: p.website, websiteDomain: p.website_domain }),
      }))}
      vendors={vendors.map((v) => ({
        slug: v.slug,
        name: v.name,
        meta: v.category_slug.replace(/-/g, " "),
        href: `/vendors/${v.slug}`,
        logoSrc: companyLogoSrc({ slug: v.slug, name: v.name, website: v.website }),
      }))}
    />
  );
}

async function PlannersPreview() {
  const [planners, votes, locale] = await Promise.all([getPlanners(), getVoteTallies("planner"), getRequestLocale()]);
  const dict = getDictionary(locale);
  const preview = [...planners]
    .sort((a, b) => {
      const likes = shownVotes(b.slug, votes[b.id]).up - shownVotes(a.slug, votes[a.id]).up;
      if (likes) return likes;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 6);
  return (
    <div className="mt-8">
      {preview.map((p) => (
        <PlannerRow key={p.id} planner={p} />
      ))}
      <div className="pt-5">
        <LocaleLink
          href="/planners"
          className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-teal"
        >
          {t(dict.home.seeAll, { n: planners.length })} <ArrowRight className="h-4 w-4" />
        </LocaleLink>
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

async function HomeFaqSchema() {
  const [general, planner] = await Promise.all([getFaqs("general"), getFaqs("planner_guide")]);
  const items = [...general, ...planner].map((f) => ({ question: f.question, answer: f.answer }));
  if (!items.length) return null;
  return <JsonLd data={faqLd(items)} />;
}

function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="mx-auto h-16 max-w-xl animate-pulse rounded-2xl bg-sand" />
      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse bg-sand" />
        ))}
      </div>
    </div>
  );
}

function SimulatorSkeleton() {
  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse bg-sand" />
        ))}
      </div>
      <div className="h-[520px] animate-pulse bg-sand" />
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
