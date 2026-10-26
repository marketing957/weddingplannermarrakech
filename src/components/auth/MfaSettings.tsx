"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Factor = { id: string; status: string; friendly_name?: string };

export function MfaSettings() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  async function refresh() {
    const sb = createClient();
    const { data } = await sb.auth.mfa.listFactors();
    setFactors(data?.totp ?? []);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function startEnroll() {
    setBusy(true);
    setError("");
    const sb = createClient();
    const { data, error: enrollError } = await sb.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Authenticator",
    });
    if (enrollError || !data) {
      setError(enrollError?.message ?? "Could not start authenticator setup.");
      setBusy(false);
      return;
    }
    setFactorId(data.id);
    setQr(data.totp.qr_code);
    setSecret(data.totp.secret);
    setEnrolling(true);
    setBusy(false);
  }

  async function confirmEnroll() {
    setBusy(true);
    setError("");
    const sb = createClient();
    const challenge = await sb.auth.mfa.challenge({ factorId });
    if (challenge.error) {
      setError(challenge.error.message);
      setBusy(false);
      return;
    }
    const verify = await sb.auth.mfa.verify({
      factorId,
      challengeId: challenge.data.id,
      code: code.trim(),
    });
    if (verify.error) {
      setError(verify.error.message);
      setBusy(false);
      return;
    }
    setEnrolling(false);
    setQr("");
    setSecret("");
    setCode("");
    setBusy(false);
    await refresh();
  }

  async function remove(id: string) {
    setBusy(true);
    setError("");
    const sb = createClient();
    const { error: unenrollError } = await sb.auth.mfa.unenroll({ factorId: id });
    if (unenrollError) setError(unenrollError.message);
    setBusy(false);
    await refresh();
  }

  const verified = factors.filter((f) => f.status === "verified");

  return (
    <section className="mt-12 rounded-2xl border border-sand-deep bg-white p-6">
      <h2 className="font-display text-xl font-semibold text-ink">Two-factor authentication</h2>
      <p className="mt-1 text-sm text-ink-soft">
        After you turn this on, sign-in asks for a code from an authenticator app. Saved plans stay locked until that
        code is entered.
      </p>
      {verified.length ? (
        <ul className="mt-4 space-y-2 text-sm">
          {verified.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-3 border border-sand-deep px-3 py-2">
              <span>Authenticator app · active</span>
              <button
                type="button"
                disabled={busy}
                onClick={() => void remove(f.id)}
                className="text-xs font-semibold uppercase tracking-wider text-terracotta"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {enrolling ? (
        <div className="mt-4 space-y-3">
          {qr ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="Authenticator QR code" className="h-40 w-40 bg-white" />
          ) : null}
          {secret ? <p className="break-all text-xs text-muted">Secret: {secret}</p> : null}
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Code from the app"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\s/g, ""))}
            className="w-full max-w-xs border border-sand-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void confirmEnroll()}
              className="inline-flex items-center gap-2 bg-ink px-4 py-2 text-sm font-semibold text-cream disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Enable
            </button>
            <button
              type="button"
              onClick={() => {
                setEnrolling(false);
                setQr("");
                setSecret("");
              }}
              className="px-4 py-2 text-sm font-semibold text-ink-soft"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : verified.length === 0 ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => void startEnroll()}
          className="mt-4 inline-flex items-center gap-2 border border-sand-deep bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-ink disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Enable authenticator
        </button>
      ) : null}
      {error ? <p className="mt-3 text-sm text-terracotta">{error}</p> : null}
    </section>
  );
}
