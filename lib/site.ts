export const siteConfig = {
  name: "HeyOtis",
  shortName: "HeyOtis",
  // Canonical marketing URL. heyotis.ai is the only domain we own - the apex
  // serves marketing, the platform app sits on the app. subdomain. (heyotis.com
  // is owned by someone else; never point canonicals or email at it.)
  // Overridable via env. Trailing slash stripped at the source so every
  // consumer (schema @id builders, OG URLs, sitemap) concatenates against a
  // clean origin.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://heyotis.ai").replace(
    /\/$/,
    "",
  ),
  // Product app (login / signup) destination.
  appUrl: "https://app.heyotis.ai",
  // Primary CTA destination ("Book a chat") - HubSpot Meetings scheduling page.
  // Booking creates/updates a HubSpot contact and books the rep's connected
  // Google Calendar (with a Google Meet link). Env-overridable so the rep or a
  // round-robin/team link can change without a code change.
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL ??
    "https://meetings-eu1.hubspot.com/george-bowes",
  description:
    "See how ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews recommend your brand - and what to do about it. HeyOtis measures your AI recommendation share, citations and competitive rank.",
  locale: "en-US",
  defaultOgImage: "/api/og",
  contactEmail: "hello@heyotis.ai",
  // Registered legal entity. Must stay in step with the platform's own policies
  // at app.heyotis.ai/privacy and /terms - if the entity, address or company
  // number changes, it changes in both places.
  legal: {
    entity: "HeyOtis Ltd",
    companyNumber: "16969753",
    address: ["124-128 City Road", "London", "England", "EC1V 2NX"],
    // Data-protection and legal enquiries go to support@, matching the
    // platform policies. General marketing enquiries use contactEmail above.
    privacyEmail: "support@heyotis.ai",
    // UK-established controller: UK GDPR applies, the ICO is the regulator.
    regulator: "Information Commissioner's Office (ICO)",
    regulatorUrl: "https://ico.org.uk/make-a-complaint/",
    appPrivacyUrl: "https://app.heyotis.ai/privacy",
    appTermsUrl: "https://app.heyotis.ai/terms",
    privacyUpdated: "2026-07-30",
    termsUpdated: "2026-07-30",
  },
  founders: ["HeyOtis Team"],
  socials: {
    linkedin: "https://www.linkedin.com/company/heyotis",
    github: "https://github.com/heyotis",
  },
  footerNav: [
    {
      heading: "Product",
      links: [
        { label: "Platform", href: "/platform" },
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
export type FooterGroup = (typeof siteConfig.footerNav)[number];
export type FooterLink = FooterGroup["links"][number];

// Primary nav - ordered to trace the loop (Measure → Diagnose → Act → Prove)
// inside the Platform dropdown, then Resources, then Pricing.
export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { heading: string; links: NavLink[] };
export type NavEntry =
  | { label: string; href: string } // plain link
  | { label: string; groups: NavGroup[]; footerLink?: NavLink }; // dropdown

export const NAV: NavEntry[] = [
  {
    label: "Platform",
    groups: [
      {
        heading: "Platform",
        links: [
          { label: "AEO Insights", href: "/platform#insights-surface" },
          { label: "AEO Analytics", href: "/platform#analytics-surface" },
          { label: "Strategy & Attribution", href: "/platform#strategy-surface" },
          { label: "Roadmap", href: "/platform#roadmap-surface" },
        ],
      },
      {
        heading: "Strategy",
        links: [
          { label: "The Strategy Engine", href: "/strategy" },
          { label: "The Loop, End to End", href: "/strategy#loop" },
          { label: "The Action Plan", href: "/strategy#plan" },
          { label: "Built on Evidence", href: "/strategy#evidence" },
        ],
      },
    ],
    footerLink: { label: "How the loop works →", href: "/platform" },
  },
  {
    label: "Resources",
    groups: [
      {
        heading: "Resources",
        links: [
          { label: "Free AI Visibility Report", href: "/report" },
          { label: "Case Studies", href: "/case-studies" },
          { label: "Blog", href: "/blog" },
          { label: "About HeyOtis", href: "/about" },
        ],
      },
    ],
  },
  {
    label: "Pricing",
    groups: [
      {
        heading: "Pricing",
        links: [
          {
            label: "Plans",
            href: "/pricing#plans",
            description: "Self-serve tiers",
          },
          {
            label: "Managed",
            href: "/pricing#managed",
            description: "Strategist-led",
          },
          {
            label: "For Agencies",
            href: "/pricing#agencies",
            description: "White-label & multi-brand",
          },
        ],
      },
    ],
  },
];
