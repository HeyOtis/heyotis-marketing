import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/marketing/sections/Hero";
import { ProductReveal } from "@/components/marketing/sections/ProductReveal";
import { FeatureCards } from "@/components/marketing/sections/FeatureCards";
import { PillarBento } from "@/components/marketing/sections/PillarBento";
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
    value: 6,
    label: "AI assistants monitored — ChatGPT, Gemini, Perplexity, Claude, Meta AI & Mistral",
  },
  {
    value: 300,
    prefix: "+",
    suffix: "%",
    label: "Illustrative lift in AI recommendation share",
    customer: "Illustrative outcome",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Always-on tracking of how AI answers about you",
  },
  {
    value: 100,
    suffix: "%",
    label: "Of your named competitor set, benchmarked head-to-head",
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

      <ProductReveal />

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
          <StatBand stats={STATS} />
        </div>
      </Section>

      {/* How it works — pillars */}
      <Section surface="cream">
        <SectionHeading
          eyebrow="How it works"
          title="From AI answers to action, in one loop"
          sub="Measure where you stand, benchmark the competition, own the citations AI trusts, act on what matters, and prove the impact."
          className="max-w-2xl"
        />
        <div className="mt-12">
          <PillarBento />
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
