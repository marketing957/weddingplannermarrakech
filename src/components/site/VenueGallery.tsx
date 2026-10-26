import Image from "next/image";
import type { VenuePhoto } from "@/lib/photos";

export function VenueGallery({
  photos,
  kicker,
  searchLabel,
}: {
  photos: VenuePhoto[];
  kicker: string;
  searchLabel: string;
}) {
  if (!photos.length) return null;
  const [hero, ...rest] = photos;
  return (
    <section className="mt-8" aria-label={kicker}>
      <p className="kicker">{kicker}</p>
      <figure className="relative mt-3 aspect-[16/9] overflow-hidden border border-sand-deep bg-sand">
        <Image
          src={hero.src}
          alt={hero.alt}
          title={hero.searchQuery}
          fill
          priority
          sizes="(min-width: 960px) 896px, 100vw"
          className="object-cover"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 text-[12px] leading-relaxed text-white/90">
          <span className="block font-medium text-white">{hero.alt}</span>
          <span className="mt-0.5 block text-white/70">
            {searchLabel}: {hero.searchQuery}
          </span>
        </figcaption>
      </figure>
      {rest.length ? (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {rest.map((photo) => (
            <figure key={photo.id} className="relative aspect-[4/3] overflow-hidden border border-sand-deep bg-sand">
              <Image
                src={photo.src}
                alt={photo.alt}
                title={photo.searchQuery}
                fill
                sizes="(min-width: 960px) 290px, 33vw"
                className="object-cover"
              />
              <figcaption className="sr-only">
                {photo.caption} {searchLabel}: {photo.searchQuery}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
      <p className="mt-2 text-[11px] text-muted">
        {hero.caption} · {hero.credit} ·{" "}
        <a href={hero.licenseUrl} className="underline decoration-sand-deep underline-offset-2 hover:decoration-ink">
          {hero.licenseName}
        </a>
      </p>
    </section>
  );
}
