import { Fragment } from "react";
import { Check, Minus } from "lucide-react";
import { Container } from "@/components/marketing/Container";
import { Section } from "@/components/marketing/primitives/Section";
import { SectionHeading } from "@/components/marketing/primitives/SectionHeading";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import {
  Faq,
  faqItemsToSchema,
  type FaqItem,
} from "@/components/marketing/sections/Faq";
import { Card } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "HeyOtis pricing scales across four tiers, from $150/mo - by tracked brands, campaigns, AI responses, competitors and seats. Book a demo for a scoped quote.",
  path: "/pricing",
});

type Tier = {
  name: string;
  who: string;
  priceLabel: string;
  priceSub: string;
  features: string[];
  recommended?: boolean;
  ctaVariant: "primary" | "secondary" | "lavender";
};

const TIERS: Tier[] = [
  {
    name: "Basic",
    who: "For brands taking their first look at AI search visibility.",
    priceLabel: "From $150",
    priceSub: "per month · scoped to your brand",
    features: [
      "1 tracked brand",
      "3 campaigns",
      "Up to 3 active prompts per campaign",
      "500 AI responses / month",
      "Up to 3 competitors benchmarked",
      "ChatGPT, Claude, Gemini, Perplexity & Google AI Overviews",
      "2 team seats",
    ],
    ctaVariant: "secondary",
  },
  {
    name: "Plus",
    who: "For growing teams defending share of voice.",
    priceLabel: "From $625",
    priceSub: "per month · scoped to your volume",
    features: [
      "Up to 3 tracked brands",
      "5 campaigns",
      "Up to 10 active prompts per campaign",
      "2,500 AI responses / month",
      "Up to 6 competitors benchmarked",
      "ChatGPT, Claude, Gemini, Perplexity & Google AI Overviews",
      "5 team seats",
      "GA4 AI referral traffic",
    ],
    ctaVariant: "secondary",
  },
  {
    name: "Premium",
    who: "For brands competing hard across categories.",
    priceLabel: "From $2,200",
    priceSub: "per month · scoped to your portfolio",
    features: [
      "Up to 10 tracked brands",
      "20 campaigns",
      "Up to 25 active prompts per campaign",
      "10,000 AI responses / month",
      "Up to 12 competitors benchmarked",
      "ChatGPT, Claude, Gemini, Perplexity & Google AI Overviews",
      "10 team seats",
      "GA4 AI referral traffic",
      "Strategy Engine access",
    ],
    recommended: true,
    ctaVariant: "lavender",
  },
  {
    name: "Enterprise",
    who: "For agencies and multi-brand portfolios.",
    priceLabel: "Let's talk",
    priceSub: "Tailored to your scope & governance",
    features: [
      "25 tracked brands",
      "250 campaigns",
      "Custom active prompts per campaign",
      "50,000 AI responses / month",
      "Custom competitor sets",
      "ChatGPT, Claude, Gemini, Perplexity & Google AI Overviews",
      "100 seats with SSO",
      "GA4 AI referral traffic",
      "Strategy Engine access",
      "Dedicated onboarding & support",
    ],
    ctaVariant: "secondary",
  },
];

function TierCard({ tier }: { tier: Tier }) {
  const body = (
    <div className="flex flex-1 flex-col p-6 sm:p-7">
      {/* Reserved badge row on every card so the four plan names stay aligned;
          only the recommended tier fills it. */}
      <div className="mb-3 flex min-h-[1.5rem] items-center">
        {tier.recommended ? (
          <span className="label-mono inline-flex items-center rounded-full bg-periwinkle px-2.5 py-1 text-[0.625rem] leading-none tracking-[0.12em] text-foreground">
            Most popular
          </span>
        ) : null}
      </div>
      <h3
        className="font-display text-2xl text-foreground"
        style={{ fontStretch: "85%", letterSpacing: "-0.01em" }}
      >
        {tier.name}
      </h3>

      <p className="mt-3 min-h-[2.75rem] text-sm leading-relaxed text-muted-foreground">
        {tier.who}
      </p>

      <div className="mt-5 border-t border-border pt-5">
        <div
          className="font-display text-2xl text-foreground"
          style={{ fontStretch: "85%", letterSpacing: "-0.01em" }}
        >
          {tier.priceLabel}
        </div>
        <div className="mt-1 min-h-[2rem] text-xs leading-relaxed text-muted-foreground">
          {tier.priceSub}
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-3.5">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm">
            <span className="mt-px flex size-[1.125rem] shrink-0 items-center justify-center rounded-full bg-periwinkle/20">
              <Check className="size-3 text-foreground" strokeWidth={2.5} />
            </span>
            <span className="leading-snug text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <BookCta
          label="Talk to us"
          variant={tier.ctaVariant}
          size="default"
          withArrow
          className="w-full justify-center"
        />
      </div>
    </div>
  );

  if (tier.recommended) {
    return (
      <CardSpotlight className="h-full ring-2 ring-periwinkle/60 shadow-lg shadow-foreground/[0.06]">
        {body}
      </CardSpotlight>
    );
  }

  return <Card className="flex h-full flex-col">{body}</Card>;
}

