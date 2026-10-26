"use client";

import { useEffect, useState } from "react";
import {
  Calculator,
  CalendarRange,
  ClipboardCheck,
  Gavel,
  ListOrdered,
  Map,
  Search,
} from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";

export function ToolDock() {
  const [hash, setHash] = useState("");
  const { dict } = useI18n();
  const items = [
    { href: "#simulator", label: dict.tools.budget, icon: Calculator, match: "simulator" },
    { href: "#tools-map", label: dict.tools.map, icon: Map, match: "tools" },
    { href: "#tools-season", label: dict.tools.season, icon: CalendarRange, match: "tools" },
    { href: "#tools-checklist", label: dict.tools.checklist, icon: ClipboardCheck, match: "tools" },
    { href: "#tools-timeline", label: dict.tools.timeline, icon: ListOrdered, match: "tools" },
    { href: "#tools-legal", label: dict.tools.legal, icon: Gavel, match: "tools" },
    { href: "#tools-catalog", label: dict.tools.catalog, icon: Search, match: "tools" },
  ];

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <nav
      aria-label={dict.tools.dock}
      className="sticky z-30 -mx-5 mb-10 border-y border-sand-deep bg-cream/95 px-5 backdrop-blur-md top-[56px] lg:top-16"
    >
      <div className="flex gap-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const on = hash === item.href || (item.href === "#simulator" && hash === "#simulator");
          const toolsOn = item.match === "tools" && hash === item.href;
          const active = on || toolsOn;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] transition ${
                active
                  ? "border-ink text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
