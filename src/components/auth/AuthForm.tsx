"use client";

import { useState, type FormEvent } from "react";
import { LocaleLink } from "@/i18n/LocaleLink";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { MfaChallenge } from "@/components/auth/MfaChallenge";
import { safeInternalPath } from "@/lib/safe-path";

export function AuthForm({
  mode,
  returnTo = "/plan",
  notice = null,
}: {
  mode: "login" | "signup";
  returnTo?: string;
  notice?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "sent" | "error" | "mfa">("idle");
  const [message, setMessage] = useState("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const next = safeInternalPath(returnTo);
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function google() {
    setStatus("working");
    const sb = createClient();
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("working");
    setMessage("");
    const sb = createClient();
    if (password.length < 8) {
      setStatus("error");
      setMessage("Use at least 8 characters.");
      return;
    }
    if (mode === "signup") {
      const { error } = await sb.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }
      setStatus("sent");
      return;
    }
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setMessage("Those details did not match an account.");
      return;
    }
    const aal = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal.data?.nextLevel === "aal2" && aal.data.currentLevel !== "aal2") {
      setStatus("mfa");
      return;
    }
    window.location.assign(next);
  }

  if (status === "mfa") {
    return <MfaChallenge redirectTo={next} />;
  }

  if (status === "sent") {
    return (
      <div className="border border-sand-deep bg-olive-soft p-6">
        <p className="font-display text-xl font-semibold text-olive">Check your inbox</p>
        <p className="mt-2 text-sm text-ink-soft">
          We sent a sign-in link to <span className="font-medium">{email}</span>. Open it to see the
          vendors who fit your budget.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notice ? <p className="border border-terracotta/40 bg-white px-3 py-2.5 text-sm text-terracotta">{notice}</p> : null}
      <button
        type="button"
        onClick={google}
        disabled={status === "working"}
        className="flex w-full items-center justify-center gap-2 border border-sand-deep bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-ink disabled:opacity-60"
      >
        {status === "working" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </button>
      <p className="text-center text-xs uppercase tracking-wider text-muted">or</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-sand-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Password (8+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-sand-deep bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={status === "working"}
          className="flex w-full items-center justify-center gap-2 bg-ink px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-teal disabled:opacity-60"
        >
          {status === "working" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {mode === "signup" ? "Create a free account" : "Log in"}
        </button>
        {status === "error" ? <p className="text-sm text-terracotta">{message}</p> : null}
      </form>
      <p className="text-center text-xs text-muted">
        Free. No credit card required. By continuing you agree to our{" "}
        <LocaleLink href="/terms" className="text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink">
          Terms
        </LocaleLink>{" "}
        and{" "}
        <LocaleLink href="/privacy" className="text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink">
          Privacy Policy
        </LocaleLink>
        .
      </p>
      <p className="text-center text-sm text-ink-soft">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <LocaleLink href={`/login?returnTo=${encodeURIComponent(next)}`} className="font-semibold text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink">
              Log in
            </LocaleLink>
          </>
        ) : (
          <>
            New here?{" "}
            <LocaleLink href={`/sign-up?returnTo=${encodeURIComponent(next)}`} className="font-semibold text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink">
              Create a free account
            </LocaleLink>
          </>
        )}
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.46c-.28 1.5-1.12 2.77-2.39 3.62v3h3.86c2.26-2.08 3.56-5.14 3.56-8.65z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.92l-3.86-3c-1.07.72-2.45 1.15-4.09 1.15-3.14 0-5.8-2.12-6.75-4.97H1.27v3.09C3.25 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.25 14.26A7.2 7.2 0 0 1 4.87 12c0-.79.14-1.55.38-2.26V6.65H1.27A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.27 5.35l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.65l3.98 3.09C6.2 6.87 8.86 4.75 12 4.75z"
      />
    </svg>
  );
}
