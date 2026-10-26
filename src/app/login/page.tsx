import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { authErrorMessage } from "@/lib/auth-error";
import { getAuthUser } from "@/lib/auth";
import { safeInternalPath } from "@/lib/safe-path";
import { getDictionary } from "@/i18n";
import { LocaleLink } from "@/i18n/LocaleLink";
import { getRequestLocale } from "@/i18n/request";

export const metadata: Metadata = { title: "Log in", robots: { index: false, follow: true } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string; error?: string }>;
}) {
  const user = await getAuthUser();
  if (user) return <AlreadySignedIn email={user.email} />;

  const { returnTo, error } = await searchParams;
  const next = safeInternalPath(returnTo);
  return <AuthScreen mode="login" returnTo={next} notice={authErrorMessage(error) ?? null} />;
}

export async function AlreadySignedIn({ email }: { email: string | null }) {
  const dict = getDictionary(await getRequestLocale());
  return (
    <div className="mx-auto max-w-lg px-5 py-20">
      <p className="kicker">Account</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-ink">{dict.nav.signedInTitle}</h1>
      <p className="mt-3 text-lg text-ink-soft">{dict.nav.signedInBody}</p>
      {email ? <p className="mt-4 text-sm font-medium text-ink">{email}</p> : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <LogoutButton className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-teal">
          <LogOut className="h-4 w-4" />
          {dict.nav.logout}
        </LogoutButton>
        <LocaleLink
          href="/plan"
          className="inline-flex items-center border border-sand-deep bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink"
        >
          {dict.nav.signedInPlan}
        </LocaleLink>
      </div>
    </div>
  );
}

export function AuthScreen({
  mode,
  returnTo,
  notice = null,
}: {
  mode: "login" | "signup";
  returnTo: string;
  notice?: string | null;
}) {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="kicker">Free account</p>
        <h1 className="mt-3 font-display text-4xl font-medium text-ink">
          See the vendors who fit your budget
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          Your plan is waiting: the venue, the planner and the full team, by name.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-ink-soft">
          <li className="border border-sand-deep bg-white p-4">
            <p className="font-semibold text-ink">The method</p>
            <p className="mt-1">
              Budgets are built from real Marrakesh weddings and checked line by line. No national
              averages.
            </p>
          </li>
          <li className="border border-sand-deep bg-white p-4">
            <p className="font-semibold text-ink">The editor</p>
            <p className="mt-1">
              Wissal, founder and lead editor, researches every vendor in the catalog herself.
            </p>
          </li>
          <li className="border border-sand-deep bg-white p-4">
            <p className="font-semibold text-ink">The couples</p>
            <p className="mt-1">500+ couples are planning their Marrakesh wedding here.</p>
          </li>
        </ul>
      </div>
      <div className="h-fit border border-sand-deep bg-white p-6">
        <AuthForm mode={mode} returnTo={returnTo} notice={notice} />
      </div>
    </div>
  );
}
