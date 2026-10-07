import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">We could not find that page.</h1>
      <p className="mt-3 text-ink-soft">It may have moved, or the profile you are looking for is not published yet.</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-cream hover:bg-teal-deep"
      >
        Back to the simulator
      </Link>
    </div>
  );
}
