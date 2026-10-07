import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/supabase/types";

export function Accordion({ items, defaultOpenFirst = false }: { items: FaqItem[]; defaultOpenFirst?: boolean }) {
  return (
    <div className="divide-y divide-sand-deep rounded-2xl border border-sand-deep bg-white/70 shadow-card">
      {items.map((item, i) => (
        <details key={item.id} open={defaultOpenFirst && i === 0} className="group px-5">
          <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-left">
            <span className="font-display text-lg font-semibold text-ink group-open:text-teal">
              {item.question}
            </span>
            <ChevronDown className="chevron h-5 w-5 shrink-0 text-muted" />
          </summary>
          <div className="pb-5 text-[15px] leading-relaxed text-ink-soft">
            <p>{item.answer}</p>
            {item.link_href && item.link_label ? (
              <Link
                href={item.link_href}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:underline"
              >
                {item.link_label} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}
