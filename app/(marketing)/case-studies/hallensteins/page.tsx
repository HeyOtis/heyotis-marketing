import {
  Gauge,
  ScanSearch,
  ListChecks,
  CircleCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/marketing/Container";
import { Section } from "@/components/marketing/primitives/Section";
import { SectionHeading } from "@/components/marketing/primitives/SectionHeading";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { StatBand, type Stat } from "@/components/marketing/sections/StatBand";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import { HALLENSTEINS } from "@/lib/strategy-content";

export const metadata = buildMetadata({
  title: "Hallensteins: from near-zero to 3.7% AI recommendation share",
  description:
    "How Hallensteins went from near-zero AI recommendation share to 3.7% in Australia — a +300% lift.",
  path: "/case-studies/hallensteins",
});

const LOOP_APPLIED: { icon: LucideIcon; title: string; blurb: string }[] = [
  {
    icon: Gauge,
    title: "Measure",
    blurb:
      "We ran a campaign of buyer-intent apparel prompts against all five assistants to see where Hallensteins actually showed up in Australia — not where the brand assumed it did.",
  },
  {
    icon: ScanSearch,
    title: "Diagnose",
    blurb:
      "The evidence showed a brand that was almost never named. Where assistants did answer, they were grounding on competitor pages instead of Hallensteins' own.",
  },
  {
    icon: ListChecks,
    title: "Prioritise",
    blurb:
      "Findings became a ranked list of the highest-impact gaps to close first — the prompts and pages with the clearest route to a recommendation.",
  },
  {
    icon: CircleCheck,
    title: "Verify",
    blurb:
      "As changes ship, detectors watch the relevant surfaces and confirm each move the moment it goes live — no self-reporting.",
  },
  {
    icon: TrendingUp,
    title: "Prove",
    blurb:
      "Recommendation share was re-measured on the same prompts, engine by engine, so the lift is read from real assistant responses, not modelled.",
  },
];

const RESULT_STATS: Stat[] = [
  { value: 300, prefix: "+", suffix: "%", label: "AI recommendation share lift" },
  {
    value: 3.7,
    decimals: 1,
    suffix: "%",
    label: `Recommendation share in ${HALLENSTEINS.market} — up from near-zero`,
  },
];

export default function HallensteinsCaseStudyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Case Studies", href: "/case-studies" },
          { name: "Hallensteins", href: "/case-studies/hallensteins" },
        ])}
      />

      {/* Hero */}
      <section className="surface-cream relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-18%] h-[420px] w-[min(720px,90vw)] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.68 0.1 280 / 0.18), transparent)",
            }}
          />
        </div>

        <Container className="relative pb-12 pt-28 sm:pt-32 md:pb-16 lg:pt-36">
          <Eyebrow>Case Study · Apparel</Eyebrow>
          <h1
            className="display-lg mt-5 max-w-3xl text-balance"
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            Hallensteins: from near-zero to{" "}
            <span className="text-accent">3.7% AI recommendation share.</span>
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            Hallensteins started from near-zero presence in Australian AI
            recommendations. After benchmarking where the brand stood,
            diagnosing the gaps and improving the signals that mattered,
            recommendation share grew {HALLENSTEINS.lift} — to{" "}
            {HALLENSTEINS.shareAfter} in {HALLENSTEINS.market}. The result
            wasn&rsquo;t just more mentions — it was a clear view of where
            competitors were chosen instead, and what to do about it.
          </p>
        </Container>
      </section>

      {/* Situation */}
      <Section surface="card">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="The situation"
              title="Buyers were asking. Hallensteins wasn't in the answer."
            />
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col gap-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              Australian shoppers were already asking AI assistants for
              apparel recommendations — but when they did, Hallensteins
              rarely came up. Recommendation share started from near-zero,
              which meant the brand was effectively absent from the
              shortlist assistants were handing buyers.
            </p>
            <p>
              The question wasn&rsquo;t whether AI-driven discovery mattered
              for the category — it clearly did. It was why Hallensteins
              wasn&rsquo;t part of it, and what it would take to change that.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* What the loop did */}
      <Section surface="cream">
        <SectionHeading
          eyebrow="What the loop did"
          title="Measure, diagnose, prioritise, verify, prove"
          sub="The same cycle HeyOtis runs for every brand — applied to Hallensteins' actual gaps."
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {LOOP_APPLIED.map(({ icon: Icon, title, blurb }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-accent">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {blurb}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Results */}
      <Section surface="card">
        <SectionHeading
          eyebrow="The result"
          title="A measured lift, read from real assistant responses"
          className="max-w-2xl"
        />
        <Reveal delay={0.1}>
          <StatBand stats={RESULT_STATS} tone="ink" className="mt-12" />
        </Reveal>

        {/* QUOTE SLOT: awaiting named Hallensteins quote — do not fabricate */}
      </Section>

      <CtaBand />
    </>
  );
}
