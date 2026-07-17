import { Check } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/marketing/sections/Hero";
import { PlatformCard } from "@/components/marketing/sections/PlatformCard";
import { FindingsPills } from "@/components/marketing/sections/EvidenceCards";
import { FeatureCards } from "@/components/marketing/sections/FeatureCards";
import { LoopBento } from "@/components/marketing/visuals/LoopBento";
import { CompoundingBand } from "@/components/marketing/sections/CompoundingBand";
import { ReportBand } from "@/components/marketing/sections/ReportBand";
import { ProofHallensteins } from "@/components/marketing/sections/ProofHallensteins";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import { Faq, faqItemsToSchema, type FaqItem } from "@/components/marketing/sections/Faq";
import { Section } from "@/components/marketing/primitives/Section";
import { SectionHeading } from "@/components/marketing/primitives/SectionHeading";
import { AnswerReel } from "@/components/marketing/sections/AnswerReel";

export const metadata = buildMetadata({
  title: "See how AI recommends your brand",
  description:
    "HeyOtis measures how ChatGPT, Gemini, Perplexity and Claude recommend your brand, finds the moves that grow your share, watches the work land, and measures the lift. A closed loop — not another dashboard.",
  path: "/",
});

const HONESTY_CLAIMS: { lead: string; body: string }[] = [
  {
    lead: "The AI never does the maths.",
    body: "Every number you see is computed by deterministic code. The model writes the words; it never counts. It cannot invent a statistic, because it is never asked to produce one.",
  },
  {
    lead: "If we can't measure it, we won't suggest it.",
    body: "A recommendation we can't verify is just a polite opinion. Those get suppressed before they reach you.",
  },
  {
    lead: "Every claim has a receipt.",
    body: "Click any finding and see the evidence it came from, and the date it was true.",
  },
  {
    lead: "New detection ships dark.",
    body: "Every new pattern the engine learns to spot is reviewed by a human before a single brand sees it.",
  },
];

const FAQS: FaqItem[] = [
  {
    q: "What is HeyOtis?",
    a: "HeyOtis is an AI brand visibility platform. It measures how AI assistants like ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral recommend your brand — your Share of Voice, the citations they trust, and how you rank against competitors — and shows you where to focus to improve.",
  },
  {
    q: "How does HeyOtis track AI search visibility?",
    a: "HeyOtis runs scheduled campaigns of unbiased, buyer-intent prompts against ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral, captures each answer, and measures whether and how your brand appears — including position, sentiment and the sources the AI cited.",
  },
  {
    q: "How does HeyOtis prove AI actually drove the result?",
    a: "HeyOtis ingests your traffic and AI-bot logs. When a recommended move ships, you can watch AI crawlers like GPTBot and PerplexityBot fetch the changed pages, see referral sessions arrive from assistants like ChatGPT and Perplexity, and measure the before-and-after change in your AI recommendation share — three layers of evidence, from raw log line to business metric.",
  },
  {
    q: "Which AI assistants does HeyOtis monitor?",
    a: "HeyOtis monitors ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral — the assistants most people use to research and compare brands. We add engines as adoption grows.",
  },
  {
    q: "What is Share of Voice in AI search?",
    a: "Share of Voice is how often your brand is recommended in AI answers relative to competitors, for the queries that matter to your category. HeyOtis tracks it over time and by engine.",
  },
  {
    q: "Is HeyOtis the same as SEO?",
    a: "No. SEO optimizes for ranked links on search engines. HeyOtis focuses on Answer Engine Optimization (AEO/GEO) — being the brand AI assistants name and recommend in their generated answers.",
  },
  {
    q: "Do I need to talk to sales to get started?",
    a: "Yes. We set HeyOtis up with you so campaigns reflect your real category, competitors and goals. Book a chat and we'll run your brand and walk you through a sample report.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", href: "/" }])} />
      <JsonLd data={faqPageSchema(faqItemsToSchema(FAQS))} />

      <Hero />

      <PlatformCard />

      {/* The stakes */}
      <Section surface="card">
        <SectionHeading
          align="center"
          eyebrow="The stakes"
          title="The answer is the new shortlist."
          sub="When someone asks an assistant what to buy, they don't get ten blue links to weigh up. They get three names. You're on that list or you're invisible — and there's no page two to climb."
          className="mx-auto max-w-2xl"
        />
      </Section>

      {/* The wound */}
      <Section surface="cream">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <h2
            className="display-md text-balance text-foreground"
            style={{ letterSpacing: "-0.02em" }}
          >
            Knowing you&rsquo;re invisible doesn&rsquo;t make you visible.
          </h2>
          <div className="flex flex-col gap-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              Every tool in this category will show you a number of
              &ldquo;opportunities&rdquo; and wish you luck. Nothing checks
              whether you did the work. Nothing tells you whether it worked.
              Ninety days later the dashboard is a tab nobody opens.
            </p>
            <p>
              HeyOtis is built the other way round. The measurement exists to
              serve the loop — not the other way round.
            </p>
          </div>
        </div>
      </Section>

      {/* The loop */}
      <Section surface="card" id="loop">
        <SectionHeading
          eyebrow="The loop"
          title="A loop that closes itself."
          className="max-w-2xl"
        />
        <div className="mt-12">
          <LoopBento withCompoundsTease />
        </div>
      </Section>

      <CompoundingBand />

      {/* Coverage — answer reel */}
      <Section surface="card">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Coverage"
              title="Measure, live — across every assistant that matters"
              sub="Your customers ask ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral what to buy. HeyOtis watches all six — visibility, sentiment, citations and the fan-out queries behind every answer."
            />
          </div>
          <AnswerReel />
        </div>
      </Section>

      {/* The honesty wedge */}
      <Section surface="card">
        <SectionHeading
          eyebrow="The honesty wedge"
          title="We'd rather tell you nothing than tell you wrong."
          sub="Confident, wrong advice is the cheapest thing an AI product can make — and the most expensive thing you can act on. So we made it hard to produce."
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ul className="flex flex-col gap-6">
            {HONESTY_CLAIMS.map((c) => (
              <li key={c.lead} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-accent">
                  <Check className="size-3.5" aria-hidden />
                </span>
                <p className="text-base leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">{c.lead}</span>{" "}
                  {c.body}
                </p>
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-card p-6 sm:p-8">
            <FindingsPills />
          </div>
        </div>
      </Section>

      <ReportBand />

      {/* What you get — feature cards */}
      <Section surface="cream">
        <SectionHeading
          eyebrow="What you get"
          title="Everything you'd expect. Wired to something that acts."
          sub="The measurement that proves where you stand, and a clear view of where to focus next."
          className="max-w-2xl"
        />
        <div className="mt-12">
          <FeatureCards />
        </div>
      </Section>

      {/* Proof */}
      <Section surface="card">
        <SectionHeading
          align="center"
          eyebrow="Proof"
          title="AI presence can be improved — and measured"
          className="mx-auto max-w-2xl"
        />
        <Reveal className="mt-10">
          <ProofHallensteins />
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section surface="card">
        <Faq
          items={FAQS}
          sub="Everything about how HeyOtis measures and improves your brand's visibility in AI search."
        />
      </Section>

      <CtaBand
        sub="Book a 20-minute walkthrough. We'll run your brand against ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral and show you exactly where you're losing the answer."
        secondary={null}
      />
    </>
  );
}