type Cell = boolean | string;

type CompareRow = {
  label: string;
  basic: Cell;
  plus: Cell;
  premium: Cell;
  enterprise: Cell;
};

const COMPARE_GROUPS: { heading: string; rows: CompareRow[] }[] = [
  {
    heading: "Limits",
    rows: [
      {
        label: "Tracked brands",
        basic: "1",
        plus: "3",
        premium: "10",
        enterprise: "25",
      },
      {
        label: "Campaigns",
        basic: "3",
        plus: "5",
        premium: "20",
        enterprise: "250",
      },
      {
        label: "Active prompts per campaign",
        basic: "3",
        plus: "10",
        premium: "25",
        enterprise: "Custom",
      },
      {
        label: "AI responses / month",
        basic: "500",
        plus: "2,500",
        premium: "10,000",
        enterprise: "50,000",
      },
      {
        label: "Competitor set size",
        basic: "3",
        plus: "6",
        premium: "12",
        enterprise: "Custom",
      },
      {
        label: "Team seats",
        basic: "2",
        plus: "5",
        premium: "10",
        enterprise: "100 + SSO",
      },
    ],
  },
  {
    heading: "Capabilities",
    rows: [
      {
        label: "Monitored AI engines",
        basic: "All 6",
        plus: "All 6",
        premium: "All 6",
        enterprise: "All 6",
      },
      {
        label: "Share of Voice & rankings",
        basic: true,
        plus: true,
        premium: true,
        enterprise: true,
      },
      {
        label: "Citations analysis",
        basic: true,
        plus: true,
        premium: true,
        enterprise: true,
      },
      {
        label: "Competitive benchmarking",
        basic: true,
        plus: true,
        premium: true,
        enterprise: true,
      },
      {
        label: "GA4 AI referral traffic",
        basic: false,
        plus: true,
        premium: true,
        enterprise: true,
      },
      {
        label: "Strategy Engine access",
        basic: false,
        plus: false,
        premium: true,
        enterprise: true,
      },
    ],
  },
  {
    heading: "Support",
    rows: [
      {
        label: "Onboarding",
        basic: "Guided",
        plus: "Guided",
        premium: "Hands-on",
        enterprise: "Dedicated",
      },
      {
        label: "Support",
        basic: "Standard",
        plus: "Standard",
        premium: "Priority",
        enterprise: "Priority + SLA",
      },
    ],
  },
];

const TIER_COLUMNS = ["Basic", "Plus", "Premium", "Enterprise"] as const;

function CompareCell({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span className="inline-flex">
        <Check className="size-4 text-periwinkle" role="img" aria-label="Included" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex">
        <Minus
          className="size-4 text-muted-foreground/40"
          role="img"
          aria-label="Not included"
        />
      </span>
    );
  }
  return <span className="text-sm text-foreground/80">{value}</span>;
}

