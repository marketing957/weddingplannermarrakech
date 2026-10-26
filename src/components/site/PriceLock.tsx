"use client";

import { Lock } from "lucide-react";
import { localePath } from "@/i18n";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useI18n } from "@/i18n/LocaleProvider";

export function PriceLock({
  revealed,
  href,
  children,
}: {
  revealed: boolean;
  href: string;
  children: React.ReactNode;
}) {
  const { locale, dict } = useI18n();
  if (revealed) return <>{children}</>;
  return (
    <LocaleLink
      href={`/login?returnTo=${encodeURIComponent(localePath(locale, href))}`}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink underline decoration-sand-deep underline-offset-4 hover:decoration-ink"
    >
      <Lock className="h-3.5 w-3.5" />
      {dict.auth.loginToSee}
    </LocaleLink>
  );
}
