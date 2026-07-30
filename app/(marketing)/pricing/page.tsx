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
  "ChatGPT, Claude, Gemini, Perplexity & Google AI Overviews",
  "Share of Voice & competitive rankings",
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
          sub="Every plan gets the whole product. What varies is how much of it you need - so we price on volume, not features. These are the five numbers we agree on the call."
          className="max-w-2xl"
        />

        {/* A spec schedule, not a data table: the cells are prose, so they get
            hairline-ruled rows on the open canvas rather than card chrome. */}
        <div className="mt-12 border-t border-border">
          {/* Column headings only where there are real columns to head. */}
          <div className="hidden grid-cols-12 gap-8 border-b border-border pb-3 lg:grid">
            <div className="col-span-4 label-mono text-[0.65rem] text-muted-foreground">
              What we meter
            </div>
            <div className="col-span-5 label-mono text-[0.65rem] text-muted-foreground">
              What it means
            </div>
            <div className="col-span-3 label-mono text-[0.65rem] text-muted-foreground">
              What moves it
            </div>
          </div>

          <ul className="divide-y divide-border">
            {LEVERS.map((lever, i) => (
              <Reveal as="li" key={lever.label} delay={i * 0.05}>
                <div className="grid grid-cols-1 gap-x-8 gap-y-3 py-7 lg:grid-cols-12">
                  <h3
                    className="col-span-4 font-display text-lg text-foreground"
                    style={{ fontStretch: "85%", letterSpacing: "-0.01em" }}
                  >
                    {lever.label}
                  </h3>
                  <p className="col-span-5 text-sm leading-relaxed text-foreground/80">
                    {lever.means}
                  </p>
                  {/* Set as a margin annotation - own rule, mono label - so it
                      reads as a note on the row, not a third value. */}
                  <div className="col-span-3 border-l-2 border-periwinkle/40 pl-4 lg:border-l lg:border-border">
                    <span className="label-mono text-[0.6rem] text-periwinkle-ink lg:hidden">
                      What moves it
                    </span>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground lg:mt-0">
                      {lever.moves}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* The visual inverse of the ruled rows above: what varies is open,
            what's fixed is enclosed. A fourth column would have implied
            another axis to compare. */}
        <div className="mt-14 rounded-2xl border border-border bg-card p-7 sm:p-9">
          <h3 className="label-mono text-[0.65rem] text-accent">
            <span aria-hidden className="opacity-60">
              /
            </span>{" "}
            In every plan, whatever the scope
          </h3>
          <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {ALWAYS_INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex size-[1.125rem] shrink-0 items-center justify-center rounded-full bg-periwinkle/20">
                  <Check className="size-3 text-foreground" strokeWidth={2.5} />
                </span>
                <span className="leading-snug text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Nothing is locked behind a package - there&apos;s no feature to
            upgrade to later. We set these numbers to match your category, and
            move them when your scope changes.
          </p>
          <BookCta
            label="Talk to us"
            variant="secondary"
            withArrow
            className="shrink-0"
          />
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
        sub="Book a 20-minute walkthrough. We'll run your brand against ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews, show you the gaps, and scope a plan around what we find."
      />
    </>
  );
}
