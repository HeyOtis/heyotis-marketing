import { ArrowDown, Check } from "lucide-react";
import { Container } from "@/components/marketing/Container";
import { Section } from "@/components/marketing/primitives/Section";
import { SectionHeading } from "@/components/marketing/primitives/SectionHeading";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { AiSourceLogos } from "@/components/marketing/visuals/AiSourceLogos";
import { StrategyLoop } from "@/components/marketing/visuals/StrategyLoop";
import { OpportunityBoard } from "@/components/marketing/visuals/OpportunityBoard";
import { AttributionPanel } from "@/components/marketing/visuals/AttributionPanel";
import { SignalIntake } from "@/components/marketing/visuals/SignalIntake";
import { MaturityLevels } from "@/components/marketing/sections/MaturityLevels";
import { ProofHalenstein } from "@/components/marketing/sections/ProofHalenstein";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { SIGNAL_STREAMS } from "@/lib/strategy-content";

export const metadata = buildMetadata({
  title: "The Strategy Engine",
  description:
    "Dashboards tell you where you stand. The HeyOtis Strategy Engine finds the move, verifies it shipped, and proves whether your AI recommendation share actually moved.",
  path: "/strategy-engine",
});

const HONESTY = [
  {
    title: "Capabilities check",
    body: "It only recommends a move it can verify got done. If a signal source isn't connected, it surfaces the gap instead of guessing.",
  },
  {
    title: "Maturity gating",
    body: "New signals ship dark, get measured, and only become client-visible once the data says they're trustworthy.",
  },
  {
    title: "Validator-gated reporting",
    body: "Every number traces back to source. The engine refuses to invent a statistic to make a point.",
  },
];

