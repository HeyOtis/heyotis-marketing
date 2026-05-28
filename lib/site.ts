export const siteConfig = {
  name: "Heyotis",
  shortName: "Heyotis",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://heyotis.com",
  description:
    "Heyotis — placeholder marketing description. Update in lib/site.ts.",
  locale: "en-US",
  defaultOgImage: "/opengraph-image.png",
  twitterHandle: "@heyotis",
  contactEmail: "hello@heyotis.com",
  founders: ["Heyotis Team"],
  socials: {
    twitter: "https://twitter.com/heyotis",
    linkedin: "https://www.linkedin.com/company/heyotis",
    github: "https://github.com/heyotis",
  },
  nav: [
    { href: "/product", label: "Product" },
    { href: "/blog", label: "Resources" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/about", label: "About" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
