import { Check } from "lucide-react";
import { Container } from "@/components/marketing/Container";
import { Section } from "@/components/marketing/primitives/Section";
import { SectionHeading } from "@/components/marketing/primitives/SectionHeading";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import {
  Faq,
  faqItemsToSchema,
  type FaqItem,
} from "@/components/marketing/sections/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "HeyOtis has no fixed packages - every plan is scoped to your brand. We meter by tracked brands, campaigns, monthly AI responses, competitors and seats.",
  path: "/pricing",
});

/** A dimension we meter. Volume levers only - no capability is withheld. */
type Lever = {
  label: string;
  means: string;
  moves: string;
};

const LEVERS: Lever[] = [
  {
    label: "Tracked brands",
    means:
      "Each brand is its own workspace, with its own campaigns, competitor set and reporting.",
    moves: "How many brands - or distinct markets - you need watched separately.",
  },
  {
    label: "Campaigns",
    means:
      "A campaign is a themed set of prompts we run on a schedule - one per product line, market or buying question.",
    moves: "How many of those themes you want tracked apart from each other.",
  },
  {
    label: "AI responses per month",
    means:
      "One prompt sent to one engine, with its answer captured and analyzed. Run a prompt across every engine we monitor and each engine counts once.",
    moves:
      "How many prompts your campaigns carry, the engines they run on, and how often they run.",
  },
  {
    label: "Competitors benchmarked",
    means:
      "The rivals we score beside you on Share of Voice, rank and citations.",
    moves: "How crowded your category is, and how many rivals you care about.",
  },
  {
    label: "Team seats",
    means: "The people with access to your workspace.",
    moves: "Team size, and whether clients or stakeholders need their own view.",
  },
];

/** Capabilities every plan gets, regardless of scope. */
const ALWAYS_INCLUDED: string[] = [
  "ChatGPT, Claude, Gemini, Perplexity & AI Overviews",
  "Share of Voice & rankings",
  "Citations analysis",
  "Competitive benchmarking",
  "GA4 AI referral traffic",
  "Strategy Engine",
];

const FAQS: FaqItem[] = [
  {
    q: "How is HeyOtis pricing structured?",
    a: "There are no fixed packages. Every plan gets the whole product - all the engines we monitor, Share of Voice, citations, benchmarking and the Strategy Engine - and we price on volume instead: tracked brands, campaigns, monthly AI responses, competitors benchmarked and team seats. Book a chat and we'll scope those five numbers to your category and goals.",
  },
  {
    q: "Is there a free trial or self-serve sign-up?",
    a: "No. HeyOtis is demo-led rather than self-serve. We book a short call, run your brand against ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews, walk you through a sample report, and then tailor a plan - so campaigns reflect your real competitors and category from day one.",
  },
  {
    q: "What counts as an AI response?",
    a: "An AI response is a single prompt sent to one AI engine, with its answer captured and analyzed. The same prompt run across every engine we monitor counts once per engine. So your monthly volume comes down to three things: how many prompts your campaigns carry, how many engines you track them on, and how often they run.",
  },
  {
    q: "Can agencies manage multiple brands?",
    a: "Yes. HeyOtis is multi-tenant - Organization → Brand → Campaign - so you can run several brands from one account, each with its own campaigns and competitor set. Tracked brands and seats are two of the levers we scope, so a portfolio is just a larger scope rather than a different product. For agencies specifically we have a dedicated track with white-label reporting - talk to us.",
  },
  {
    q: "Can I change my scope as I grow?",
    a: "Yes. Nothing is locked to a package, so there's no upgrade step to negotiate - talk to us and we'll adjust the levers that changed, whether that's tracked brands, prompt volume, monthly AI responses, competitors or seats.",
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
              className="display-hero mt-5 text-balance"
              style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
            >
              No packages. A plan{" "}
              <span className="text-accent">scoped to your brand</span>
            </h1>
            <p
              className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
              data-speakable
            >
              Every brand competes in a different category, against different
              rivals, on different questions - so HeyOtis isn&apos;t sold in
              fixed packages. Every plan gets the whole product; what varies is
              how much of it you need. Onboarding is demo-led rather than
              self-serve, so we size that with you on a short call. Here&apos;s
              what we meter.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BookCta label="Talk to us" variant="salmon" nudge withArrow />
              <span className="text-sm text-muted-foreground">
                Demo-led onboarding · no credit card
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* What we scope by */}
      <Section surface="cream" className="pt-4 md:pt-6" id="plans">
        <SectionHeading
          eyebrow="How pricing works"
          title="What we scope by"
          sub="Every plan gets the whole product - nothing is locked behind a package. What varies is how much of it you need, so we price on volume rather than features. These are the five numbers we agree on the call."
          className="max-w-2xl"
        />

        {/* The site's card grid (as in MaturityLevels / EvidenceCards) rather
            than a bespoke layout, so the section matches the rest of the site. */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LEVERS.map((lever, i) => (
            <Reveal key={lever.label} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
                  {lever.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {lever.means}
                </p>
                <div className="mt-4 border-t border-border pt-4">
                  <span className="label-mono block text-[0.6rem] text-muted-foreground">
                    What moves it
                  </span>
                  <p className="mt-1.5 text-sm leading-snug text-foreground/80">
                    {lever.moves}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Full width rather than a sixth cell: as a grid cell its six items
            made it far taller than the lever cards, stretching that row and
            leaving holes in the two beside it. */}
        <Reveal delay={LEVERS.length * 0.06}>
          <div className="mt-5 rounded-2xl border border-brand/25 bg-brand-soft/40 p-6 sm:p-7">
            <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
              In every plan
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Whatever the scope, none of this is metered or held back.
            </p>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {ALWAYS_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <Check
                    className="mt-0.5 size-3.5 shrink-0 text-accent"
                    strokeWidth={2.5}
                  />
                  <span className="leading-snug text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-8">
          <BookCta label="Talk to us" withArrow />
        </div>
      </Section>

      {/* Managed */}
      <Section surface="cream" id="managed" className="py-14 md:py-20">
        <SectionHeading
          eyebrow="Pricing"
          title="Managed"
          sub="Prefer strategist-led? We run the loop with you - campaigns, priorities and reviews handled by a HeyOtis strategist, so the platform's recommendations turn into work that gets done without you having to run the process yourself."
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
        sub="Book a 20-minute walkthrough. We'll run your brand against ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews, show you the gaps, and scope a plan around what we find."
      />
    </>
  );
}
