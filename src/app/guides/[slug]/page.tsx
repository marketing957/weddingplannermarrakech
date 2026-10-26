import type { Metadata } from "next";
import { LocaleLink } from "@/i18n/LocaleLink";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock } from "lucide-react";
import { getGuideBySlug, getGuides } from "@/lib/data";

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.title,
    description: guide.excerpt,
    alternates: { canonical: `/guides/${slug}` },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 pb-10 pt-12">
      <LocaleLink href="/guides" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline">
        <ArrowLeft className="h-4 w-4" /> All guides
      </LocaleLink>
      <header className="mt-6">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="rounded-full bg-teal-soft px-2.5 py-0.5 font-semibold text-teal">{guide.category}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {guide.read_minutes} min read
          </span>
          <span>
            {new Date(guide.published_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </span>
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">{guide.title}</h1>
        <p className="mt-4 text-lg text-ink-soft">{guide.excerpt}</p>
      </header>
      <div className="prose mt-10">
        <Markdown remarkPlugins={[remarkGfm]}>{guide.body}</Markdown>
      </div>
      <div className="mt-12 rounded-2xl bg-teal p-6 text-cream">
        <p className="font-display text-xl font-semibold">Put a number on it</p>
        <p className="mt-1 text-sm text-teal-soft">
          The budget simulator turns guest count, season and venue type into a real estimate in two minutes.
        </p>
        <LocaleLink
          href="/#simulator"
          className="mt-4 inline-block rounded-full bg-saffron px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-saffron/90"
        >
          Open the simulator
        </LocaleLink>
      </div>
    </article>
  );
}
