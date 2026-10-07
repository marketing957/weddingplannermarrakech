import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-sand-deep bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold text-ink">Wedding Planner Marrakech</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            An editorial planning platform for Marrakech weddings. Real budgets, every planner we
            have written about, and no commission from anyone.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/#simulator" className="hover:text-teal">Budget simulator</Link></li>
            <li><Link href="/planners" className="hover:text-teal">Wedding planners</Link></li>
            <li><Link href="/guides" className="hover:text-teal">Guides</Link></li>
            <li><Link href="/#faq" className="hover:text-teal">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal">Guides</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/guides/complete-guide" className="hover:text-teal">The complete guide</Link></li>
            <li><Link href="/guides/legal-requirements" className="hover:text-teal">Legal requirements</Link></li>
            <li><Link href="/guides/best-seasons" className="hover:text-teal">Best seasons</Link></li>
            <li><Link href="/guides/wedding-zones" className="hover:text-teal">Wedding zones</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sand-deep/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Wedding Planner Marrakech. Editorial, independent, commission-free.</p>
          <p>Estimates are indicative. Final quotes come from your planner and vendors.</p>
        </div>
      </div>
    </footer>
  );
}
