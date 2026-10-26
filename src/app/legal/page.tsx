import type { Metadata } from "next";
import { LocaleLink } from "@/i18n/LocaleLink";

export const metadata: Metadata = {
  title: "Legal requirements for a Marrakesh wedding",
  description:
    "Civil marriage vs. celebration-only, typical paperwork, and a realistic timeline if you marry in Morocco — from Wedding Planner Marrakesh.",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-12">
      <p className="kicker">Free tool</p>
      <h1 className="mt-3 font-display text-4xl font-medium italic text-ink sm:text-5xl">
        the paperwork
      </h1>
      <p className="mt-4 text-lg text-ink-soft">
        Most couples celebrating in Marrakesh are already married at home. If you want the Moroccan civil
        act as well, start the file early — it is slower than the party planning.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="border border-sand-deep bg-white p-5">
          <h2 className="font-display text-xl font-semibold text-ink">Celebration only</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            You host the weekend here and keep the legal marriage in your home country. No Moroccan civil
            file. Still confirm venue insurance, guest visas and that your officiant is ceremonial.
          </p>
        </div>
        <div className="border border-sand-deep bg-white p-5">
          <h2 className="font-display text-xl font-semibold text-ink">Civil marriage in Morocco</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            The commune (or your consulate, depending on nationality) records the marriage. Expect
            translations, legalisation, and an appointment that is not available next week.
          </p>
        </div>
      </div>

      <h2 className="mt-12 font-display text-2xl font-semibold text-ink">Typical documents</h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
        <li>Valid passports and recent passport photos</li>
        <li>Birth certificates, often less than six months old</li>
        <li>Certificate of no impediment / certificat de coutume from your consulate</li>
        <li>Proof of divorce or death if either of you was married before</li>
        <li>Sworn Arabic or French translations by a translator recognised in Morocco</li>
        <li>Legalisation or apostille on documents issued abroad</li>
      </ul>
      <p className="mt-4 text-sm text-muted">
        Exact lists change by nationality and by commune. Ask your planner to confirm with the office that
        will actually stamp the file — not a blog post from 2019.
      </p>

      <h2 className="mt-12 font-display text-2xl font-semibold text-ink">Timeline</h2>
      <ol className="mt-4 space-y-3 text-sm text-ink-soft">
        <li>
          <strong className="text-ink">4–6 months out.</strong> Request the certificat de coutume. Some
          consulates need an in-person appointment.
        </li>
        <li>
          <strong className="text-ink">3 months out.</strong> Translate and legalise. Keep spare certified
          copies.
        </li>
        <li>
          <strong className="text-ink">Wedding week.</strong> Civil slot is often a weekday morning, separate
          from the riad ceremony.
        </li>
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <LocaleLink href="/timeline" className="bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-teal">
          See the 12-month plan
        </LocaleLink>
        <LocaleLink href="/contact" className="border border-sand-deep px-5 py-2.5 text-sm font-semibold text-ink hover:border-ink">
          Ask a question
        </LocaleLink>
      </div>
    </div>
  );
}
