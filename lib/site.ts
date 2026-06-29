export const siteConfig = {
  name: "HeyOtis",
  shortName: "HeyOtis",
  // Canonical marketing URL. NOTE: the platform app lives at heyotis.ai —
  // confirm which domain is canonical for marketing. Overridable via env.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://heyotis.com",
  // Product app (login / signup) destination.
  appUrl: "https://heyotis.ai",
  // Primary CTA destination ("Book a chat"). TODO: replace with the real
  // Cal.com / Calendly scheduling link.
  bookingUrl: "https://cal.com/heyotis",
  description:
    "See how ChatGPT, Gemini and Perplexity recommend your brand — and what to do about it. HeyOtis measures your AI Share of Voice, citations and competitive rank.",
  locale: "en-US",
  defaultOgImage: "/opengraph-image.png",
  twitterHandle: "@heyotis",
  contactEmail: "hello@heyotis.com",
  founders: ["HeyOtis Team"],
  socials: {
    twitter: "https://twitter.com/heyotis",
    linkedin: "https://www.linkedin.com/company/heyotis",
    github: "https://github.com/heyotis",
  },
  nav: [
    { href: "/features", label: "Product" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Resources" },
    { href: "/about", label: "About" },
  ],
  footerNav: [
    {
      heading: "Product",
      links: [
        { label: "Overview", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Book a demo", href: "/contact" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
export type NavItem = (typeof siteConfig.nav)[number];
export type FooterGroup = (typeof siteConfig.footerNav)[number];
export type FooterLink = FooterGroup["links"][number];
