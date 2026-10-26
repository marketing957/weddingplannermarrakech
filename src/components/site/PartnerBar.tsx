import { LogoMarquee } from "@/components/site/LogoMarquee";
import { CurrencySwitch } from "@/components/site/CurrencySwitch";
import { LanguageSwitch } from "@/i18n/LanguageSwitch";
import { LocaleLink } from "@/i18n/LocaleLink";

export function PartnerBar() {
  return (
    <header className="sticky top-0 z-50 hidden border-b border-sand-deep/80 bg-cream/90 backdrop-blur-md lg:block">
      <div className="flex h-16 items-center gap-8 px-6">
        <LocaleLink href="/" className="flex shrink-0 items-center gap-3" aria-label="Wedding Planner Marrakesh home">
          <span className="grid h-8 w-8 place-items-center border border-ink text-[10px] font-semibold tracking-[0.18em] text-ink">
            WPM
          </span>
          <span className="leading-none">
            <span className="block font-display text-[22px] font-medium tracking-tight text-ink">Marrakesh</span>
            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">
              Wedding atelier
            </span>
          </span>
        </LocaleLink>
        <LogoMarquee />
        <div className="flex shrink-0 items-center gap-2">
          <CurrencySwitch />
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
}