export default function StrategyEnginePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Strategy Engine", href: "/strategy-engine" },
        ])}
      />

      {/* 1 — Hero */}
      <section className="surface-cream relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-[-14%] h-[420px] w-[min(760px,90vw)] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.68 0.1 280 / 0.18), transparent)",
            }}
          />
        </div>
        <Container className="relative pb-12 pt-28 sm:pt-32 md:pb-16 lg:pt-36">
          <Eyebrow>The Strategy Engine</Eyebrow>
          <h1
            className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.0] tracking-[-0.03em] text-foreground"
            style={{ fontStretch: "80%", fontWeight: 800 }}
          >
            Dashboards tell you where you stand.{" "}
            <span className="text-accent">The Strategy Engine changes it.</span>
          </h1>
          <p
            className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            HeyOtis finds the move that grows your AI recommendation share,
            verifies it actually shipped, and proves whether it moved the metric
            — a campaign-led loop that compounds, not another dashboard.
          </p>
          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <BookCta nudge withArrow />
            <a
              href="#loop"
              className="group inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              See the loop
              <ArrowDown className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" />
            </a>
          </div>
        </Container>
      </section>

      {/* 2 — The shift */}
      <Section surface="card">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Why now"
              title="AI search created a new channel most teams can't manage"
              sub="Dashboards without direction don't drive results."
            />
          </Reveal>
          <Reveal
            delay={0.08}
            className="flex flex-col gap-5 text-lg leading-relaxed text-muted-foreground"
          >
            <p>
              For years, discovery meant ranking on a page of links. AI
              assistants changed the shape of the journey — buyers now ask what
              to choose and act on a single recommendation.
            </p>
            <p>
              Your brand can be strong in search, strong in retail and well
              known in market, yet still be missing, misrepresented or
              outranked when an assistant explains the category. Measuring that
              is table stakes.{" "}
              <span className="font-medium text-foreground">
                Closing the gap — and proving you did — is the hard part.
              </span>
            </p>
          </Reveal>
        </div>
      </Section>

      {/* 3 — What flows in */}
      <Section surface="cream">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="The inputs"
              title="Five signal streams. One picture of how AI sees you."
              sub="The engine is only as good as its evidence — so it ingests the evidence. Your answers, your traffic and bot logs, your analytics, your own pages and your competitors' wins all flow into one model of the gap."
            />
            <ul className="mt-8 flex flex-col gap-4">
              {SIGNAL_STREAMS.map((s) => (
                <li key={s.id} className="flex items-start gap-3">
                  <span
                    className={
                      s.differentiator
                        ? "mt-1 size-2 shrink-0 rounded-full bg-accent"
                        : "mt-1 size-2 shrink-0 rounded-full bg-brand/40"
                    }
                  />
                  <p className="text-base leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">{s.name}.</span>{" "}
                    {s.blurb}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <Reveal delay={0.08}>
            <SignalIntake />
          </Reveal>
        </div>
      </Section>

      {/* 4 — The loop */}
      <Section surface="card" id="loop">
        <SectionHeading
          eyebrow="The loop"
          title="One campaign-led loop, end to end"
          sub="Most tools stop at Measure. The Strategy Engine closes the loop — verifying the move shipped and proving it changed how AI recommends you."
          className="max-w-2xl"
        />
        <div className="mt-12">
          <StrategyLoop />
        </div>
      </Section>

      {/* 5 — Four levels */}
      <Section surface="cream">
        <SectionHeading
          eyebrow="How deep it goes"
          title="Four levels the engine operates at"
          sub="From telling you what's happening to doing the work for you."
          className="max-w-2xl"
        />
        <div className="mt-12">
          <MaturityLevels />
        </div>
      </Section>

      {/* 6 — The action plan */}
      <Section surface="card">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="The action plan"
              title="From signals to the moves that matter"
              sub="Findings become a focused, ranked plan — every opportunity scored by impact and effort, tied to the metric it moves, and backed by the deterministic signals beneath it."
            />
            <ul className="mt-8 flex flex-col gap-4">
              {[
                "Opportunities ranked by impact × effort",
                "Each tied to the metric it's measured by",
                "Every move backed by the evidence beneath it",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-accent">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <span className="text-base leading-relaxed text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Reveal delay={0.08}>
            <OpportunityBoard />
          </Reveal>
        </div>
      </Section>

      {/* 6 — Real attribution */}
      <Section surface="card">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="lg:order-2">
            <AttributionPanel />
          </Reveal>
          <div className="lg:order-1">
            <SectionHeading
              eyebrow="Real attribution"
              title="Proof it mattered — not just that it shipped"
              sub="When a move goes live, the engine watches the real metric and measures the before-and-after, with an evidence trail you can open. The wording is generated; the evidence is not."
            />
          </div>
        </div>
      </Section>

      {/* 7 — Honesty architecture */}
      <Section surface="cream">
        <SectionHeading
          eyebrow="Built on evidence"
          title="It won't recommend what it can't prove"
          sub="The cheapest thing to ship is a confident-sounding recommendation. The most expensive mistake is a confident-sounding wrong one. So the engine is built to refuse it."
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {HONESTY.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {h.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {h.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 8 — Proof */}
      <Section surface="card">
        <SectionHeading
          eyebrow="Proof"
          title="It works"
          className="max-w-2xl"
        />
        <Reveal className="mt-10">
          <ProofHalenstein />
        </Reveal>
      </Section>

      {/* 9 — Platform + strategists */}
      <Section surface="cream">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Platform + strategists"
              title="The engine finds the moves. Our strategists help you ship them."
              sub="HeyOtis pairs the Strategy Engine with hands-on GEO strategy. The platform does the analysis, the recommendations and the proof; our team helps you turn them into work that lands."
            />
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col justify-center gap-4">
            <p className="label-mono text-[0.65rem] text-muted-foreground">
              Monitored across
            </p>
            <AiSourceLogos />
          </Reveal>
        </div>
      </Section>

      {/* 10 — Where this is heading (vision) */}
      <Section surface="card">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Where this is heading</Eyebrow>
          <h2
            className="mt-5 display-sm text-balance"
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            The operating system for brands on the agent-native web
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            The loop is the start. As assistants become how brands are
            discovered, served and transacted with, HeyOtis is building toward
            the full stack — see, serve, test and act on how AI represents you.
          </p>
        </div>
      </Section>

      <CtaBand
        eyebrow="Get started"
        title={
          <>
            See the Strategy Engine
            <br className="hidden sm:block" /> on your brand.
          </>
        }
        sub="Book a 20-minute walkthrough. We'll run your brand, surface the highest-impact moves, and show you how the loop proves the lift."
      />
    </>
  );
}
