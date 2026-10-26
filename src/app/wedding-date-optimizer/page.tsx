import type { Metadata } from "next";
import { LocaleLink } from "@/i18n/LocaleLink";
import { getMonths } from "@/lib/data";

export const metadata: Metadata = {
  title: "Best time for a Marrakesh wedding",
  description:
    "Month-by-month weather, pricing and availability so you and your wedding planner in Marrakesh pick the right season.",
  alternates: { canonical: "/wedding-date-optimizer" },
};

export default async function DateOptimizerPage() {
  const months = await getMonths();
  const best = [...months].sort((a, b) => Number(b.score) - Number(a.score))[0];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-10 pt-12">
      <p className="kicker">Free tool</p>
      <h1 className="mt-3 font-display text-4xl font-medium italic text-ink sm:text-5xl">
        timing is everything
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        Weather, pricing, and availability data for every month. Find the best time for your Marrakesh
        wedding.
      </p>
      {best ? (
        <p className="mt-4 text-sm font-medium text-ink">
          Best month on current data: {best.name} · score {Number(best.score).toFixed(1)}
        </p>
      ) : null}

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((m) => (
          <div key={m.month} className="border border-sand-deep bg-white p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl font-semibold text-ink">{m.name}</h2>
              <span className="text-sm font-semibold text-saffron">{Number(m.score).toFixed(1)}</span>
            </div>
            <p className="mt-1 text-sm font-medium text-ink-soft">{m.verdict}</p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted">
              <div>
                Day {m.temp_high}°C
              </div>
              <div>Night {m.temp_low}°C</div>
              <div>{m.rain_days} rain days</div>
              <div>Price index {Number(m.price_index).toFixed(2)}</div>
            </dl>
            <p className="mt-3 text-xs text-ink-soft">{m.note}</p>
            <p className="mt-2 text-[11px] uppercase tracking-wider text-muted">
              {m.availability === "low" ? "Book early" : m.availability === "medium" ? "Filling up" : "Wide open"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <div className="border border-sand-deep bg-sand p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Marrakesh wedding seasons</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Spring (March–May) and autumn (September–November) are peak: 18–28°C, low rain, the city in its
            best light. Book venues 12+ months ahead for those weekends.
          </p>
        </div>
        <div className="border border-sand-deep bg-sand p-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Understanding the heat</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            July and August regularly reach 38–42°C. Evening ceremonies after 6pm are possible if guests have
            air-conditioning. Some venues discount 25–35% in high summer.
          </p>
        </div>
      </div>
      <LocaleLink
        href="/#simulator"
        className="mt-10 inline-block bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-teal"
      >
        Feed this into the simulator
      </LocaleLink>
    </div>
  );
}
