import type { ReactNode } from "react";
import type { Metadata } from "next";
import { LocaleLink } from "@/i18n/LocaleLink";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { PriceLock } from "@/components/site/PriceLock";
import { VoteButtons } from "@/components/site/VoteButtons";
import { getAuthUser } from "@/lib/auth";
import { JsonLd } from "@/components/site/JsonLd";
import { VenueGallery } from "@/components/site/VenueGallery";
import { getVenueBySlug, getVenues, getVoteTallies, revealVenuePrices } from "@/lib/data";
import { getDictionary } from "@/i18n";
import { getRequestLocale } from "@/i18n/request";
import { breadcrumbLd, venuePlaceLd } from "@/lib/seo";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { photosForVenue, heroPhoto } from "@/lib/photos";
import { companyLogoSrc } from "@/lib/logos";
import { moneyNight } from "@/lib/format";
import { getRequestCurrency } from "@/lib/currency-server";

export async function generateStaticParams() {
  const venues = await getVenues();
  return venues.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/venues/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);
  if (!venue) return { title: "Venue not found" };
  const hero = heroPhoto(venue, "en");
  const description =
    venue.setting_text?.slice(0, 155) ??
    `${venue.name} is a ${venue.zone} wedding venue in Marrakesh. Capacity ${venue.capacity_seated} seated.`;
  return {
    title: `${venue.name} — Marrakesh wedding venue`,
    description,
    keywords: [
      `${venue.name} Marrakesh`,
      `${venue.name} wedding`,
      `wedding venue ${venue.zone} Marrakesh`,
      "Wedding Planner Marrakesh",
      hero.searchQuery,
    ],
    alternates: { canonical: `/venues/${slug}` },
    openGraph: {
      title: `${venue.name} — wedding venue in ${venue.zone}, Marrakesh`,
      description,
      images: [{ url: hero.src, width: hero.width, height: hero.height, alt: hero.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${venue.name} — Marrakesh wedding venue`,
      description,
      images: [hero.src],
    },
  };
}

export default function VenuePage({ params }: PageProps<"/venues/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-5 pb-10 pt-12"><div className="h-64 animate-pulse bg-sand" /></div>}>
      <VenueArticle params={params} />
    </Suspense>
  );
}

async function VenueArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);
  if (!venue) notFound();
  return (
    <article className="mx-auto max-w-4xl px-5 pb-10 pt-12">
      <JsonLd
        data={breadcrumbLd([
          { name: "Wedding Planner Marrakesh", path: "/" },
          { name: "Wedding venues in Marrakesh", path: "/venues" },
          { name: venue.name, path: `/venues/${venue.slug}` },
        ])}
      />
      <LocaleLink href="/venues" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline">
        <ArrowLeft className="h-4 w-4" /> All venues
      </LocaleLink>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-teal">
        Wedding venue in Marrakesh · {venue.zone}
      </p>
      <div className="mt-3 flex items-center gap-4">
        <CompanyLogo name={venue.name} src={companyLogoSrc({ slug: venue.slug, name: venue.name })} size={56} />
        <h1 className="font-display text-4xl font-semibold text-ink sm:text-5xl">{venue.name}</h1>
      </div>
      <p className="mt-2 text-ink-soft">
        {venue.tier} · {venue.styles.join(" / ")}
      </p>
      <Suspense fallback={<div className="mt-8 h-40 animate-pulse rounded-2xl bg-sand" />}>
        <VenueFacts slug={slug} />
      </Suspense>
    </article>
  );
}

async function VenueFacts({ slug }: { slug: string }) {
  const [venueRaw, votes, user, others, locale, currency] = await Promise.all([
    getVenueBySlug(slug),
    getVoteTallies("venue"),
    getAuthUser(),
    getVenues(),
    getRequestLocale(),
    getRequestCurrency(),
  ]);
  if (!venueRaw) return null;
  const [venue] = user ? await revealVenuePrices([venueRaw]) : [venueRaw];
  const dict = getDictionary(locale);
  const photos = photosForVenue(venue, locale, 4);
  const t = votes[venue.id];
  const signedIn = !!user;
  const comparables = others.filter((v) => v.id !== venue.id).slice(0, 3);

  return (
    <>
      <JsonLd data={venuePlaceLd(venue, photos)} />
      <VenueGallery photos={photos} kicker={dict.catalog.detail.photosKicker} searchLabel={dict.catalog.detail.photosSearch} />
      <p className="mt-3 text-sm text-ink-soft">{dict.catalog.detail.photosNote}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <Fact
          label="Price / night"
          value={
            <PriceLock revealed={signedIn} href={`/venues/${venue.slug}`}>
              <span className="font-semibold">{moneyNight(venue.price_night_low, currency, locale)}</span>
            </PriceLock>
          }
        />
        <Fact label="Guest capacity" value={`Up to ${venue.capacity_seated}`} />
        <Fact
          label="Sleep"
          value={venue.sleep_rooms ? `${venue.sleep_rooms} rooms` : "Day guests"}
        />
        <Fact label="Min. stay" value={`${venue.min_nights} nights`} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl border border-sand-deep bg-white/70 p-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">Editorial score</p>
          <p className="font-display text-3xl font-semibold text-teal">{Number(venue.score_overall).toFixed(1)}</p>
        </div>
        <VoteButtons
          targetType="venue"
          targetId={venue.id}
          up={t?.up ?? 0}
          down={t?.down ?? 0}
          signedIn={signedIn}
          returnTo={`/venues/${venue.slug}`}
        />
        <p className="text-sm text-muted">Last verified {venue.last_verified ?? "2026"}</p>
      </div>

      <section className="prose mt-10">
        <h2>Setting and photographs</h2>
        <p>{venue.setting_text ?? `${venue.name} is a ${venue.tier} ${venue.styles[0] ?? "venue"} in ${venue.zone}.`}</p>
        <h2>Ceremony and reception</h2>
        <p>{venue.ceremony_text ?? `Capacity ${venue.capacity_seated} seated. Confirm exclusive-use terms in writing.`}</p>
        <h2>Costs</h2>
        <p>
          {signedIn
            ? venue.costs_text ??
              `Hire from ${moneyNight(venue.price_night_low, currency, locale)} a night, ${venue.min_nights}-night minimum. ${venue.catering_policy}.`
            : "Log in to see the nightly hire, catering policy and a grounded all-in range for this venue."}
        </p>
        <h2>Who it suits</h2>
        <p>{venue.suits_text ?? "Couples who want this setting and can fill the rooms."}</p>
      </section>

      {venue.amenities.length ? (
        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-ink">Amenities</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {venue.amenities.map((a) => (
              <span key={a} className="border border-sand-deep px-3 py-1 text-xs text-ink-soft">
                {a}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-12 bg-ink p-6 text-cream">
        <p className="font-display text-xl font-medium">See your full {venue.name} budget</p>
        <p className="mt-1 text-sm text-white/55">
          Guests, season and the team around the venue: the simulator prices the whole day in two minutes.
        </p>
        <LocaleLink
          href="/#simulator"
          className="mt-4 inline-block bg-saffron px-5 py-2.5 text-sm font-semibold text-ink hover:bg-saffron-soft"
        >
          Open the budget simulator
        </LocaleLink>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ink">Other venues to consider</h2>
        <ul className="mt-4 divide-y divide-sand-deep">
          {comparables.map((v) => {
            return (
              <li key={v.id} className="flex items-center justify-between gap-3 py-3">
                <LocaleLink href={`/venues/${v.slug}`} className="flex min-w-0 items-center gap-3 font-medium text-ink hover:text-teal">
                  <CompanyLogo name={v.name} src={companyLogoSrc({ slug: v.slug, name: v.name })} size={36} />
                  <span className="truncate">{v.name}</span>
                </LocaleLink>
                <span className="shrink-0 text-sm text-muted">{v.capacity_seated} guests</span>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-sand-deep bg-white/70 p-4">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <div className="mt-1 text-sm font-medium text-ink">{value}</div>
    </div>
  );
}
