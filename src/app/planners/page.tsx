import type { Metadata } from "next";
import { LocaleLink } from "@/i18n/LocaleLink";
import { Suspense } from "react";
import { PriceLock } from "@/components/site/PriceLock";
import { VoteButtons } from "@/components/site/VoteButtons";
import { Accordion } from "@/components/site/Accordion";
import { getAuthUser } from "@/lib/auth";
import { HouseNote } from "@/components/site/HouseNote";
import { getFaqs, getPlanners, getVoteTallies, revealPlannerPrices } from "@/lib/data";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { companyLogoSrc } from "@/lib/logos";
import { money } from "@/lib/format";
import { getRequestCurrency } from "@/lib/currency-server";
import { getDictionary } from "@/i18n";
import { getRequestLocale } from "@/i18n/request";
import { isHousePlanner } from "@/lib/partners";
import { shownVotes } from "@/lib/vendor-sentiment";

export const metadata: Metadata = {
  title: "Wedding planners in Marrakesh",
  description:
    "Directory of wedding planners in Marrakesh — independent profiles, community votes, no pay-to-play. Part of Wedding Planner Marrakesh.",
  alternates: { canonical: "/planners" },
};

export default function PlannersPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-12">
      <p className="kicker">Catalog</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
        Wedding Planners in Marrakesh, Ranked by Community Votes
      </h1>
      <p className="mt-3 text-ink-soft">
        Ordered by community votes · one vote per account · no paid placement
      </p>
      <Suspense fallback={null}>
        <HouseNoteSlot />
      </Suspense>
      <Suspense fallback={<div className="mt-10 h-96 animate-pulse bg-sand" />}>
        <PlannersTable />
      </Suspense>
      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">How we rank</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Planners are ordered by the upvotes shown on each row, most first. Voting requires a signed-in
            account and each account votes once per planner. We do not score them as a league table, we do
            not publish their fees until you log in, and no planner pays to appear.
          </p>
        </div>
        <Suspense fallback={null}>
          <PlannerFaqs />
        </Suspense>
      </div>
    </div>
  );
}

async function HouseNoteSlot() {
  const dict = getDictionary(await getRequestLocale());
  return (
    <HouseNote
      kicker={dict.home.houseKicker}
      title={dict.home.houseTitle}
      body={dict.home.houseBody}
      cta={dict.home.houseCta}
    />
  );
}

async function PlannerFaqs() {
  const items = await getFaqs("planner_guide");
  return <Accordion items={items.slice(0, 4)} />;
}

async function PlannersTable() {
  const [plannersRaw, votes, user, currency, locale] = await Promise.all([
    getPlanners(),
    getVoteTallies("planner"),
    getAuthUser(),
    getRequestCurrency(),
    getRequestLocale(),
  ]);
  const signedIn = !!user;
  const planners = signedIn ? await revealPlannerPrices(plannersRaw) : plannersRaw;
  const ranked = [...planners].sort((a, b) => {
    const house = Number(isHousePlanner(b.slug)) - Number(isHousePlanner(a.slug));
    if (house) return house;
    const likes = shownVotes(b.slug, votes[b.id]).up - shownVotes(a.slug, votes[a.id]).up;
    if (likes) return likes;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="mt-8 overflow-x-auto border border-sand-deep bg-white">
      <table className="min-w-[900px] w-full text-left text-sm">
        <thead className="bg-sand text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-3 py-3">#</th>
            <th className="px-3 py-3">Planner</th>
            <th className="px-3 py-3">Community</th>
            <th className="px-3 py-3">Website</th>
            <th className="px-3 py-3">Instagram</th>
            <th className="px-3 py-3">Price</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((p, i) => {
            const t = shownVotes(p.slug, votes[p.id]);
            const fee =
              p.price_model === "Commission"
                ? `${p.price_from}% commission`
                : p.price_from
                  ? `from ${money(p.price_from, currency, locale)}`
                  : "On request";
            return (
              <tr key={p.id} className="border-t border-sand-deep/70 hover:bg-sand/40">
                <td className="px-3 py-3 tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</td>
                <td className="px-3 py-3">
                  <LocaleLink href={`/planners/${p.slug}`} className="flex items-center gap-3">
                    <CompanyLogo
                      name={p.name}
                      src={companyLogoSrc({ slug: p.slug, name: p.name, website: p.website, websiteDomain: p.website_domain })}
                      size={36}
                    />
                    <span>
                      <span className="block font-semibold text-ink hover:text-saffron">{p.name}</span>
                      <span className="block text-xs text-muted">
                        {isHousePlanner(p.slug) ? (
                          <span className="mr-2 font-semibold uppercase tracking-[0.12em] text-saffron">best</span>
                        ) : null}
                        {p.languages.join(" · ")}
                      </span>
                    </span>
                  </LocaleLink>
                </td>
                <td className="px-3 py-3">
                  <VoteButtons
                    targetType="planner"
                    targetId={p.id}
                    up={t?.up ?? 0}
                    down={t?.down ?? 0}
                    signedIn={signedIn}
                    returnTo="/planners"
                  />
                </td>
                <td className="px-3 py-3 text-ink-soft">{p.website_domain ?? "—"}</td>
                <td className="px-3 py-3 text-ink-soft">{p.instagram ?? "—"}</td>
                <td className="px-3 py-3">
                  <PriceLock revealed={signedIn} href="/planners">
                    <span className="tabular-nums">{fee}</span>
                  </PriceLock>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
