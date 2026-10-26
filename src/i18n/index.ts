import { en, fr, type Dictionary } from "./dictionaries";

export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

export function getDictionary(locale: Locale): Dictionary {
  return locale === "fr" ? fr : en;
}

/** Build a locale-aware href. English is served at the root, French under /fr. */
export function localePath(locale: Locale, path: string): string {
  if (!path || path.startsWith("#") || path.startsWith("mailto:") || path.startsWith("http")) return path;

  let pathname = path;
  let rest = "";
  const hashAt = path.indexOf("#");
  if (hashAt >= 0) {
    rest = path.slice(hashAt);
    pathname = path.slice(0, hashAt);
  }
  const queryAt = pathname.indexOf("?");
  if (queryAt >= 0) {
    rest = pathname.slice(queryAt) + rest;
    pathname = pathname.slice(0, queryAt);
  }

  let clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (clean === "/fr" || clean.startsWith("/fr/")) {
    clean = clean === "/fr" ? "/" : clean.slice(3) || "/";
  }
  const prefixed =
    locale === "en" ? (clean === "/" ? "/" : clean) : clean === "/" ? "/fr" : `/fr${clean}`;
  return `${prefixed}${rest}`;
}

export function hreflangLanguages(path: string): Record<string, string> {
  return {
    en: localePath("en", path),
    fr: localePath("fr", path),
    "x-default": localePath("en", path),
  };
}

/** Replace {n}-style tokens. */
export function t(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export type { Dictionary };
