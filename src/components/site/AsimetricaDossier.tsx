import Image from "next/image";
import { LocaleLink } from "@/i18n/LocaleLink";
import { CompanyLogo } from "@/components/site/CompanyLogo";
import { getVendorCategories, getVendors } from "@/lib/data";
import { ASIMETRICA_SERVICES, ASIMETRICA_SHOTS } from "@/lib/asimetrica";
import { companyLogoSrc } from "@/lib/logos";
import { HOUSE, isHouseVendor } from "@/lib/partners";

export async function AsimetricaDossier() {
  const [vendors, categories] = await Promise.all([getVendors(), getVendorCategories()]);
  const bySlug = new Map(vendors.map((v) => [v.slug, v]));

  return (
    <div className="mt-10 space-y-14">
      <section>
        <p className="kicker">From asimetricaprod.com</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {ASIMETRICA_SHOTS.map((shot, index) => (
            <figure
              key={shot.src}
              className={`relative overflow-hidden border border-sand-deep bg-sand ${index === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}
            >
              <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 960px) 640px, 100vw" className="object-cover" priority={index === 0} />
              <figcaption className="absolute inset-x-0 bottom-0 bg-ink px-3 py-2 text-[11px] text-cream">{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted">Photographs published on asimetricaprod.com.</p>
      </section>

      <section className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4 text-[15px] leading-relaxed text-ink-soft">
          <p>
            Asimetrica Prod is a Marrakesh audiovisual house. They rent the equipment and they run it: sound, light, LED walls, staging and a technician who stays on site. The studio is at B11 Davinci, Rue Al Mouqaouama, Quartier Bayard.
          </p>
          <p>
            For a wedding they treat the weekend as one production. Ceremony sound, cocktail and reception systems, decorative light indoors or in the garden, a DJ booth, dance-floor effects, and an LED wall for films and live moments. Installation and strike are part of the job, including when the plan moves from a riad courtyard to a Palmeraie lawn or an Agafay camp.
          </p>
          <p>
            The same desk also holds the rest of the supplier list: photography, flowers, catering, cake and bridal beauty, written into the same cue sheet as the technical plot. Couples who still want a separate planner for rooms and airport transfers can keep one. The production brief stays here.
          </p>
          <p>
            They have worked luxury weddings and private events in Morocco for more than ten years, in English, French and Spanish. Corporate clients named on their site include CNESTEN, Cosumar, Harrods, Land Rover and Orone. A brief starts with the venue, the guest count and what has to be heard and seen. They answer at +212 660 305 536 and sales@asimetricaprod.com.
          </p>
        </div>
        <aside className="h-fit space-y-4 border border-sand-deep bg-white p-5 text-sm">
          <Fact label="Studio" value="B11 Davinci, Rue Al Mouqaouama, Quartier Bayard, Marrakesh" />
          <Fact label="Phone" value="+212 660 305 536" />
          <Fact label="Email" value="sales@asimetricaprod.com" />
          <Fact label="On a wedding" value="Sound, light, LED, stage, music, photo, flowers, catering, cake, beauty" />
          <a
            href={HOUSE.website}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-sm font-semibold text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink"
          >
            asimetricaprod.com
          </a>
        </aside>
      </section>

      <section>
        <h2 className="font-display text-3xl font-medium text-ink">What the desk covers</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {ASIMETRICA_SERVICES.map((service) => {
            const vendor = bySlug.get(service.slug);
            return (
              <li key={service.slug} className="border border-sand-deep bg-white p-5">
                <LocaleLink href={`/vendors/${service.slug}`} className="font-display text-xl font-medium text-ink hover:text-saffron">
                  {service.title}
                </LocaleLink>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{service.detail}</p>
                {vendor ? (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-teal">
                    Score {Number(vendor.score).toFixed(1)} · best in {vendor.category_slug.replace(/-/g, " ")}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-3xl font-medium text-ink">Other companies in each service</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
          The rest of the catalogue, beside Asimetrica. Each mark is the logo filed for that company.
        </p>
        <div className="mt-8 space-y-10">
          {categories.map((category) => {
            const others = vendors.filter((v) => v.category_slug === category.slug && !isHouseVendor(v.slug)).slice(0, 4);
            if (!others.length) return null;
            return (
              <div key={category.slug}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-medium text-ink">{category.name}</h3>
                  <LocaleLink href={`/vendors/${category.slug}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-teal hover:underline">
                    Full list
                  </LocaleLink>
                </div>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {others.map((vendor) => (
                    <li key={vendor.slug}>
                      <LocaleLink href={`/vendors/${vendor.slug}`} className="block border border-sand-deep bg-white p-4 hover:border-ink">
                        <div className="flex h-20 items-center justify-center bg-sand">
                          <CompanyLogo
                            name={vendor.name}
                            src={companyLogoSrc({ slug: vendor.slug, name: vendor.name, website: vendor.website })}
                            size={56}
                          />
                        </div>
                        <p className="mt-3 font-semibold text-ink">{vendor.name}</p>
                        <p className="mt-1 text-xs text-muted">{vendor.styles.slice(0, 2).join(" · ")}</p>
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
