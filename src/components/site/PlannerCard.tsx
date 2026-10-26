"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Planner } from "@/lib/supabase/types";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useCurrency } from "@/components/site/CurrencyProvider";
import { useI18n } from "@/i18n/LocaleProvider";
import { companyLogoSrc } from "@/lib/logos";
import { isHousePlanner } from "@/lib/partners";
import { plannerPhotos } from "@/lib/planner-media";

export function PlannerRow({ planner }: { planner: Planner }) {
  const { dict } = useI18n();
  return (
    <LocaleLink
      href={`/planners/${planner.slug}`}
      className="group flex items-center justify-between gap-4 border-b border-sand-deep py-5 transition hover:bg-sand/50"
    >
      <div className="flex min-w-0 items-center gap-3">
        <CompanyLogo
          name={planner.name}
          src={companyLogoSrc({ slug: planner.slug, name: planner.name, website: planner.website, websiteDomain: planner.website_domain })}
          size={40}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-xl font-medium text-ink">{planner.name}</p>
            {isHousePlanner(planner.slug) ? (
              <span className="border border-saffron px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-saffron">
                {dict.home.houseBadge}
              </span>
            ) : null}
          </div>
          {planner.tagline ? <p className="truncate text-sm text-muted">{planner.tagline}</p> : null}
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted group-hover:text-ink">
        {dict.home.readProfile} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </span>
    </LocaleLink>
  );
}

export function PlannerCard({ planner }: { planner: Planner }) {
  const { dict } = useI18n();
  const { format } = useCurrency();
  const cover = plannerPhotos(planner.slug, planner.name)[0];
  return (
    <LocaleLink
      href={`/planners/${planner.slug}`}
      className="group flex flex-col border border-sand-deep bg-white p-6 transition hover:border-ink"
    >
      {cover ? (
        <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/9] overflow-hidden bg-sand">
          <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 960px) 400px, 100vw" className="object-cover" />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CompanyLogo
            name={planner.name}
            src={companyLogoSrc({ slug: planner.slug, name: planner.name, website: planner.website, websiteDomain: planner.website_domain })}
            size={44}
          />
          <h3 className="font-display text-2xl font-medium text-ink">{planner.name}</h3>
        </div>
        {isHousePlanner(planner.slug) ? (
          <span className="border border-saffron px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-saffron">
            {dict.home.houseBadge}
          </span>
        ) : null}
      </div>
      {planner.tagline ? <p className="mt-2 text-sm text-muted">{planner.tagline}</p> : null}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {planner.specialties.slice(0, 3).map((s) => (
          <span key={s} className="border border-sand-deep px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-ink-soft">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-sand-deep pt-4 text-sm">
        <span className="text-muted">
          {planner.price_from == null
            ? "Sign in for price"
            : planner.price_model === "Commission"
              ? `${planner.price_from}% commission`
              : `From ${format(planner.price_from)}`}
        </span>
        <span className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink">
          {dict.home.readProfile} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </LocaleLink>
  );
}
