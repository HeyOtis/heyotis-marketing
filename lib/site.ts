export const siteConfig = {
  name: "HeyOtis",
  shortName: "HeyOtis",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://heyotis.com",
  description:
    "HeyOtis helps brands understand and improve how AI assistants interpret, present and recommend them — then turns that intelligence into campaign-led strategy.",
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
    {
      href: "/platform",
      label: "Product",
      // Mega-menu. Any nav item with a `menu` renders a dropdown panel; the
      // panel is generic, so adding one to Resources/About is just more data.
      menu: {
        sections: [
          {
            heading: "Product",
            links: [
              {
                label: "Platform",
                href: "/platform",
                description:
                  "AI brand intelligence across every major assistant.",
              },
              {
                label: "Campaigns",
                href: "/campaigns",
                description:
                  "Campaign-led AI discovery, from objective to outcome.",
              },
              {
                label: "Scorecard",
                href: "/contact",
                description:
                  "See where your brand stands in AI recommendations.",
              },
            ],
          },
        ],
      },
    },
    {
      href: "/brand",
      label: "Use cases",
      menu: {
        sections: [
          {
            heading: "Use cases",
            links: [
              {
                label: "Brand",
                href: "/brand",
                description:
                  "Shape how AI understands, describes and presents your brand.",
              },
              {
                label: "Traffic",
                href: "/traffic",
                description:
                  "Connect AI discovery to visits, retail demand and revenue.",
              },
              {
                label: "E-commerce",
                href: "/e-commerce",
                description:
                  "Check whether your products make the AI shortlist.",
              },
              {
                label: "Agencies",
                href: "/agencies",
                description:
                  "Build campaign-led AI discovery programmes for clients.",
              },
            ],
          },
        ],
      },
    },
    {
      href: "/case-studies",
      label: "Resources",
      menu: {
        sections: [
          {
            heading: "Resources",
            links: [
              {
                label: "Case Studies",
                href: "/case-studies",
                description: "Proof that AI presence can be improved.",
              },
              {
                label: "Pricing",
                href: "/pricing",
                description:
                  "Plans that scale with your AI recommendation strategy.",
              },
            ],
          },
        ],
      },
    },
    { href: "/about", label: "About" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export type NavItem = (typeof siteConfig.nav)[number];
export type NavMenuLink = {
  label: string;
  href: string;
  description: string;
};
export type NavMenuSection = {
  heading: string;
  links: readonly NavMenuLink[];
};
