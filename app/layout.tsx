import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@/components/analytics/Analytics";
import { CONSENT_DEFAULTS, GA_ID } from "@/lib/analytics";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  // Only used for small eyebrow/labels - keep it off the critical font path.
  preload: false,
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: siteConfig.founders.map((name) => ({ name })),
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: siteConfig.defaultOgImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
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
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ed" },
    { media: "(prefers-color-scheme: dark)", color: "#221f28" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Google Consent Mode v2 defaults (all denied in the EU/UK/CH/NZ).
            Must execute before gtag.js loads, so it uses beforeInteractive -
            which the App Router requires to be in the root layout. Keep it
            above <Analytics />, which loads GA4 afterInteractive. */}
        {GA_ID ? (
          <Script
            id="consent-defaults"
            strategy="beforeInteractive"
            // Static string from lib/analytics.ts; no user input interpolated.
            dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS }}
          />
        ) : null}
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
