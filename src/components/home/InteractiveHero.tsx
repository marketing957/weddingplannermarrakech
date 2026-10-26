"use client";

import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { HERO_AGAFAY, HERO_MEDINA, HERO_PALMERAIE } from "@/lib/real-photos";

const PATHS = [
  { id: "intimate" as const, image: HERO_MEDINA.src, credit: `${HERO_MEDINA.credit} · ${HERO_MEDINA.licenseName}` },
  { id: "palmeraie" as const, image: HERO_PALMERAIE.src, credit: `${HERO_PALMERAIE.credit} · ${HERO_PALMERAIE.licenseName}` },
  { id: "desert" as const, image: HERO_AGAFAY.src, credit: `${HERO_AGAFAY.credit} · ${HERO_AGAFAY.licenseName}` },
];

export function InteractiveHero() {
  const { dict } = useI18n();

  function choose(id: string) {
    window.dispatchEvent(new CustomEvent("wpm-apply-preset", { detail: id }));
    const el = document.getElementById("simulator");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="relative">
      <div className="relative min-h-[78vh] overflow-hidden bg-black">
        <Image
          src={PATHS[0].image}
          alt="Koutoubia Mosque in the Marrakesh medina"
          title="Koutoubia Mosque, Marrakesh medina"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />

        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-5 pb-28 pt-16 lg:pb-32">
          <p className="kicker text-saffron-soft">{dict.home.heroKicker}</p>
          <h1 className="mt-4 max-w-3xl font-display text-[3.1rem] font-medium leading-[0.95] text-white sm:text-7xl">
            {dict.home.title}
          </h1>
          <p className="mt-4 max-w-xl font-display text-2xl italic text-white/80 sm:text-[1.85rem]">{dict.home.tagline}</p>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">{dict.home.heroLede}</p>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm">
            <a
              href="#simulator"
              className="inline-flex items-center gap-2 border border-white/30 bg-white px-5 py-2.5 font-semibold text-ink transition hover:bg-cream"
            >
              {dict.home.orBudget}
            </a>
            <a href="#tools" className="inline-flex items-center gap-1.5 font-medium text-white/80 hover:text-white">
              {dict.home.jumpTools} <ArrowDownRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-6 text-[11px] text-white/50">Koutoubia Mosque · {PATHS[0].credit}</p>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-5 pb-2 lg:-mt-20">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">{dict.home.pickWeekend}</p>
        <div className="grid gap-px bg-sand-deep sm:grid-cols-3">
          {PATHS.map((p, i) => {
            const copy = dict.home.paths[p.id];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => choose(p.id)}
                className="group relative overflow-hidden bg-black text-left"
              >
                <span className="relative block aspect-[16/11]">
                  <Image
                    src={p.image}
                    alt={`${copy.title} wedding venue in Marrakesh — ${copy.blurb}`}
                    title={`${copy.title} Marrakesh wedding ${copy.kicker}`}
                    fill
                    sizes="400px"
                    className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/25" />
                  <span className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-saffron-soft">
                    0{i + 1} · {copy.kicker}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <span className="font-display text-2xl font-medium leading-tight">{copy.title}</span>
                    <span className="mt-1 block text-[13px] text-white/70">{copy.blurb}</span>
                    <span className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-saffron-soft">
                      {copy.guests} · {dict.home.startModel}
                    </span>
                    <span className="mt-1 block text-[10px] normal-case tracking-normal text-white/55">{p.credit}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
