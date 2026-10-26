"use client";

import {
  Calculator,
  CalendarRange,
  ClipboardCheck,
  Gavel,
  ListOrdered,
  Map,
  MapPin,
  Store,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useI18n } from "@/i18n/LocaleProvider";

export function SideNav({
  venues,
  planners,
  vendors,
}: {
  venues: number;
  planners: number;
  vendors: number;
}) {
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
    { href: "/venues", label: dict.nav.venues, icon: MapPin, count: `${venues}+` },
    { href: "/planners", label: dict.nav.planners, icon: Users, count: String(planners) },
    { href: "/vendors", label: dict.nav.vendors, icon: Store, count: String(vendors) },
  ];

  return (
    <>
      <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{dict.nav.tools}</p>
      <ul>
        {tools.map((item) => {
          const active = isActive(pathname, item.match);
          return (
            <li key={item.href}>
              <LocaleLink
                href={item.href}
                className={`flex items-center gap-2.5 border-l-2 px-3 py-2 text-[13px] ${
                  active
                    ? "border-saffron bg-white font-semibold text-ink"
                    : "border-transparent text-ink-soft hover:border-sand-deep hover:text-ink"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="flex-1">{item.label}</span>
              </LocaleLink>
            </li>
          );
        })}
      </ul>

      <p className="mt-7 px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
        {dict.nav.catalog}
      </p>
      <ul>
        {catalog.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <LocaleLink
                href={item.href}
                className={`flex items-center gap-2.5 border-l-2 px-3 py-2 text-[13px] ${
                  active
                    ? "border-saffron bg-white font-semibold text-ink"
                    : "border-transparent text-ink-soft hover:border-sand-deep hover:text-ink"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="flex-1">{item.label}</span>
                <span className="text-[11px] tabular-nums text-muted">{item.count}</span>
              </LocaleLink>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function isActive(pathname: string, match: string) {
  if (match === "/") return pathname === "/";
  return pathname === match || pathname.startsWith(`${match}/`);
}
