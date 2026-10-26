import type { Metadata } from "next";
import { ChecklistApp } from "@/components/checklist/ChecklistApp";

export const metadata: Metadata = {
  title: "Marrakesh wedding checklist",
  description:
    "A practical 12-month checklist covering budget, venue, vendors and legal paperwork for a wedding in Marrakesh.",
  alternates: { canonical: "/checklist" },
};

export default function ChecklistPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">Free tool</p>
      <h1 className="mt-3 font-display text-4xl font-semibold italic text-ink sm:text-5xl">
        the list
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Tick things off as you go. Progress stays in this browser and feeds the counter in the sidebar.
      </p>
      <div className="mt-8">
        <ChecklistApp />
      </div>
    </div>
  );
}
