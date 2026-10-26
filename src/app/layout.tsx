import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Sidebar } from "@/components/site/Sidebar";
import { MobileBar } from "@/components/site/MobileBar";
import { AssistantBot } from "@/components/site/AssistantBot";
import { PartnerBar } from "@/components/site/PartnerBar";
import { JsonLd } from "@/components/site/JsonLd";
import { organizationLd, pageAlternates, SITE_NAME, siteUrl, websiteLd } from "@/lib/seo";
import { getDictionary } from "@/i18n";
import { getRequestLocale } from "@/i18n/request";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { CurrencyProvider } from "@/components/site/CurrencyProvider";
import { getRequestCurrency } from "@/lib/currency-server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const url = siteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(url),
    title: {
      default: dict.meta.title,
      template: "%s · Wedding Planner Marrakesh",
    },
    description: dict.meta.description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Wedding planning",
    keywords:
      locale === "fr"
        ? [
            "Wedding Planner Marrakesh",
            "wedding planner à Marrakesh",
            "organisateur de mariage Marrakesh",
            "lieux de mariage Marrakesh",
            "mariage destination Maroc",
          ]
        : [
            "Wedding Planner Marrakesh",
            "wedding planner in Marrakesh",
            "Marrakesh wedding planner",
            "Marrakesh wedding venues",
            "destination wedding Morocco",
          ],
    alternates: pageAlternates(locale, "/"),
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      url: locale === "fr" ? `${url}/fr` : url,
      siteName: SITE_NAME,
      title: dict.meta.title,
      description: dict.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: "Wedding Planner Marrakesh",
      description: dict.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "geo.region": "MA-07",
      "geo.placename": "Marrakesh",
    },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full bg-cream">
        <Suspense fallback={<ShellFallback />}>
          <LocalizedShell>{children}</LocalizedShell>
        </Suspense>
      </body>
    </html>
  );
}

async function LocalizedShell({ children }: { children: ReactNode }) {
  const [locale, currency] = await Promise.all([getRequestLocale(), getRequestCurrency()]);
  return (
    <LocaleProvider locale={locale}>
      <CurrencyProvider currency={currency}>
        <JsonLd data={organizationLd()} />
        <JsonLd data={websiteLd(locale)} />
        <PartnerBar />
        <div className="flex min-h-full">
          <div className="sticky top-16 hidden h-[calc(100vh-64px)] w-[240px] shrink-0 lg:block">
            <Sidebar className="h-full" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <MobileBar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </div>
        <AssistantBot />
      </CurrencyProvider>
    </LocaleProvider>
  );
}

function ShellFallback() {
  return <div className="min-h-screen bg-cream" />;
}
