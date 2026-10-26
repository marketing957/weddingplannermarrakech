import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-4xl font-semibold text-ink">Privacy</h1>
      <p className="mt-4 leading-relaxed text-ink-soft">
        We collect the email and name you give us, the wedding details you save, and basic session data so
        the simulator and your plan stay in sync. We do not sell lists. We do not take commission from
        vendors. You can ask us to delete your account and we will remove planning data within sixty days.
        Authentication is handled by Supabase (email magic link, password, or Google if you choose it).
      </p>
    </div>
  );
}
