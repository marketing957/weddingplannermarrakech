"use client";

import { useEffect, useMemo, useState } from "react";
import { LocaleLink } from "@/i18n/LocaleLink";
import { ALL_CHECKLIST_IDS, CHECKLIST_PHASES, CHECKLIST_STORAGE_KEY } from "@/lib/checklist";

function read(): string[] {
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(ids: string[]) {
  localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event("wpm-checklist"));
}

export function ChecklistApp({ compact = false }: { compact?: boolean }) {
  const [done, setDone] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDone(read());
    setReady(true);
  }, []);

  const set = useMemo(() => new Set(done), [done]);
  const total = ALL_CHECKLIST_IDS.length;
  const count = ALL_CHECKLIST_IDS.filter((id) => set.has(id)).length;
  const pct = total ? Math.round((count / total) * 100) : 0;

  function toggle(id: string) {
    setDone((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      persist(next);
      return next;
    });
  }

  return (
    <div className={compact ? "max-h-[560px] overflow-y-auto pr-1" : undefined}>
      <div className="border border-sand-deep bg-white p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Progress</p>
            <p className="mt-1 font-display text-3xl font-semibold text-ink">
              {ready ? `${count} / ${total}` : "—"}
            </p>
          </div>
          <p className="text-sm text-ink-soft">{pct}% of the path covered</p>
        </div>
        <div className="mt-4 h-px overflow-hidden bg-sand-deep">
          <div className="h-full bg-ink transition-[width]" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {CHECKLIST_PHASES.map((phase) => {
          const phaseDone = phase.items.filter((i) => set.has(i.id)).length;
          return (
            <section key={phase.id}>
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold text-ink">{phase.title}</h2>
                <p className="text-xs text-muted">
                  {phase.window} · {phaseDone}/{phase.items.length}
                </p>
              </div>
              <ul className="space-y-2">
                {phase.items.map((item) => {
                  const on = set.has(item.id);
                  return (
                    <li key={item.id}>
                      <div
                        className={`flex items-start gap-3 border px-4 py-3 ${
                          on ? "border-ink bg-sand" : "border-sand-deep bg-white"
                        }`}
                      >
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          onClick={() => toggle(item.id)}
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border ${
                            on ? "border-ink bg-ink text-cream" : "border-sand-deep bg-white"
                          }`}
                        >
                          {on ? (
                            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
                              <path
                                d="M2 6.2 4.6 9 10 3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          ) : null}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium ${on ? "text-ink-soft line-through" : "text-ink"}`}>
                            {item.label}
                          </p>
                          {item.href ? (
                            <LocaleLink href={item.href} className="mt-1 inline-block text-xs font-semibold text-teal">
                              Open tool →
                            </LocaleLink>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
