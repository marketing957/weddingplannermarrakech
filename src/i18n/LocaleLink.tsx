"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { localePath } from "@/i18n";
import { useI18n } from "@/i18n/LocaleProvider";

type Props = ComponentProps<typeof Link>;

export function LocaleLink({ href, ...props }: Props) {
  const { locale } = useI18n();
  const resolved = typeof href === "string" ? localePath(locale, href) : href;
  return <Link href={resolved} {...props} />;
}
