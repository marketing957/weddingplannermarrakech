import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Wedding Planner Marrakesh",
  description: "Ask about planners, venues or a correction. Wedding Planner Marrakesh replies within 24 hours.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-4xl font-semibold text-ink">Contact us</h1>
      <p className="mt-3 text-ink-soft">We respond within 24 hours.</p>
      <p className="mt-6 text-ink-soft">
        Planner recommendations, venue questions, or a correction: write to{" "}
        <a className="font-semibold text-teal" href="mailto:hello@weddingplannermarrakech.local">
          hello@weddingplannermarrakech.local
        </a>{" "}
        or use the WhatsApp button.
      </p>
    </div>
  );
}
