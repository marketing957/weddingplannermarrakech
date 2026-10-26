import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { getAuthUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getPlanners, getVendors, getVenues } from "@/lib/data";
import { PlanProgress } from "@/components/site/PlanProgress";
import { SideNav } from "@/components/site/SideNav";
import { LocaleLink } from "@/i18n/LocaleLink";
import { getDictionary } from "@/i18n";
import { getRequestLocale } from "@/i18n/request";

export function Sidebar({ className = "" }: { className?: string }) {
  return (
    <aside className={`flex h-full flex-col border-r border-sand-deep bg-cream ${className}`}>
      <div className="px-5 pt-6">
        <Suspense fallback={<div className="h-28 animate-pulse bg-sand" />}>
          <PlanCard />
        </Suspense>
      </div>

      <nav className="mt-7 flex-1 overflow-y-auto px-3">
        <Suspense fallback={<div className="h-48 animate-pulse bg-sand" />}>
          <NavWithCounts />
        </Suspense>
      </nav>

      <div className="mt-auto border-t border-sand-deep px-4 py-4">
        <Suspense fallback={<div className="h-10 animate-pulse bg-sand" />}>
          <AuthSlot />
        </Suspense>
        <Suspense fallback={null}>
          <InMarrakesh />
        </Suspense>
      </div>
    </aside>
  );
}

async function PlanCard() {
  const dict = getDictionary(await getRequestLocale());
  return (
    <div className="border border-sand-deep bg-white px-4 py-4">
      <p className="kicker">{dict.nav.yourPlanLabel}</p>
      <PlanProgress />
      <LocaleLink
        href="/checklist"
        className="mt-3 flex items-center justify-center border border-ink bg-ink px-4 py-2 text-xs font-semibold tracking-wide text-cream transition hover:bg-teal"
      >
        {dict.nav.resume}
      </LocaleLink>
    </div>
  );
}

async function InMarrakesh() {
  const dict = getDictionary(await getRequestLocale());
  return <p className="mt-3 px-1 text-[10px] uppercase tracking-[0.16em] text-muted">{dict.nav.inMarrakesh}</p>;
}

async function NavWithCounts() {
  const [venues, planners, vendors] = await Promise.all([getVenues(), getPlanners(), getVendors()]);
  return <SideNav venues={venues.length} planners={planners.length} vendors={vendors.length} />;
}

async function AuthSlot() {
  const user = await getAuthUser();
  const dict = getDictionary(await getRequestLocale());
  if (!user) {
    return (
      <LocaleLink
        href="/login"
        className="flex items-center gap-2 border border-sand-deep bg-white px-3 py-2 text-sm font-medium text-ink hover:border-ink"
      >
        {dict.nav.login}
      </LocaleLink>
    );
  }
  const initial = (user.email ?? "Y")[0].toUpperCase();
  return (
    <div className="flex items-center gap-2 border border-sand-deep bg-white px-2 py-1.5">
      <span className="grid h-7 w-7 place-items-center bg-ink text-[11px] font-semibold text-cream">{initial}</span>
      <LocaleLink href="/plan" className="min-w-0 flex-1 truncate text-xs font-medium text-ink">
        {user.email}
      </LocaleLink>
      <LogoutButton>
        <LogOut className="h-3.5 w-3.5" />
      </LogoutButton>
    </div>
  );
}
