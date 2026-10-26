import { LocaleLink } from "@/i18n/LocaleLink";

const nav = [
  { href: "/#simulator", label: "Budget simulator" },
  { href: "/planners", label: "Planners" },
  { href: "/guides", label: "Guides" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-sand-deep/70 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <LocaleLink href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-teal text-cream">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2l.9-5.5-4-3.9L9.5 8z" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Wedding Planner <span className="text-teal">Marrakesh</span>
          </span>
        </LocaleLink>
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex">
          {nav.map((item) => (
            <LocaleLink key={item.href} href={item.href} className="transition hover:text-teal">
              {item.label}
            </LocaleLink>
          ))}
        </nav>
        <LocaleLink
          href="/#save-plan"
          className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-cream shadow-sm transition hover:bg-teal-deep"
        >
          Save my plan
        </LocaleLink>
      </div>
    </header>
  );
}
