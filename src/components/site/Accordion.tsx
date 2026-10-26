import { LocaleLink } from "@/i18n/LocaleLink";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/supabase/types";

export function Accordion({ items, defaultOpenFirst = false }: { items: FaqItem[]; defaultOpenFirst?: boolean }) {
  return (
    <div className="divide-y divide-sand-deep border-y border-sand-deep">
      {items.map((item, i) => (
        <details key={item.id} open={defaultOpenFirst && i === 0} className="group px-0 transition hover:bg-sand/40">
          <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-left">
            <span className="font-display text-xl font-medium text-ink group-open:text-teal">
              {item.question}
            </span>
            <ChevronDown className="chevron h-5 w-5 shrink-0 text-muted" />
          </summary>
          <div className="pb-6 text-[15px] leading-relaxed text-ink-soft">
            <p>{item.answer}</p>
            {item.link_href && item.link_label ? (
              <LocaleLink
                href={item.link_href}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink"
              >
                {item.link_label} <ArrowRight className="h-4 w-4" />
              </LocaleLink>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}
