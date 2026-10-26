"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Estimate, SimulatorState } from "@/lib/pricing";
import { useCurrency } from "@/components/site/CurrencyProvider";
import { t, localePath } from "@/i18n";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useI18n } from "@/i18n/LocaleProvider";

export function SavePlanForm({ state, est }: { state: SimulatorState; est: Estimate }) {
  const { locale, dict } = useI18n();
  const { format } = useCurrency();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const signupHref = `/sign-up?returnTo=${localePath(locale, "/plan")}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const honeypot = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    setStatus("saving");
    setMessage("");
    const sb = createClient();
    const { data } = await sb.auth.getClaims();
    const userId = (data?.claims as { sub?: string } | undefined)?.sub;
    const payload = { state, breakdown: est.breakdown, low: est.low, high: est.high };

    if (userId) {
      const { error } = await sb.from("saved_plans").insert({
        user_id: userId,
        guests: state.guests,
        estimate: est.total,
        state,
        breakdown: est.breakdown,
      });
      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }
      setStatus("done");
      return;
    }

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        website: honeypot,
        wedding_date: date,
        guest_count: state.guests,
        estimate: est.total,
        plan: payload,
      }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus("error");
      setMessage(body.error ?? dict.sim.couldNotSave);
      return;
    }
    try {
      localStorage.setItem("wpm_pending_plan", JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div id="save-plan" className="scroll-mt-24 border border-sand-deep bg-olive-soft p-6">
        <p className="font-display text-xl font-medium text-olive">{dict.sim.saved}</p>
        <p className="mt-1 text-sm text-ink-soft">
          {t(dict.sim.savedBody, { n: format(est.total), g: state.guests })}{" "}
          <LocaleLink href={signupHref} className="font-semibold text-ink underline decoration-sand-deep underline-offset-4">
            {dict.catalog.createAccount}
          </LocaleLink>
        </p>
      </div>
    );
  }

  return (
    <form
      id="save-plan"
      onSubmit={onSubmit}
      className="scroll-mt-24 border border-sand-deep bg-white p-6"
    >
      <p className="font-display text-xl font-medium text-ink">{dict.sim.seeVendors}</p>
      <p className="mt-1 text-sm text-ink-soft">
        {t(dict.sim.saveBody, { n: format(est.total) })}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
        />
        <input
          type="text"
          placeholder={dict.sim.name}
          value={name}
          maxLength={120}
          onChange={(e) => setName(e.target.value)}
          className="border border-sand-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
        <input
          type="email"
          required
          placeholder={dict.sim.email}
          value={email}
          maxLength={254}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-sand-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
        <input
          type="text"
          placeholder={dict.sim.date}
          value={date}
          maxLength={40}
          onChange={(e) => setDate(e.target.value)}
          className="border border-sand-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-teal disabled:opacity-60"
        >
          {status === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          {dict.sim.savePlan}
        </button>
        <LocaleLink href={signupHref} className="text-sm font-semibold text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink">
          {dict.sim.orAccount}
        </LocaleLink>
        {status === "error" ? (
          <p className="text-sm text-terracotta">
            {dict.sim.couldNotSave} {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
