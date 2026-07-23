import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/marketing/primitives/Section";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "The Platform - measurement, analytics, strategy and roadmap",
  description:
    "Inside the Otis platform: AEO Insights measures how every assistant talks about your category, AEO Analytics tracks the real-world lift, Strategy turns evidence into ranked moves, and the Roadmap lines it all up on one timeline.",
  path: "/platform",
});

/* ── Shared pieces ──────────────────────────────────────────────────────── */

type Item = { id?: string; name: string; desc: string };

/** Surface eyebrow: colored dot + mono label, the site's section signature. */
function Eyebrow({ dot, children }: { dot: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={cn("size-1.5 rounded-full", dot)} aria-hidden />
      <span className="label-mono text-foreground">{children}</span>
    </span>
  );
}

/** Name + one-line description, the definition-list unit reused everywhere. */
function DefGrid({
  items,
  className,
}: {
  items: Item[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-x-10 gap-y-7 sm:grid-cols-2", className)}>
      {items.map((it) => (
        <div key={it.name} id={it.id} className="scroll-mt-28">
          <p className="text-sm font-semibold text-foreground">{it.name}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {it.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

/** A sub-area within a surface, held behind a dashed blueprint rule. */
function SubGroup({
  label,
  intro,
  children,
}: {
  label: string;
  intro: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mt-11 border-l border-dashed border-border pl-6 sm:pl-8">
      <p className="label-mono text-muted-foreground">{label}</p>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/85">
        {intro}
      </p>
      {children}
    </div>
  );
}

/* ── Content ────────────────────────────────────────────────────────────── */

const CAMPAIGN_METRICS: Item[] = [
  {
    id: "visibility",
    name: "Visibility",
    desc: "Rankings, share of voice and average position across AI platforms, tracked over time.",
  },
  {
    id: "sentiment",
    name: "Sentiment",
    desc: "How assistants frame you — praise, hedges and objections — measured across every model.",
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
];

const OBSERVATION_SOURCES: Item[] = [
  {
    name: "Web analytics",
    desc: "Referral sessions and conversions from every assistant, tied to the pages that earned them.",
  },
  {
    name: "Bot analytics",
    desc: "GPTBot, ClaudeBot and PerplexityBot fetches of your pages, logged over time.",
  },
];

const STRATEGY_PARTS: Item[] = [
  {
    id: "insights",
    name: "Insights",
    desc: "Deterministically found, not guessed. Otis derives each insight from the measurement itself — a citation you've lost, a query you're missing from, a competitor pulling ahead — traceable to the data that produced it.",
  },
  {
    id: "recommendations",
    name: "Recommendations",
    desc: "Every insight generates a recommendation: a specific, ranked move to make, with the insight it answers attached. Never vibes — always the why.",
  },
  {
    id: "observations",
    name: "Observations",
    desc: "The real-world changes from AEO Analytics, brought into Strategy so a recommendation can be measured against what actually moved.",
  },
  {
    id: "attributions",
    name: "Attributions",
    desc: "The thread that ties it together — every lift linked back to the recommendation that caused it, the insight that prompted it, and the campaign that surfaced it.",
  },
];

const ROADMAP_EVENTS: Array<{ lead: string; rest: string }> = [
  { lead: "A campaign", rest: "runs against the assistants." },
  { lead: "An insight", rest: "surfaces from the measurement." },
  { lead: "A recommendation", rest: "is generated from that insight." },
  { lead: "A recommendation", rest: "is implemented and ships." },
  {
    lead: "An observation",
    rest: "appears — a real-world lift, like a GA4 increase or a jump in bot crawls.",
  },
  {
    lead: "Attribution",
    rest: "links the observation back to its recommendation, insight, and campaign.",
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
          Understand and control your AI presence
        </h1>
        <p
          className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground"
          data-speakable
        >
          The Otis platform runs across four surfaces — measurement, analytics,
          strategy, and a single roadmap that ties them together.{" "}
          <span className="font-medium text-foreground">
            They show you what’s driving your visibility across every AI
            assistant, and give you the levers to change it.
          </span>
        </p>
        <div className="mt-9">
          <BookCta variant="salmon" className="h-13 px-9 text-base" />
        </div>
      </Section>

      {/* AEO Insights */}
      <Section surface="card" id="insights-surface" className="scroll-mt-16">
        <div className="max-w-2xl">
          <Eyebrow dot="bg-salmon">AEO Insights</Eyebrow>
          <h2 className="display-md mt-4 text-balance text-foreground">
            Understand what’s driving your visibility
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Otis runs your category’s real buyer questions across every
            assistant and scores what comes back — so you always know where you
            stand, and why.
          </p>
        </div>

        <SubGroup
          label="Campaigns"
          intro="A campaign is a recurring run of your category's questions across the assistants. Each one measures four things:"
        >
          <DefGrid items={CAMPAIGN_METRICS} className="mt-7 lg:grid-cols-2" />
        </SubGroup>

        <SubGroup
          label="Insights"
          intro={
            <>
              Where campaigns tell you <em className="not-italic text-foreground">what’s happening</em>,
              insights tell you <em className="not-italic text-foreground">what it means</em> — the
              patterns Otis surfaces from the measurement, like where you’re
              cited, missing, or slipping. Strategy is where they become action.
            </>
          }
        />
      </Section>

      {/* AEO Analytics */}
      <Section surface="card" id="analytics-surface" className="scroll-mt-16">
        <div className="max-w-2xl">
          <Eyebrow dot="bg-periwinkle">AEO Analytics</Eyebrow>
          <h2 className="display-md mt-4 text-balance text-foreground">
            The real-world signal behind the rankings
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Beyond what assistants say, AEO Analytics watches what actually
            happens — the traffic and crawler activity your AI visibility
            drives.
          </p>
        </div>

        <SubGroup
          label="Observations"
          intro="An observation is a real-world change Otis records — an actual movement in the world, not something inside the platform — drawn from two sources:"
        >
          <DefGrid items={OBSERVATION_SOURCES} className="mt-7 lg:grid-cols-2" />
        </SubGroup>
      </Section>

      {/* Strategy */}
      <Section surface="card" id="strategy-surface" className="scroll-mt-16">
        <div className="max-w-2xl">
          <Eyebrow dot="bg-lime">Strategy</Eyebrow>
          <h2 className="display-md mt-4 text-balance text-foreground">
            From evidence to a plan that proves itself
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Strategy is where everything Otis measures becomes a decision — and
            where every decision stays tethered to the evidence it came from.
          </p>
        </div>

        <DefGrid items={STRATEGY_PARTS} className="mt-10 gap-y-9" />

        {/* Attribution chain — the data model, drawn in type not a graphic. */}
        <div className="mt-10 border-l border-dashed border-border pl-6 sm:pl-8">
          <p className="label-mono text-muted-foreground">How attribution links</p>
          <p className="mt-3 label-mono flex flex-wrap items-center gap-x-2 gap-y-1 text-foreground">
            <span>observation</span>
            <span className="text-accent" aria-hidden>→</span>
            <span>recommendation</span>
            <span className="text-accent" aria-hidden>→</span>
            <span>insight</span>
            <span className="text-accent" aria-hidden>→</span>
            <span>campaign</span>
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Read it back to front: the campaign surfaced the insight, the insight
            prompted the recommendation, the recommendation moved the world — and
            the observation proves it.
          </p>
        </div>
      </Section>

      {/* Roadmap */}
      <Section surface="card" id="roadmap-surface" className="scroll-mt-16">
        <div className="max-w-2xl">
          <Eyebrow dot="bg-accent">Roadmap</Eyebrow>
          <h2 className="display-md mt-4 text-balance text-foreground">
            One timeline for everything
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            The roadmap is the single view where every moving part lines up in
            time — Gantt-style, so you can watch the whole loop unfold and see
            how each piece connects to the last.
          </p>
        </div>

        <ol className="mt-10 max-w-3xl border-t border-dashed border-border">
          {ROADMAP_EVENTS.map((ev, i) => (
            <li
              key={ev.lead + ev.rest}
              className="flex gap-5 border-b border-dashed border-border py-4"
            >
              <span className="label-mono tabular-nums text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-base leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">{ev.lead}</span>{" "}
                {ev.rest}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand
        sub="Book a 20-minute walkthrough. We’ll run your brand through the platform and show you exactly where you’re losing the answer — and what to do about it."
        secondary={null}
      />
    </>
  );
}
