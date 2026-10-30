import Image from "next/image";
import type { Metadata } from "next";
import { LocaleLink } from "@/i18n/LocaleLink";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { PriceLock } from "@/components/site/PriceLock";
import { VoteButtons } from "@/components/site/VoteButtons";
import { getAuthUser } from "@/lib/auth";
import { getVendorBySlug, getVendorCategories, getVendors, getVoteTallies, revealVendorPrices } from "@/lib/data";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { companyLogoSrc } from "@/lib/logos";
import { money } from "@/lib/format";
import { getRequestCurrency } from "@/lib/currency-server";
import { getRequestLocale } from "@/i18n/request";
import { ASIMETRICA_SHOTS } from "@/lib/asimetrica";
import { isHouseVendor, leadsCategory } from "@/lib/partners";
import { shownVotes } from "@/lib/vendor-sentiment";
import type { Vendor, VendorCategory, VoteCount } from "@/lib/supabase/types";
import type { Currency } from "@/lib/currency";
import type { Locale } from "@/i18n";

// Catalog order: community likes, most first.
export async function generateStaticParams() {
  const [cats, vendors] = await Promise.all([getVendorCategories(), getVendors()]);
  return [...cats.map((c) => ({ slug: c.slug })), ...vendors.map((v) => ({ slug: v.slug }))];
}

export async function generateMetadata({ params }: PageProps<"/vendors/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cats = await getVendorCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (cat) {
    return {
      title: `${cat.name} in Marrakesh`,
      description: cat.description,
      alternates: { canonical: `/vendors/${slug}` },
    };
  }
  const vendor = await getVendorBySlug(slug);
  if (!vendor) return { title: "Not found" };
  return {
    title: `${vendor.name} — Marrakesh wedding vendor`,
    description: `${vendor.name} is a wedding vendor in Marrakesh listed on Wedding Planner Marrakesh.`,
    alternates: { canonical: `/vendors/${slug}` },
  };
}

export default async function VendorSlugPage({ params }: PageProps<"/vendors/[slug]">) {
  const { slug } = await params;
  const cats = await getVendorCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (cat) return <CategoryView cat={cat} />;
  const vendor = await getVendorBySlug(slug);
  if (!vendor) notFound();
  return <VendorView slug={slug} />;
}

function CategoryView({ cat }: { cat: VendorCategory }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-12">
      <LocaleLink href="/vendors" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline">
        <ArrowLeft className="h-4 w-4" /> All categories
      </LocaleLink>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink">{cat.name}</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">{cat.description}</p>
      <Suspense fallback={<div className="mt-8 h-64 animate-pulse rounded-2xl bg-sand" />}>
        <CategoryTable slug={cat.slug} />
      </Suspense>
    </div>
  );
}

async function CategoryTable({ slug }: { slug: string }) {
  const [vendorsRaw, votes, user, currency, locale] = await Promise.all([
    getVendors(),
    getVoteTallies("vendor"),
    getAuthUser(),
    getRequestCurrency(),
    getRequestLocale(),
  ]);
  const vendors = user ? await revealVendorPrices(vendorsRaw) : vendorsRaw;
  const rows = vendors
    .filter((v) => v.category_slug === slug)
    .sort((a, b) => {
      const likes = shownVotes(b.slug, votes[b.id]).up - shownVotes(a.slug, votes[a.id]).up;
      if (likes) return likes;
      return Number(b.score) - Number(a.score);
    });
  return <VendorTable rows={rows} votes={votes} signedIn={!!user} path={`/vendors/${slug}`} currency={currency} locale={locale} />;
}

