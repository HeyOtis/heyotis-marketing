import {
  BarChart3,
  ListChecks,
  Link2,
  ScanSearch,
  MessageSquare,
  PlayCircle,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/marketing/Container";
import { Section } from "@/components/marketing/primitives/Section";
import { SectionHeading } from "@/components/marketing/primitives/SectionHeading";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { AiSourceLogos } from "@/components/marketing/visuals/AiSourceLogos";

export const metadata = buildMetadata({
  title: "Free AI Visibility Report",
  description:
    "We run your brand against ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral and send back a report showing where you're recommended, mentioned and missing.",
  path: "/report",
});

const WHATS_IN_IT: { icon: LucideIcon; title: string; blurb: string }[] = [
  {
    icon: BarChart3,
    title: "Share of voice snapshot",
    blurb:
      "Where you stand today across ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral, on the prompts that matter to your category.",
  },
  {
    icon: ScanSearch,
    title: "Per-assistant verdicts",
    blurb:
      "Recommended, mentioned or missing — engine by engine, so you know exactly where the gaps are.",
  },
  {
    icon: Link2,
    title: "Top citations won and lost",
    blurb:
      "The sources each assistant is grounding its answer on, and whether they're yours or a competitor's.",
  },
  {
    icon: ListChecks,
    title: "Three prioritised moves",
    blurb:
      "The highest-impact places to focus first, ranked by impact and effort — not a generic checklist.",
  },
];

const HOW_IT_WORKS: { step: string; icon: LucideIcon; title: string; blurb: string }[] = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Tell us your brand",
    blurb:
      "Name your brand, market and the competitors you want measured against. Takes a couple of minutes.",
  },
  {
    step: "02",
    icon: PlayCircle,
    title: "We run the campaign",
    blurb:
      "HeyOtis runs a live campaign of buyer-intent prompts across all six assistants and captures exactly how each one answers.",
  },
  {
    step: "03",
    icon: CalendarCheck,
    title: "20-minute walkthrough",
    blurb:
      "We deliver the report live in a 20-minute call — walking you through the findings and answering questions as they come up.",
  },
];

export default function ReportPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Free AI Visibility Report", href: "/report" },
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
          <Eyebrow>Free AI Visibility Report</Eyebrow>
          <h1
            className="display-lg mt-5 max-w-3xl text-balance"
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            See exactly how AI answers{" "}
            <span className="text-accent">for your brand.</span>
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            We run your brand against six AI assistants — ChatGPT, Gemini,
            Perplexity, Claude, Meta AI and Mistral — and send back a report
            showing where you&rsquo;re recommended, mentioned and missing.
          </p>
          <div className="mt-8">
            <BookCta nudge withArrow />
          </div>
        </Container>
      </section>

      {/* What's in it */}
      <Section surface="card">
        <SectionHeading
          eyebrow="What's in it"
          title="Four things you'll walk away with"
          sub="Not a vanity score — a grounded read of where you stand, and what to do about it."
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {WHATS_IN_IT.map(({ icon: Icon, title, blurb }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-secondary/40 p-7">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-accent">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
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

      {/* How it works */}
      <Section surface="cream">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps, one 20-minute call"
          sub="No lengthy onboarding — three steps and a call."
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {HOW_IT_WORKS.map(({ step, icon: Icon, title, blurb }, i) => (
            <Reveal key={step} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-accent">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="label-mono text-xs text-muted-foreground">
                    {step}
                  </span>
                </div>
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

      {/* Close */}
      <Section surface="card">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <p className="text-balance text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
            Delivered live in a 20-minute walkthrough — today, that&rsquo;s how
            we get the report in front of you.
          </p>
          <AiSourceLogos withText className="justify-center" />
          <BookCta nudge withArrow />
        </div>
      </Section>
    </>
  );
}
