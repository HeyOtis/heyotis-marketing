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
          {
            label: "AI Visibility & Share of Voice",
            href: "/features#visibility",
          },
          { label: "Answer Sentiment", href: "/features#sentiment" },
          { label: "Citations & Sources", href: "/features#citations" },
          { label: "Competitor Head-to-Head", href: "/features#competitors" },
        ],
      },
      {
        heading: "Diagnose",
        links: [
          { label: "The Strategy Engine", href: "/strategy-engine" },
          { label: "Evidence & Findings", href: "/strategy-engine#evidence" },
        ],
      },
      {
        heading: "Act",
        links: [
          {
            label: "Prioritised Recommendations",
            href: "/strategy-engine#plan",
          },
          { label: "Campaigns", href: "/features#campaigns" },
        ],
      },
      {
        heading: "Prove",
        links: [
          {
            label: "Implementation Tracking",
            href: "/strategy-engine#verify",
          },
          { label: "AI Traffic & Attribution", href: "/features#traffic" },
        ],
      },
    ],
    footerLink: { label: "How the loop works →", href: "/#loop" },
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
