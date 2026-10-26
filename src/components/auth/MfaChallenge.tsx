"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function MfaChallenge({ redirectTo }: { redirectTo?: string }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const sb = createClient();
    const factors = await sb.auth.mfa.listFactors();
    const totp = factors.data?.totp.find((f) => f.status === "verified") ?? factors.data?.totp[0];
    if (factors.error || !totp) {
      setError(factors.error?.message ?? "No authenticator is set up on this account.");
      setBusy(false);
      return;
    }
    const challenge = await sb.auth.mfa.challenge({ factorId: totp.id });
    if (challenge.error) {
      setError(challenge.error.message);
      setBusy(false);
      return;
    }
    const verify = await sb.auth.mfa.verify({
      factorId: totp.id,
      challengeId: challenge.data.id,
      code: code.trim(),
    });
    if (verify.error) {
      setError(verify.error.message);
      setBusy(false);
      return;
    }
    if (redirectTo) window.location.assign(redirectTo);
    else window.location.reload();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="font-display text-xl font-semibold text-ink">Authenticator code</p>
      <p className="text-sm text-ink-soft">Open your authenticator app and enter the 6-digit code.</p>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        required
        minLength={6}
        maxLength={8}
        placeholder="123456"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\s/g, ""))}
        className="w-full border border-sand-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
      />
      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 bg-ink px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-teal disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Verify
      </button>
      {error ? <p className="text-sm text-terracotta">{error}</p> : null}
    </form>
  );
}
