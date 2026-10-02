import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/data/site";
import { dictionaries } from "@/i18n/dictionaries";
import LanguageProvider from "@/i18n/LanguageProvider";
import { audioAssets } from "@/data/assets";
import DeviceFlags from "@/components/experience/DeviceFlags";
import CustomCursor from "@/components/ui/CustomCursor";
import RouteTransition from "@/components/ui/RouteTransition";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: false, // only used for accent words — never block first paint on it
});

// optional audio: only files that really exist in /public/audio are offered
const audioFiles = Object.fromEntries(
  Object.entries(audioAssets).map(([name, url]) => [
    name,
    existsSync(path.join(process.cwd(), "public", url)),
  ]),
);

// Build-time metadata is Turkish (the default language). When the visitor
// switches language, i18n/language.ts rewrites <title>, description and the
// Open Graph / Twitter tags on the client, and `?lang=en` opens English.
const seo = dictionaries.tr.seo;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: seo.title, template: `%s — ${seo.projectSuffix}` },
  description: seo.description,
  applicationName: seo.siteName,
  alternates: {
    languages: { tr: "/", en: "/?lang=en", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    siteName: seo.siteName,
    url: "/",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060709",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${grotesk.variable} ${mono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <LanguageProvider />
        <DeviceFlags audioFiles={audioFiles} />
        {children}
        <RouteTransition />
        <CustomCursor />
      </body>
    </html>
  );
}