async function VendorView({ slug }: { slug: string }) {
  const vendor = await getVendorBySlug(slug);
  if (!vendor) notFound();
  return (
    <article className="mx-auto max-w-3xl px-5 pb-10 pt-12">
      <LocaleLink
        href={`/vendors/${vendor.category_slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to category
      </LocaleLink>
      <Suspense fallback={<div className="mt-8 h-40 animate-pulse rounded-2xl bg-sand" />}>
        <VendorDetail slug={slug} />
      </Suspense>
    </article>
  );
}

async function VendorDetail({ slug }: { slug: string }) {
  const [vendorRaw, votes, user, currency, locale] = await Promise.all([
    getVendorBySlug(slug),
    getVoteTallies("vendor"),
    getAuthUser(),
    getRequestCurrency(),
    getRequestLocale(),
  ]);
  if (!vendorRaw) return null;
  const [vendor] = user ? await revealVendorPrices([vendorRaw]) : [vendorRaw];
  const t = shownVotes(vendor.slug, votes[vendor.id]);
  const signedIn = !!user;
  return (
    <>
      <div className="mt-6 flex items-center gap-4">
        <CompanyLogo
          name={vendor.name}
          src={companyLogoSrc({ slug: vendor.slug, name: vendor.name, website: vendor.website })}
          size={48}
        />
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{vendor.name}</h1>
          <p className="text-sm text-muted">
            {vendor.category_slug.replace(/-/g, " ")}
            {leadsCategory(vendor.slug) ? " · best in category" : ""}
          </p>
        </div>
      </div>
      {isHouseVendor(vendor.slug) ? (
        <figure className="relative mt-6 aspect-[16/9] overflow-hidden border border-sand-deep bg-sand">
          <Image
            src={ASIMETRICA_SHOTS[0].src}
            alt={ASIMETRICA_SHOTS[0].alt}
            fill
            sizes="720px"
            className="object-cover"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-ink px-3 py-2 text-[11px] text-cream">
            {ASIMETRICA_SHOTS[0].caption} · asimetricaprod.com
          </figcaption>
        </figure>
      ) : (
        <div className="mt-6 flex h-36 items-center justify-center border border-sand-deep bg-sand">
          <CompanyLogo
            name={vendor.name}
            src={companyLogoSrc({ slug: vendor.slug, name: vendor.name, website: vendor.website })}
            size={88}
          />
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <p className="font-display text-2xl font-semibold text-teal">{Number(vendor.score).toFixed(1)}</p>
        <VoteButtons
          targetType="vendor"
          targetId={vendor.id}
          up={t?.up ?? 0}
          down={t?.down ?? 0}
          signedIn={signedIn}
          returnTo={`/vendors/${vendor.slug}`}
        />
        <PriceLock revealed={signedIn} href={`/vendors/${vendor.slug}`}>
          <span className="font-semibold">{vendor.price_from != null ? `from ${money(vendor.price_from, currency, locale)}` : ""}</span>
        </PriceLock>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {vendor.styles.map((s) => (
          <span key={s} className="rounded-full bg-sand px-3 py-1 text-xs text-ink-soft">
            {s}
          </span>
        ))}
      </div>
    </>
  );
}

function VendorTable({
  rows,
  votes = {},
  signedIn,
  path,
  currency,
  locale,
}: {
  rows: Vendor[];
  votes?: Record<string, VoteCount>;
  signedIn: boolean;
  path: string;
  currency: Currency;
  locale: Locale;
}) {
  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border border-sand-deep bg-white/70 shadow-card">
      <table className="min-w-[860px] w-full text-left text-sm">
        <thead className="bg-sand text-xs uppercase tracking-wider text-teal">
          <tr>
            <th className="px-3 py-3">Vendor</th>
            <th className="px-3 py-3">Langs</th>
            <th className="px-3 py-3">Likes</th>
            <th className="px-3 py-3">Score</th>
            <th className="px-3 py-3">Price</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((v) => {
            const tally = shownVotes(v.slug, votes[v.id]);
            return (
              <tr key={v.id} className="border-t border-sand-deep/70">
                <td className="px-3 py-3">
                  <LocaleLink href={`/vendors/${v.slug}`} className="flex items-center gap-3 font-semibold text-ink hover:text-teal">
                    <CompanyLogo name={v.name} src={companyLogoSrc({ slug: v.slug, name: v.name, website: v.website })} size={36} />
                    {v.name}
                  </LocaleLink>
                  {leadsCategory(v.slug) ? (
                    <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-saffron">
                      best
                    </span>
                  ) : null}
                  {v.verified ? (
                    <span className="ml-2 text-[10px] font-semibold uppercase text-olive">verified</span>
                  ) : null}
                </td>
                <td className="px-3 py-3 text-ink-soft">{v.languages.join(" · ")}</td>
                <td className="px-3 py-3">
                  <VoteButtons
                    targetType="vendor"
                    targetId={v.id}
                    up={tally.up}
                    down={tally.down}
                    signedIn={signedIn}
                    returnTo={path}
                  />
                </td>
                <td className="px-3 py-3 tabular-nums">{Number(v.score).toFixed(1)}</td>
                <td className="px-3 py-3">
                  <PriceLock revealed={signedIn} href={path}>
                    <span className="tabular-nums">{v.price_from != null ? `from ${money(v.price_from, currency, locale)}` : ""}</span>
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
