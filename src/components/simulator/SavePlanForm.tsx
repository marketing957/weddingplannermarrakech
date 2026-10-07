"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Estimate, SimulatorState } from "@/lib/pricing";
import { eur } from "@/lib/pricing";

export function SavePlanForm({ state, est }: { state: SimulatorState; est: Estimate }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");
    const sb = createClient();
    const { error } = await sb.from("leads").insert({
      email,
      name: name || null,
      wedding_date: date || null,
      guest_count: state.guests,
      estimate: est.total,
      plan: { state, breakdown: est.breakdown, low: est.low, high: est.high },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div id="save-plan" className="scroll-mt-24 rounded-2xl border border-olive/30 bg-olive-soft p-6">
        <p className="font-display text-xl font-semibold text-olive">Plan saved.</p>
        <p className="mt-1 text-sm text-ink-soft">
          We have your {eur.format(est.total)} plan for {state.guests} guests. The editorial team will review it
          and send a personalised vendor shortlist to <span className="font-medium">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form
      id="save-plan"
      onSubmit={onSubmit}
      className="scroll-mt-24 rounded-2xl border border-saffron/40 bg-saffron-soft/60 p-6"
    >
      <p className="font-display text-xl font-semibold text-ink">Save this plan, get it reviewed</p>
      <p className="mt-1 text-sm text-ink-soft">
        Free. Your {eur.format(est.total)} estimate becomes a reviewed budget with a personalised vendor
        selection, sent as a PDF. No commission, no spam.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-sand-deep bg-white px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
        />
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-sand-deep bg-white px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
        />
        <input
          type="text"
          placeholder="Wedding date (approx.)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-sand-deep bg-white px-3 py-2.5 text-sm outline-none ring-teal/30 focus:ring-2"
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-teal-deep disabled:opacity-60"
        >
          {status === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Send me the reviewed plan
        </button>
        {status === "error" ? <p className="text-sm text-terracotta">Could not save: {message}</p> : null}
      </div>
    </form>
  );
}
