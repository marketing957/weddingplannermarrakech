import { CompanyLogo } from "@/components/site/CompanyLogo";
import { companyLogoSrc } from "@/lib/logos";

const brands: Array<{ name: string; slug: string }> = [
  { name: "La Mamounia", slug: "la-mamounia-wedding-cost" },
  { name: "Royal Mansour", slug: "royal-mansour-wedding-cost" },
  { name: "Palais Namaskar", slug: "palais-namaskar-wedding-cost" },
  { name: "Asimetrica Prod", slug: "asimetrica-prod" },
  { name: "Amanjena", slug: "amanjena-wedding-cost" },
  { name: "Four Seasons", slug: "four-seasons-marrakech-wedding-cost" },
  { name: "Fairmont", slug: "fairmont-royal-palm-wedding-cost" },
  { name: "Mandarin Oriental", slug: "mandarin-oriental-wedding-cost" },
  { name: "Selman", slug: "selman-marrakech-wedding-cost" },
  { name: "Dar Ahlam", slug: "dar-ahlam-wedding-cost" },
  { name: "Beldi Country Club", slug: "beldi-country-club-wedding-cost" },
  { name: "Scarabeo Camp", slug: "scarabeo-camp-wedding-cost" },
];

export function LogoMarquee({ compact = false }: { compact?: boolean }) {
  return (
    <div className="logo-track relative min-h-0 min-w-0 flex-1 overflow-hidden" aria-label="Partner companies">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-cream to-transparent sm:w-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-cream to-transparent sm:w-10" />
      <div className="logo-marquee flex items-center">
        <BrandRow compact={compact} />
        <BrandRow compact={compact} ariaHidden />
      </div>
    </div>
  );
}

function BrandRow({ compact, ariaHidden }: { compact: boolean; ariaHidden?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center ${compact ? "gap-8 pr-8" : "gap-10 pr-10"}`}
      aria-hidden={ariaHidden ? true : undefined}
    >
      {brands.map((b) => (
        <CompanyLogo
          key={`${ariaHidden ? "dup-" : ""}${b.slug}`}
          name={b.name}
          src={companyLogoSrc({ slug: b.slug, name: b.name })}
          size={compact ? 32 : 40}
          className="border-sand-deep/80 bg-cream"
        />
      ))}
    </div>
  );
}
