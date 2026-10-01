import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrafficBeacon } from "@/components/traffic-beacon";
import { getLocale, htmlLang } from "@/lib/i18n";
import { messages } from "@/lib/messages";
import { siteName, siteUrl } from "@/lib/site";
import "./globals.css";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const copy = messages[locale];
  const title = `${siteName} — ${copy.metaTitle}`;
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: title,
      template: `%s — ${siteName}`,
    },
    description: copy.siteDescription,
    applicationName: siteName,
    openGraph: {
      siteName,
      locale: locale === "sw" ? "sw_TZ" : "en_TZ",
      type: "website",
      title,
      description: copy.siteDescription,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: copy.siteDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#1c5c44",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const copy = messages[locale];
  return (
    <html lang={htmlLang(locale)} className={cn(fraunces.variable, sourceSans.variable)}>
      <body className="flex min-h-screen flex-col antialiased">
        <a href="#content" className="skip-link">
          {copy.skip}
        </a>
        <TrafficBeacon />
        <SiteHeader locale={locale} />
        <main id="content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
