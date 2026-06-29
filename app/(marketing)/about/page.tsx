import {
  Sparkles,
  Radar,
  BarChart3,
  ListChecks,
  Target,
  ScanSearch,
  Compass,
  Quote,
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
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import { AiSourceLogos } from "@/components/marketing/visuals/AiSourceLogos";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Why HeyOtis exists: AI assistants like ChatGPT, Claude, Gemini and Perplexity are becoming how buyers discover brands. We measure how your brand shows up in those answers — and how to show up better.",
  path: "/about",
});

const METHOD_STEPS: { step: string; icon: LucideIcon; title: string; blurb: string }[] = [
  {
    step: "01",
    icon: Sparkles,
    title: "Campaigns of unbiased queries",
    blurb:
      "Otis auto-generates buyer-intent prompts for your category, then you review, edit and approve them — so what's measured reflects how real customers ask, not how you'd phrase it.",
  },
  {
    step: "02",
    icon: Radar,
    title: "Capture the real answers",
    blurb:
      "Each campaign runs against ChatGPT, Claude, Gemini and Perplexity on a schedule, recording exactly how every assistant responds, which brands it names, and which sources it cites.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Measure the evidence",
    blurb:
      "Share of Voice, position against your named competitors, sentiment, and the citations the AI grounded on — every metric is read from the actual responses, not estimated.",
  },
  {
    step: "04",
    icon: ListChecks,
    title: "Turn signal into action",
    blurb:
      "Findings roll up into a prioritized view of where to focus — ranked by impact and effort, with the evidence behind each opportunity one click away.",
  },
];

const VALUES: { icon: LucideIcon; title: string; blurb: string }[] = [
  {
    icon: Target,
    title: "Specificity beats hype",
    blurb:
      "We name the engines, show the evidence, and avoid claims we can't ground in a real AI response. Specificity is what makes a visibility number worth trusting.",
  },
  {
    icon: ScanSearch,
    title: "Measure what buyers ask",
    blurb:
      "Unbiased, auto-generated queries keep the picture honest — no cherry-picked prompts that flatter the brand. The goal is a true read, not a vanity score.",
  },
  {
    icon: Compass,
    title: "Built for the answer era",
    blurb:
      "This isn't SEO with a new label. We're focused on how generative assistants choose and recommend — and on the work it takes to earn that recommendation.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ])}
      />

      {/* 1 — Mission hero */}
      <section className="surface-cream relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, oklch(0.24 0.02 285 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.24 0.02 285 / 0.04) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "radial-gradient(ellipse 90% 60% at 50% 0%, black 35%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 90% 60% at 50% 0%, black 35%, transparent 80%)",
            }}
          />
          <div
            className="absolute left-1/2 top-[-14%] h-[420px] w-[min(720px,90vw)] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.68 0.1 280 / 0.16), transparent)",
            }}
          />
        </div>

        <Container className="relative max-w-4xl pb-12 pt-28 sm:pt-32 md:pb-16 lg:pt-36">
          <Eyebrow>About HeyOtis</Eyebrow>
          <h1
            className="mt-6 max-w-3xl font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.0] tracking-[-0.03em] text-foreground"
            style={{ fontStretch: "80%", fontWeight: 800 }}
          >
            AI search is rewriting how brands get{" "}
            <span className="text-accent">discovered.</span>
          </h1>
          <p
            className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            Buyers increasingly ask AI assistants what to choose — and the
            assistant&rsquo;s answer is the new shortlist. HeyOtis exists to measure
            how your brand shows up in those answers, and to give you the plan
            to show up better.
          </p>
          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <BookCta nudge withArrow />
            <a
              href="#methodology"
              className="px-4 py-2 text-sm font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              How Otis works
            </a>
          </div>
        </Container>
      </section>

      {/* 2 — The shift / why now */}
      <Section surface="card">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Why now"
              title="The web is moving from links to answers."
              sub="A new discipline — Answer Engine Optimization (AEO/GEO) — and the reason we built HeyOtis."
            />
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col gap-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              For two decades, being found meant ranking on a page of blue
              links. People scanned, clicked, and decided for themselves. That
              behaviour is changing fast.
            </p>
            <p>
              Now buyers ask ChatGPT, Claude, Gemini and Perplexity directly —
              &ldquo;what&rsquo;s the best option for me?&rdquo; — and act on a
              single, synthesized answer. The assistant does the shortlisting.
              If your brand isn&rsquo;t in that answer, you&rsquo;re not in the
              consideration set.
            </p>
            <p>
              This is its own discipline: Answer Engine Optimization, sometimes
              called generative engine optimization. It isn&rsquo;t SEO with a
              new coat of paint — the surface, the signals, and the way to win
              are
              different.{" "}
              <span className="font-medium text-foreground">
                HeyOtis is built for it.
              </span>
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="mt-14 flex flex-col gap-5 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="label-mono text-[0.7rem] text-muted-foreground">
              Monitored today — more engines as adoption grows
            </p>
            <AiSourceLogos />
          </div>
        </Reveal>
      </Section>

      {/* 3 — How Otis works / methodology */}
      <Section surface="cream" id="methodology">
        <SectionHeading
          eyebrow="How Otis works"
          title="Measured, not guessed."
          sub="Otis runs scheduled campaigns of unbiased queries, captures how each assistant actually answers, and reads the evidence straight from those responses."
          className="max-w-2xl"
        />

        {/* Principle callout */}
        <Reveal>
          <figure className="mt-12 overflow-hidden rounded-[2rem] border border-brand/20 bg-brand/10 p-8 sm:p-12">
            <Quote
              aria-hidden
              className="size-8 text-accent/70"
              strokeWidth={1.5}
            />
            <blockquote
              className="mt-5 max-w-3xl font-display text-2xl leading-snug tracking-tight text-foreground sm:text-3xl"
              style={{ fontStretch: "85%" }}
            >
              The wording is generated, the evidence is not.
            </blockquote>
            <figcaption className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Query phrasing is auto-generated to stay unbiased and reflect how
              real buyers ask. But every metric — Share of Voice, rankings,
              citations, sentiment — is grounded in the assistants&rsquo; actual
              responses. Nothing is inferred or modelled.
            </figcaption>
          </figure>
        </Reveal>

        {/* Method steps */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {METHOD_STEPS.map(({ step, icon: Icon, title, blurb }, i) => (
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

      {/* 4 — Values / approach */}
      <Section surface="card">
        <SectionHeading
          eyebrow="What we believe"
          title="How we approach the work"
          sub="A few principles that keep the picture honest and the work focused on the answer era."
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, blurb }, i) => (
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

      <CtaBand />
    </>
  );
}
