import { ArrowRight } from "lucide-react";
import { LocaleLink } from "@/i18n/LocaleLink";
import { HOUSE } from "@/lib/partners";

export function HouseNote({
  kicker,
  title,
  body,
  cta,
}: {
  kicker: string;
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <aside className="mt-10 border border-ink bg-ink p-8 text-cream sm:p-10">
      <p className="kicker text-saffron">{kicker}</p>
      <h3 className="mt-3 max-w-2xl font-display text-2xl font-medium sm:text-3xl">{title}</h3>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65">{body}</p>
      <LocaleLink
        href={HOUSE.plannerHref}
        className="mt-6 inline-flex items-center gap-2 border border-saffron bg-saffron px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-saffron-soft"
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </LocaleLink>
    </aside>
  );
}
