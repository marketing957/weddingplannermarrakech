"use client";

import { LocaleLink } from "@/i18n/LocaleLink";
import { useI18n } from "@/i18n/LocaleProvider";

export function SiteFooter() {
  const { dict } = useI18n();
  return (
    <footer className="mt-24 bg-ink text-cream">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-medium">Wedding Planner Marrakesh</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">{dict.footer.blurb}</p>
          <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-saffron">{dict.footer.marrakech}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{dict.nav.explore}</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><LocaleLink href="/#simulator" className="hover:text-white">{dict.nav.simulator}</LocaleLink></li>
            <li><LocaleLink href="/map" className="hover:text-white">{dict.nav.map}</LocaleLink></li>
            <li><LocaleLink href="/venues" className="hover:text-white">{dict.nav.venues}</LocaleLink></li>
            <li><LocaleLink href="/planners" className="hover:text-white">{dict.nav.planners}</LocaleLink></li>
            <li><LocaleLink href="/vendors" className="hover:text-white">{dict.nav.vendors}</LocaleLink></li>
            <li><LocaleLink href="/wedding-date-optimizer" className="hover:text-white">{dict.nav.seasonPicker}</LocaleLink></li>
            <li><LocaleLink href="/checklist" className="hover:text-white">{dict.nav.checklist}</LocaleLink></li>
            <li><LocaleLink href="/timeline" className="hover:text-white">{dict.nav.timeline}</LocaleLink></li>
            <li><LocaleLink href="/guides" className="hover:text-white">{dict.nav.guides}</LocaleLink></li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">{dict.footer.guides}</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><LocaleLink href="/guides/complete-guide" className="hover:text-white">{dict.footer.completeGuide}</LocaleLink></li>
            <li><LocaleLink href="/legal" className="hover:text-white">{dict.footer.legalReq}</LocaleLink></li>
            <li><LocaleLink href="/guides/best-seasons" className="hover:text-white">{dict.footer.bestSeasons}</LocaleLink></li>
            <li><LocaleLink href="/guides/wedding-zones" className="hover:text-white">{dict.footer.zones}</LocaleLink></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-[11px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {dict.footer.rights} ·{" "}
            <LocaleLink href="/privacy" className="hover:text-white">{dict.footer.privacy}</LocaleLink>
            {" · "}
            <LocaleLink href="/terms" className="hover:text-white">{dict.footer.terms}</LocaleLink>
            {" · "}
            <LocaleLink href="/contact" className="hover:text-white">{dict.footer.contact}</LocaleLink>
            {" · "}
            <LocaleLink href="/our-services" className="hover:text-white">{dict.nav.about}</LocaleLink>
          </p>
          <p>{dict.footer.estimates}</p>
        </div>
      </div>
    </footer>
  );
}
