import { LocaleLink } from "@/i18n/LocaleLink";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <p className="kicker">404</p>
      <h1 className="mt-3 font-display text-4xl font-medium text-ink">We could not find that page.</h1>
      <p className="mt-3 text-ink-soft">It may have moved, or the profile you are looking for is not published yet.</p>
      <LocaleLink
        href="/"
        className="mt-8 inline-block bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-teal"
      >
        Back to the simulator
      </LocaleLink>
    </div>
  );
}
