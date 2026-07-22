import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/marketing/primitives/Section";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import {
  MeasureVignette,
  StrategyVignette,
  ActVignette,
  AttributeVignette,
} from "@/components/marketing/visuals/LoopVignettes";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "The Platform - one loop from measurement to proof",
  description:
    "Otis runs the loop in four stages: Measure how every AI platform talks about your category (AEO Insights), turn it into a ranked Strategy, Act with verified implementation, and Attribute the lift with deterministic analytics.",
  path: "/platform",
});

type Capability = { id?: string; name: string; desc: string };

const STAGES: Array<{
  id: string;
  kicker: string;
  title: string;
  blurb: string;
  capabilities: Capability[];
  Vignette: React.ComponentType;
  cta?: { label: string; href: string };
}> = [
  {
    id: "measure",
    kicker: "01 · Measure - powered by AEO Insights",
    title: "All of your AI visibility in one data-rich surface",
    blurb:
      "Otis runs your category's real buyer questions across every assistant and scores what comes back - so you always know exactly where you stand, and why.",
    capabilities: [
      {
        id: "visibility",
        name: "Visibility",
        desc: "Rankings, share of voice and average position across AI platforms, tracked over time.",
      },
      {
        id: "sentiment",
        name: "Sentiment",
        desc: "How assistants frame you - praise, hedges and objections - measured across every model.",
      },
      {
        id: "fanouts",
        name: "Fanout Queries",
        desc: "The follow-up searches assistants run behind every answer, and whether you show up in them.",
      },
      {
        id: "citations",
        name: "Citations",
        desc: "Every source AI leans on in your category, and how often that source is you.",
      },
    ],
    Vignette: MeasureVignette,
  },
  {
    id: "strategy",
    kicker: "02 · Strategy - the Strategy Engine",
    title: "From evidence to a ranked plan",
    blurb:
      "The Strategy Engine reads the measurement and writes the plan: moves scored on impact and effort, ranked, and sequenced into a quarter - each step carrying the evidence it came from.",
    capabilities: [
      {
        name: "Insights",
        desc: "What the measurement surfaced - where you're cited, missing, or slipping.",
      },
      {
        name: "Recommendations",
        desc: "Ranked moves with the why attached. Never vibes.",
      },
      {
        name: "The plan",
        desc: "Sequenced into a quarter your team can actually run.",
      },
    ],
    Vignette: StrategyVignette,
    cta: { label: "Explore the Strategy Engine", href: "/strategy-engine" },
  },
  {
    id: "act",
    kicker: "03 · Act - implementation, tracked",
    title: "Ship it, watch it land",
    blurb:
      "A plan only counts once it ships. Each move becomes tracked work: Otis watches the crawlers pick up the change, verifies it's live in production, and confirms the answer actually moved.",
    capabilities: [
      {
        name: "Work items",
        desc: "The plan broken into concrete, owned tasks.",
      },
      {
        name: "Watch it land",
        desc: "From ship, to crawl, to a changed answer - within days.",
      },
      {
        name: "Verified live",
        desc: "Every change checked in production before it counts.",
      },
    ],
    Vignette: ActVignette,
  },
  {
    id: "attribute",
    kicker: "04 · Attribute - powered by AEO Analytics",
    title: "Deterministic attribution, receipts attached",
    blurb:
      "Website analytics and AI bot analytics, joined into one deterministic record. Every lift is attributed to the move that caused it - and what worked feeds straight back into the next plan.",
    capabilities: [
      {
        name: "Website analytics",
        desc: "Referral sessions and conversions from every assistant, tied to the pages that earned them.",
      },
      {
        name: "AI bot analytics",
        desc: "GPTBot, ClaudeBot and PerplexityBot fetches of your pages, logged and matched to changes.",
      },
      {
        name: "The receipts",
        desc: "Every number traces back to a logged event - crawl, session, order.",
      },
    ],
    Vignette: AttributeVignette,
  },
];

export default function PlatformPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Platform", href: "/platform" },
        ])}
      />

      {/* Intro */}
      <Section surface="card" className="pb-4 md:pb-8">
        <p className="label-mono text-accent">/ The Platform</p>
        <h1
          className="display-hero mt-5 max-w-3xl text-balance text-foreground"
          style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
        >
          One loop from measurement to proof
        </h1>
        <p
          className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground"
          data-speakable
        >
          Otis watches how every AI platform talks about your category, turns
          what it learns into a ranked plan, verifies the work ships, and
          attributes the lift.{" "}
          <span className="font-medium text-foreground">
            One loop, four stages, no guesswork.
          </span>
        </p>
        <div className="mt-9">
          <BookCta variant="salmon" className="h-13 px-9 text-base" />
        </div>
      </Section>

      {/* The four stages */}
      {STAGES.map(({ id, kicker, title, blurb, capabilities, Vignette, cta }) => (
        <Section key={id} surface="card" id={id} className="scroll-mt-16">
          <div className="max-w-2xl">
            <p className="label-mono text-[0.7rem] text-accent">{kicker}</p>
            <h2 className="display-md mt-4 text-balance text-foreground">
              {title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {blurb}
            </p>
          </div>

          <div
            className={cn(
              "mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2",
              capabilities.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
            )}
          >
            {capabilities.map((cap) => (
              <div key={cap.name} id={cap.id} className="scroll-mt-28">
                <p className="text-sm font-semibold text-foreground">
                  {cap.name}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {cap.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 h-[560px] sm:h-[540px]">
            <Vignette />
          </div>

          {cta ? (
            <a
              href={cta.href}
              className="mt-10 inline-flex w-fit items-center rounded-full bg-salmon px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-salmon/85"
            >
              {cta.label}
            </a>
          ) : null}
        </Section>
      ))}

      <CtaBand
        sub="Book a 20-minute walkthrough. We'll run your brand through the loop and show you exactly where you're losing the answer - and what to do about it."
        secondary={null}
      />
    </>
  );
}
