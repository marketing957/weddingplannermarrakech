"use client";

import { useEffect, useState } from "react";
import { ALL_CHECKLIST_IDS, CHECKLIST_PHASES, CHECKLIST_STORAGE_KEY } from "@/lib/checklist";
import { useI18n } from "@/i18n/LocaleProvider";

function loadDone(): Set<string> {
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

export function PlanProgress() {
  const [done, setDone] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const { dict } = useI18n();

  useEffect(() => {
    setDone(loadDone());
    setReady(true);
    const onStorage = () => setDone(loadDone());
    window.addEventListener("storage", onStorage);
    window.addEventListener("wpm-checklist", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("wpm-checklist", onStorage);
    };
  }, []);

  const total = ALL_CHECKLIST_IDS.length;
  const count = ALL_CHECKLIST_IDS.filter((id) => done.has(id)).length;
  const next =
    CHECKLIST_PHASES.flatMap((p) => p.items).find((item) => !done.has(item.id))?.label ?? dict.tools.allClear;

  return (
    <>
      <p className="mt-2 text-sm leading-snug text-ink-soft">
        <span className="font-display text-[1.35rem] font-medium text-ink">
          {ready ? `${count}/${total}` : "—"}
        </span>
        <span className="mt-1 block line-clamp-2 text-[13px] text-muted">
          {ready && count === total ? dict.tools.planComplete : `${dict.tools.next} ${next}`}
        </span>
      </p>
    </>
  );
}