const FAQS: FaqItem[] = [
  {
    q: "How is HeyOtis pricing structured?",
    a: "HeyOtis has four tiers - Basic, Plus, Premium and Enterprise - starting at $150/mo. Each plan is scoped to your number of tracked brands, campaigns, active prompts, monthly AI responses and competitor set size, all monitored across ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews. Prices are starting points; book a chat and we'll size a plan to your category and goals.",
  },
  {
    q: "Is there a free trial or self-serve sign-up?",
    a: "No. HeyOtis is demo-led rather than self-serve. We book a short call, run your brand against ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews, walk you through a sample report, and then tailor a plan - so campaigns reflect your real competitors and category from day one.",
  },
  {
    q: "What counts as an AI response?",
    a: "An AI response is a single prompt sent to one AI engine with its answer captured and analyzed. So one prompt run across ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews counts as five AI responses. Your monthly volume is driven by the number of active prompts, the engines you track, and how often campaigns run.",
  },
  {
    q: "Can agencies manage multiple brands?",
    a: "Yes. HeyOtis is multi-tenant - Organization → Brand → Campaign - so you can run several brands from one account. Plus and Premium cover small portfolios, while Enterprise scales to 25 tracked brands, 100 seats and SSO. For larger agency portfolios we have a dedicated Agencies track - talk to us.",
  },
  {
    q: "Can I change plans as I grow?",
    a: "Yes. You can move between tiers as your needs change - just talk to us and we'll adjust your tracked brands, prompt volume, AI response allowance, seats and engines to match.",
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Pricing", href: "/pricing" },
        ])}
      />
      <JsonLd data={faqPageSchema(faqItemsToSchema(FAQS))} />

      {/* Hero */}
      <section className="surface-cream relative overflow-hidden">
        <Container className="pt-28 pb-12 sm:pt-32 md:pb-16 lg:pt-36">
          <div className="max-w-3xl">
            <Eyebrow>Pricing</Eyebrow>
            <h1
              className="display-lg mt-5 text-balance"
              style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
            >
              Plans that scale with your AI visibility strategy
            </h1>
            <p
              className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
              data-speakable
            >
              Plans start at $150/mo and scale by tracked brands, campaigns,
              prompt volume and competitor sets across ChatGPT, Claude, Gemini,
              Perplexity and Google AI Overviews. There&apos;s no self-serve
              sign-up - onboarding is demo-led, so we scope each plan with you
              on a short call. Pick the tier that fits and we&apos;ll size the
              rest.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BookCta label="Talk to us" nudge withArrow />
              <span className="text-sm text-muted-foreground">
                Demo-led onboarding · no credit card
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Tier cards */}
      <Section surface="cream" className="pt-4 md:pt-6" id="plans">
        <SectionHeading
          eyebrow="Tiers"
          title="Four tiers, one tailored quote"
          sub="Every tier monitors ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews. The difference is scale - how many brands, prompts, AI responses and competitors you track, plus the depth of strategy and support."
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Prices are starting points and limits scale with your scope -
          we&apos;ll confirm the right plan and allowances for your brands on a
          quick call.
        </p>
      </Section>

      {/* Comparison table */}
      <Section surface="card">
        <SectionHeading
          eyebrow="Compare"
          title="What's included at each tier"
          sub="A side-by-side look at limits, capabilities and support across Basic, Plus, Premium and Enterprise."
          className="max-w-2xl"
        />
        <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-card">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="sticky left-0 z-20 w-[34%] border-r border-border/60 bg-card py-4 pl-6 text-sm font-medium text-muted-foreground">
                  Capability
                </TableHead>
                {TIER_COLUMNS.map((col) => {
                  const isFeatured = col === "Premium";
                  return (
                    <TableHead
                      key={col}
                      className={cn(
                        "py-4 text-center text-sm font-semibold text-foreground",
                        isFeatured && "bg-periwinkle/12",
                      )}
                    >
                      <span className="inline-flex flex-col items-center gap-1">
                        {col}
                        {isFeatured ? (
                          <span className="label-mono text-[0.6rem] text-periwinkle">
                            Most popular
                          </span>
                        ) : null}
                      </span>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPARE_GROUPS.map((group) => (
                <Fragment key={group.heading}>
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={5}
                      className="label-mono sticky left-0 bg-secondary/40 py-2.5 pl-6 text-[0.65rem] text-muted-foreground"
                    >
                      {group.heading}
                    </TableCell>
                  </TableRow>
                  {group.rows.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="sticky left-0 z-10 border-r border-border/60 bg-card py-3.5 pl-6 text-sm font-medium text-foreground">
                        {row.label}
                      </TableCell>
                      <TableCell className="text-center">
                        <CompareCell value={row.basic} />
                      </TableCell>
                      <TableCell className="text-center">
                        <CompareCell value={row.plus} />
                      </TableCell>
                      <TableCell className="bg-periwinkle/12 text-center">
                        <CompareCell value={row.premium} />
                      </TableCell>
                      <TableCell className="text-center">
                        <CompareCell value={row.enterprise} />
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-8">
          <BookCta label="Talk to us" variant="secondary" withArrow />
        </div>
      </Section>

      {/* Managed */}
      <Section surface="cream" id="managed" className="py-14 md:py-20">
        <SectionHeading
          eyebrow="Pricing"
          title="Managed"
          sub="Prefer strategist-led? We run the loop with you - campaigns, priorities and reviews handled by a HeyOtis strategist, so the platform's recommendations turn into shipped work without you having to run the process yourself."
          className="max-w-2xl"
        />
        <div className="mt-8">
          <BookCta label="Talk to us" withArrow />
        </div>
      </Section>

      {/* For Agencies */}
      <Section surface="card" id="agencies" className="py-14 md:py-20">
        <SectionHeading
          eyebrow="Pricing"
          title="For Agencies"
          sub="Multi-brand workspaces, white-label reporting and per-client campaigns - built for agencies running AI visibility across a whole portfolio of brands, not just one."
          className="max-w-2xl"
        />
        <div className="mt-8">
          <BookCta label="Talk to us about agencies" withArrow />
        </div>
      </Section>

      {/* FAQ */}
      <Section surface="cream">
        <Faq
          items={FAQS}
          eyebrow="Pricing FAQ"
          heading="Pricing questions, answered"
          sub="How HeyOtis is priced, what counts toward your usage, and how plans flex as you grow."
        />
      </Section>

      <CtaBand
        eyebrow="Get started"
        title={
          <>
            Let&apos;s size the right plan
            <br className="hidden sm:block" /> for your brand.
          </>
        }
        sub="Book a 20-minute walkthrough. We'll run your brand against ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews, show you the gaps, and recommend the tier that fits."
      />
    </>
  );
}
