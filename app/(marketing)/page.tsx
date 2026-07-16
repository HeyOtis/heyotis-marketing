import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/marketing/sections/Hero";
import { PlatformCard } from "@/components/marketing/sections/PlatformCard";
import { EvidenceCards } from "@/components/marketing/sections/EvidenceCards";
import { FeatureCards } from "@/components/marketing/sections/FeatureCards";
import { LoopBento } from "@/components/marketing/visuals/LoopBento";
import { ProofHalenstein } from "@/components/marketing/sections/ProofHalenstein";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { StatBand } from "@/components/marketing/sections/StatBand";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import { Faq, faqItemsToSchema, type FaqItem } from "@/components/marketing/sections/Faq";
import { Section } from "@/components/marketing/primitives/Section";
import { SectionHeading } from "@/components/marketing/primitives/SectionHeading";
import { AiSourceBeam } from "@/components/marketing/visuals/AiSourceBeam";

export const metadata = buildMetadata({
  title: "See how AI recommends your brand",
  path: "/",
});

const STATS = [
  {
    value: 300,
    prefix: "+",
    suffix: "%",
    label: "AI recommendation share lift — Halenstein, Australia",
    customer: "Halenstein",
  },
  {
    value: 6,
    label:
      "AI assistants monitored — ChatGPT, Gemini, Perplexity, Claude, Meta AI & Mistral",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Always-on tracking of how AI answers about you",
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

      <EvidenceCards />

      {/* Why it matters + illustrative outcomes */}
      <Section surface="card">
        <SectionHeading
          align="center"
          eyebrow="Why it matters"
          title="AI is becoming the front door to your brand"
          sub="When a buyer asks an assistant what to choose, the answer is the shortlist. HeyOtis makes sure you're on it — and shows you exactly how to get there."
          className="mx-auto max-w-3xl"
        />
        <div className="mt-14">
          <StatBand stats={STATS} className="lg:grid-cols-3" />
        </div>
      </Section>

      {/* How it works — the loop */}
      <Section surface="cream">
        <SectionHeading
          eyebrow="How it works"
          title="A campaign-led loop that closes itself"
          sub="Measure where you stand, diagnose the gaps, prioritize the moves — then verify they shipped and prove your recommendation share moved."
          className="max-w-2xl"
        />
        <div className="mt-12">
          <LoopBento compact />
        </div>
        <div className="mt-10">
          <a
            href="/strategy-engine"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Go deeper on the Strategy Engine →
          </a>
        </div>
      </Section>

      {/* Coverage — animated beam */}
      <Section surface="card">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Coverage"
              title="Across every assistant that matters"
              sub="Your customers ask ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral what to buy, compare and trust. HeyOtis watches all six — capturing how each one answers, who it recommends, and which sources it leans on."
            />
          </div>
          <AiSourceBeam />
        </div>
      </Section>

      {/* What you get — feature cards */}
      <Section surface="cream">
        <SectionHeading
          eyebrow="What you get"
          title="Everything you need to win the answer"
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
          <ProofHalenstein />
        </Reveal>
      </Section>

      {/* FAQ */}
      <Section surface="card">
        <Faq
          items={FAQS}
          sub="Everything about how HeyOtis measures and improves your brand's visibility in AI search."
        />
      </Section>

      <CtaBand />
    </>
  );
}
