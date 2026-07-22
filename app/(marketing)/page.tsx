import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/marketing/sections/Hero";
import { ClientLogos } from "@/components/marketing/sections/ClientLogos";
import { CaseStudyDaylyte } from "@/components/marketing/sections/CaseStudyDaylyte";
import { ReportBand } from "@/components/marketing/sections/ReportBand";
import { PillarSections } from "@/components/marketing/sections/PillarSections";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import { Faq, faqItemsToSchema, type FaqItem } from "@/components/marketing/sections/Faq";
import { Section } from "@/components/marketing/primitives/Section";
import { SectionHeading } from "@/components/marketing/primitives/SectionHeading";

export const metadata = buildMetadata({
  // Brand-first <title> for the homepage (the one page where that's standard).
  titleAbsolute: "HeyOtis - AI Search Intelligence",
  // Kept as the punchy, benefit-led title on shared social/OG cards.
  title: "See how AI recommends your brand",
  description:
    "HeyOtis measures how ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews recommend your brand, finds the moves that grow your share, watches the work land, and measures the lift. A closed loop — not another dashboard.",
  path: "/",
});

const FAQS: FaqItem[] = [
  {
    q: "What is HeyOtis?",
    a: "HeyOtis is an AI brand visibility platform. It measures how AI assistants like ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews recommend your brand — your Share of Voice, the citations they trust, and how you rank against competitors — and shows you where to focus to improve.",
  },
  {
    q: "How does HeyOtis track AI search visibility?",
    a: "HeyOtis runs scheduled campaigns of unbiased, buyer-intent prompts against ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews, captures each answer, and measures whether and how your brand appears — including position, sentiment and the sources the AI cited.",
  },
  {
    q: "How does HeyOtis prove AI actually drove the result?",
    a: "HeyOtis ingests your traffic and AI-bot logs. When a recommended move ships, you can watch AI crawlers like GPTBot and PerplexityBot fetch the changed pages, see referral sessions arrive from assistants like ChatGPT and Perplexity, and measure the before-and-after change in your AI recommendation share — three layers of evidence, from raw log line to business metric.",
  },
  {
    q: "Which AI assistants does HeyOtis monitor?",
    a: "HeyOtis monitors ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews — the assistants most people use to research and compare brands. We add engines as adoption grows.",
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

      <ClientLogos />

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

      <CaseStudyDaylyte />

      {/* The three pillars — deep-panel product stories */}
      <PillarSections />

      <ReportBand />

      {/* FAQ */}
      <Section surface="card">
        <Faq
          items={FAQS}
          sub="Everything about how HeyOtis measures and improves your brand's visibility in AI search."
        />
      </Section>

      <CtaBand
        sub="Book a 20-minute walkthrough. We'll run your brand against ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews and show you exactly where you're losing the answer."
        secondary={null}
      />
    </>
  );
}
