export const siteConfig = {
  name: "HeyOtis",
  shortName: "HeyOtis",
  // Canonical marketing URL. NOTE: the platform app lives at heyotis.ai —
  // confirm which domain is canonical for marketing. Overridable via env.
  // Trailing slash stripped at the source so every consumer (schema @id
  // builders, OG URLs, sitemap) concatenates against a clean origin.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://heyotis.com").replace(
    /\/$/,
    "",
  ),
  // Product app (login / signup) destination.
  appUrl: "https://app.heyotis.ai",
  // Primary CTA destination ("Book a chat") — HubSpot Meetings scheduling page.
  // Booking creates/updates a HubSpot contact and books the rep's connected
  // Google Calendar (with a Google Meet link). Env-overridable so the rep or a
  // round-robin/team link can change without a code change.
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL ??
    "https://meetings-eu1.hubspot.com/george-bowes",
  description:
    "See how ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews recommend your brand — and what to do about it. HeyOtis measures your AI recommendation share, citations and competitive rank.",
  locale: "en-US",
  defaultOgImage: "/api/og",
  twitterHandle: "@heyotis",
  contactEmail: "hello@heyotis.com",
  founders: ["HeyOtis Team"],
  socials: {
    twitter: "https://twitter.com/heyotis",
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

// Primary nav — ordered to trace the loop (Measure → Diagnose → Act → Prove)
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
        heading: "Measure",
        links: [
          { label: "Visibility & Share of Voice", href: "/platform#visibility" },
          { label: "Answer Sentiment", href: "/platform#sentiment" },
          { label: "Fanout Queries", href: "/platform#fanouts" },
          { label: "Citations & Sources", href: "/platform#citations" },
        ],
      },
      {
        heading: "Strategy",
        links: [
          { label: "The Strategy Engine", href: "/strategy-engine" },
          { label: "Evidence & Findings", href: "/strategy-engine#evidence" },
          {
            label: "Prioritised Recommendations",
            href: "/strategy-engine#plan",
          },
        ],
      },
      {
        heading: "Act",
        links: [{ label: "Implementation Tracking", href: "/platform#act" }],
      },
      {
        heading: "Attribute",
        links: [
          { label: "Web & AI Bot Analytics", href: "/platform#attribute" },
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
          { label: "Guides & AEO Playbook", href: "/guides" },
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
