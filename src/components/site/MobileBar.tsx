"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Calculator,
  CalendarRange,
  ClipboardCheck,
  Gavel,
  LayoutGrid,
  ListOrdered,
  LogIn,
  Map,
  MapPin,
  Menu,
  NotebookPen,
  Store,
  Users,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CurrencySwitch } from "@/components/site/CurrencySwitch";
import { LanguageSwitch } from "@/i18n/LanguageSwitch";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useI18n } from "@/i18n/LocaleProvider";

export function MobileBar() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const pathname = usePathname();
  const { dict } = useI18n();

  const tools = [
    { href: "/#simulator", label: dict.nav.simulator, icon: Calculator, match: "/" },
    { href: "/map", label: dict.nav.map, icon: Map, match: "/map" },
    { href: "/wedding-date-optimizer", label: dict.nav.seasonPicker, icon: CalendarRange, match: "/wedding-date-optimizer" },
    { href: "/checklist", label: dict.nav.checklist, icon: ClipboardCheck, match: "/checklist" },
    { href: "/timeline", label: dict.nav.timeline, icon: ListOrdered, match: "/timeline" },
    { href: "/legal", label: dict.nav.legal, icon: Gavel, match: "/legal" },
  ];
  const catalog = [
    { href: "/venues", label: dict.nav.venues, icon: MapPin },
    { href: "/planners", label: dict.nav.planners, icon: Users },
    { href: "/vendors", label: dict.nav.vendors, icon: Store },
    { href: "/guides", label: dict.nav.guides, icon: NotebookPen },
  ];

  useEffect(() => {
    const sb = createClient();
    sb.auth.getClaims().then(({ data }) => {
      const e = (data?.claims as { email?: string } | undefined)?.email ?? null;
      setEmail(e);
    });
  }, []);

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-sand-deep/80 bg-cream/95 backdrop-blur-md lg:hidden">
        <div className="flex h-14 items-center justify-between px-5">
          <LocaleLink href="/" className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center border border-ink text-[9px] font-semibold tracking-[0.14em]">
              WPM
            </span>
            <span className="font-display text-lg font-medium tracking-tight">Marrakesh</span>
          </LocaleLink>
          <div className="flex items-center gap-2">
            <CurrencySwitch />
            <LanguageSwitch />
            <button
              type="button"
              aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
              onClick={() => setOpen((v) => !v)}
              className="grid h-8 w-8 place-items-center border border-sand-deep bg-white"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label={dict.nav.closeMenu} className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-cream text-ink shadow-float">
            <LocaleLink href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 border-b border-sand-deep px-5 py-5">
              <span className="grid h-7 w-7 place-items-center border border-ink text-[9px] font-semibold tracking-[0.14em]">
                WPM
              </span>
              <span className="font-display text-lg font-medium">Marrakesh</span>
            </LocaleLink>
            <nav className="flex-1 overflow-y-auto px-3 py-4" onClick={() => setOpen(false)}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{dict.nav.tools}</p>
              {tools.map((item) => {
                const active =
                  item.match === "/" ? pathname === "/" : pathname === item.match || pathname.startsWith(`${item.match}/`);
                return (
                  <LocaleLink
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 border-l-2 px-3 py-2 text-sm ${
                      active ? "border-saffron font-semibold text-ink" : "border-transparent text-ink-soft"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </LocaleLink>
                );
              })}
              <p className="px-3 pb-2 pt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                {dict.nav.catalog}
              </p>
              {catalog.map((item) => (
                <LocaleLink
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 border-l-2 border-transparent px-3 py-2 text-sm text-ink-soft"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </LocaleLink>
              ))}
            </nav>
            <div className="border-t border-sand-deep p-4">
              {email ? (
                <LocaleLink
                  href="/plan"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 border border-ink px-3 py-2.5 text-sm font-semibold"
                >
                  <LayoutGrid className="h-4 w-4" /> {dict.nav.myPlan}
                </LocaleLink>
              ) : (
                <LocaleLink
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 bg-ink px-3 py-2.5 text-sm font-semibold text-cream"
                >
                  <LogIn className="h-4 w-4" /> {dict.nav.login}
                </LocaleLink>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
