import {
  TrendingDown,
  Quote,
  EyeOff,
  Trophy,
  ShieldAlert,
  CodeXml,
  BarChart3,
  Target,
  TrendingUp,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { Container } from "@/components/marketing/Container";
import { Section } from "@/components/marketing/primitives/Section";
import { SectionHeading } from "@/components/marketing/primitives/SectionHeading";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { FeatureTabs, type FeatureTab } from "@/components/marketing/sections/FeatureTabs";
import { StatBand } from "@/components/marketing/sections/StatBand";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import { Faq, faqItemsToSchema, type FaqItem } from "@/components/marketing/sections/Faq";
import { MockDashboard } from "@/components/marketing/visuals/MockDashboard";
import { AiSourceBeam } from "@/components/marketing/visuals/AiSourceBeam";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Product features",
  description:
    "Inside HeyOtis: Share of Voice, citations, competitive benchmarking and GA4 AI referral traffic across ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral.",
  path: "/features",
});

/* ── Inline illustrative panels (designed mock UI, no screenshots) ────────── */

function PanelShell({
  label,
  badge,
  children,
  className,
}: {
  label: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.03),0_18px_48px_-24px_rgba(40,30,70,0.35)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-coral/70" />
            <span className="size-1.5 rounded-full bg-soft-orange/70" />
            <span className="size-1.5 rounded-full bg-chart-5/60" />
          </span>
          <span className="label-mono text-[0.65rem] text-muted-foreground">
            {label}
          </span>
          <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-accent">
            Sample
          </span>
        </div>
        {badge ? (
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.65rem] font-medium text-muted-foreground">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex-1 p-4 sm:p-6">{children}</div>
    </div>
  );
}

const CAMPAIGN_QUERIES = [
  { q: "best men's hoodie for everyday wear", status: "Approved", tone: "emerald" },
  { q: "affordable joggers with free shipping", status: "Edited", tone: "neutral" },
  { q: "premium streetwear brands worth buying", status: "Approved", tone: "emerald" },
  { q: "which store has the best click & collect", status: "Review", tone: "amber" },
  { q: "winter layering essentials under $100", status: "Approved", tone: "emerald" },
] as const;

const QUERY_TONE = {
  emerald: "bg-emerald-500/12 text-emerald-700",
  amber: "bg-amber-500/15 text-amber-800",
  neutral: "border border-border text-muted-foreground",
} as const;

function CampaignPanel() {
  return (
    <PanelShell label="Campaign" badge="Repeating · 5d">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">
              Product Visibility — NZ
            </h4>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/12 px-2 py-0.5 text-[0.6rem] font-semibold text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" /> Active
            </span>
          </div>
          <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
            Repeating · every 5 days · last run 2 days ago
          </p>
        </div>
        <span className="shrink-0 rounded-lg bg-brand/10 px-2.5 py-1.5 text-[0.65rem] font-semibold text-accent">
          ▶ Run now
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { k: "Region", v: "New Zealand" },
          { k: "Customer voice", v: "Premium" },
          { k: "Engines", v: "All 4" },
        ].map((chip) => (
          <span
            key={chip.k}
            className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-[0.7rem] font-medium text-foreground/70"
          >
            <span className="label-mono text-[0.55rem] text-muted-foreground">
              {chip.k}
            </span>{" "}
            {chip.v}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="label-mono text-[0.6rem] text-muted-foreground">
          Queries to be executed
        </p>
        <span className="text-[0.65rem] text-muted-foreground">
          35 active queries
        </span>
      </div>
      <div className="mt-2 space-y-1.5">
        {CAMPAIGN_QUERIES.map((row, i) => (
          <div
            key={row.q}
            className="flex items-center gap-3 rounded-lg border border-border bg-background/60 px-3 py-2"
          >
            <span className="w-3 shrink-0 text-[0.65rem] tabular-nums text-muted-foreground">
              {i + 1}
            </span>
            <span className="flex-1 truncate text-xs text-foreground">
              “{row.q}”
            </span>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold",
                QUERY_TONE[row.tone],
              )}
            >
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

const OPPORTUNITIES = [
  {
    title: "Own the 'best for everyday' answer",
    impact: "High",
    effort: "Medium",
    top: true,
    metrics: [
      { icon: BarChart3, value: "40.6%", label: "visibility on your weakest prompts" },
      { icon: Target, value: "6%", label: "top-3 rate in premium discovery" },
      { icon: Trophy, value: "+16", label: "first-place gap to close" },
    ],
  },
  {
    title: "Turn recognition into top placement",
    impact: "High",
    effort: "Medium",
    top: false,
    metrics: [
      { icon: BarChart3, value: "69/97", label: "answers at position 4 or lower" },
      { icon: TrendingUp, value: "7.1%", label: "ChatGPT top-3 rate to fix" },
      { icon: Trophy, value: "2.33", label: "avg position when cited" },
    ],
  },
  {
    title: "Win back the retailer citation layer",
    impact: "Medium",
    effort: "Low",
    top: false,
    metrics: [
      { icon: Quote, value: "0/64", label: "competitor citations to reclaim" },
      { icon: CodeXml, value: "18", label: "owned pages missing schema" },
      { icon: Sparkles, value: "1 sprint", label: "to make content citable" },
    ],
  },
] as const;

function StrategyPanel() {
  return (
    <PanelShell label="Strategy Engine" badge="Impact × Effort">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Your action plan</p>
          <p className="mt-0.5 text-[0.7rem] text-muted-foreground">
            Top opportunities to focus on this month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 36 36" className="size-9 -rotate-90" aria-hidden>
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="currentColor"
              className="text-secondary"
              strokeWidth="3.5"
            />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="oklch(0.5 0.16 280)"
              strokeWidth="3.5"
              strokeDasharray="94.25"
              strokeDashoffset="63"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[0.55rem] leading-tight text-muted-foreground">
            33%
            <br />
            actioned
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[0.6rem] font-semibold text-accent">
          All · 3
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[0.6rem] text-muted-foreground">
          High impact · 2
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[0.6rem] text-muted-foreground">
          Medium · 1
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        {OPPORTUNITIES.slice(0, 2).map((o, i) => (
          <div
            key={o.title}
            className="rounded-xl border border-border bg-background/60 p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              {o.top ? (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-primary-foreground">
                  Highest priority
                </span>
              ) : (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.6rem] font-semibold text-muted-foreground">
                  #{i + 1}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-[0.6rem] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-brand" />
                {o.impact} impact · {o.effort} effort
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{o.title}</p>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {o.metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.label}
                    className="rounded-lg border border-border bg-card p-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <Icon className="size-3 shrink-0 text-accent" />
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {m.value}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.55rem] leading-tight text-muted-foreground">
                      {m.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 rounded-lg bg-secondary/70 px-3 py-2 text-[0.7rem] text-muted-foreground">
        <span className="font-semibold text-foreground">
          196 deterministic signals
        </span>{" "}
        across visibility, rankings, citations &amp; content — the wording is
        generated, the evidence is not.
      </p>
    </PanelShell>
  );
}

const TRAFFIC_SOURCES = [
  { name: "ChatGPT", sessions: "2,410", share: 50, tone: "bg-brand" },
  { name: "Claude", sessions: "965", share: 20, tone: "bg-coral" },
  { name: "Perplexity", sessions: "868", share: 18, tone: "bg-sky" },
  { name: "Gemini", sessions: "577", share: 12, tone: "bg-soft-orange" },
] as const;

const TRAFFIC_KPIS = [
  { k: "AI sessions", v: "4,820", d: "▲ 38%" },
  { k: "AI conversions", v: "312", d: "▲ 21%" },
  { k: "AI traffic share", v: "0.4%" },
];

function TrafficChart() {
  return (
    <svg
      viewBox="0 0 600 150"
      className="mt-3 h-24 w-full sm:h-28"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="traffic-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.13 60)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="oklch(0.78 0.13 60)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,115 C30,108 45,62 75,62 C105,62 120,112 150,112 C175,112 190,40 220,40 C250,40 265,114 300,114 C330,114 350,74 380,74 C410,74 425,114 450,114 C475,114 495,36 525,36 C555,36 575,112 600,112 L600,150 L0,150 Z"
        fill="url(#traffic-fill)"
      />
      <path
        d="M0,115 C30,108 45,62 75,62 C105,62 120,112 150,112 C175,112 190,40 220,40 C250,40 265,114 300,114 C330,114 350,74 380,74 C410,74 425,114 450,114 C475,114 495,36 525,36 C555,36 575,112 600,112"
        stroke="oklch(0.72 0.15 55)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrafficPanel() {
  return (
    <PanelShell label="AI Traffic · GA4" badge="Last 30 days">
      <div className="grid grid-cols-3 gap-2.5">
        {TRAFFIC_KPIS.map((tile) => (
          <div
            key={tile.k}
            className="rounded-xl border border-border bg-background/60 p-3"
          >
            <p className="label-mono text-[0.55rem] text-muted-foreground">
              {tile.k}
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span
                className="font-display text-xl text-foreground sm:text-2xl"
                style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
              >
                {tile.v}
              </span>
              {tile.d ? (
                <span className="text-[0.6rem] font-semibold text-emerald-700">
                  {tile.d}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-border bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            AI performance over time
          </p>
          <div className="flex items-center gap-0.5 rounded-full bg-secondary p-0.5 text-[0.55rem]">
            <span className="rounded-full px-2 py-0.5 text-muted-foreground">
              Revenue
            </span>
            <span className="rounded-full bg-card px-2 py-0.5 font-semibold text-foreground shadow-sm">
              Sessions
            </span>
          </div>
        </div>
        <TrafficChart />
      </div>

      <div className="mt-3 rounded-xl border border-border bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            Sessions by AI source
          </p>
          <span className="label-mono text-[0.55rem] text-muted-foreground/70">
            Sessions
          </span>
        </div>
        <div className="mt-2.5 space-y-2">
          {TRAFFIC_SOURCES.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className={cn("size-2 shrink-0 rounded-full", s.tone)} />
              <span className="w-20 shrink-0 text-xs font-medium text-foreground">
                {s.name}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn("h-full rounded-full", s.tone)}
                  style={{ width: `${s.share}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-xs tabular-nums text-foreground">
                {s.sessions}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PanelShell>
  );
}

/* ── Feature tabs ─────────────────────────────────────────────────────────── */

const TABS: FeatureTab[] = [
  {
    id: "strategy",
    label: "Strategy Engine",
    title: "From signals to a prioritized plan that proves itself",
    blurb:
      "The campaign-led loop: opportunities ranked by impact and effort, each backed by evidence — then verified live and measured for lift.",
    bullets: [
      "Opportunities by impact × effort",
      "Verified live, measured for lift",
      "Detector-driven findings",
      "Evidence behind every move",
    ],
    visual: <StrategyPanel />,
  },
  {
    id: "campaigns",
    label: "Campaigns",
    title: "Scheduled campaigns of unbiased prompts",
    blurb:
      "Auto-generate the buyer-intent questions your customers actually ask AI — then review, edit and schedule them.",
    bullets: [
      "Unbiased query generation",
      "Region & customer voice",
      "Review queue & scheduling",
      "ChatGPT, Gemini, Perplexity, Claude, Meta AI, Mistral",
    ],
    visual: <CampaignPanel />,
  },
  {
    id: "analytics",
    label: "Analytics & Share of Voice",
    title: "Your Share of Voice, measured over time",
    blurb:
      "See how often AI recommends you, how that trends, and how each engine answers about your brand.",
    bullets: [
      "Avg visibility & Share of Voice",
      "Top-1 / Top-3 / Top-5 presence",
      "Per-engine scorecards",
      "Sentiment & recommendation strength",
    ],
    visual: (
      <MockDashboard variant="overview" className="h-full border-0 shadow-none" />
    ),
  },
  {
    id: "citations",
    label: "Citations",
    title: "Own the sources AI trusts",
    blurb:
      "See which domains AI cites, where you're owned versus third-party, and where you're recommended but never cited.",
    bullets: [
      "Mentioned vs cited-only",
      "Owned vs third-party",
      "Top-cited domains",
      "Citation share over time",
    ],
    visual: (
      <MockDashboard variant="citations" className="h-full border-0 shadow-none" />
    ),
  },
  {
    id: "competitors",
    label: "Competitors",
    title: "Benchmark against named rivals",
    blurb:
      "Rank head-to-head against your real competitor set and see exactly where you win or lose the answer.",
    bullets: [
      "Ranked Share of Voice",
      "Top-1 / Top-3 presence",
      "Your named competitor set",
      "Per-query head-to-head",
    ],
    visual: (
      <MockDashboard
        variant="competitors"
        className="h-full border-0 shadow-none"
      />
    ),
  },
  {
    id: "traffic",
    label: "AI traffic (GA4)",
    title: "Prove it in real traffic",
    blurb:
      "Connect AI visibility to referral sessions and conversions by AI source, straight from your GA4 data.",
    bullets: [
      "AI referral traffic",
      "AI Traffic Share",
      "Conversions by source",
      "ChatGPT, Gemini, Perplexity, Claude, Meta AI, Mistral",
    ],
    visual: <TrafficPanel />,
  },
];

/* ── Detectors / signals grid ─────────────────────────────────────────────── */

type Detector = {
  icon: LucideIcon;
  title: string;
  body: string;
  severity: string;
  severityTone: string;
};

const DETECTORS: Detector[] = [
  {
    icon: TrendingDown,
    title: "Declining visibility",
    body: "Catch a sustained drop in how often AI recommends you before it costs you the answer.",
    severity: "Critical",
    severityTone: "bg-red-500/12 text-red-700",
  },
  {
    icon: Quote,
    title: "Citation displacement",
    body: "Spot when a third-party source overtakes your owned pages as the citation AI leans on.",
    severity: "Warning",
    severityTone: "bg-amber-500/15 text-amber-800",
  },
  {
    icon: EyeOff,
    title: "Source suppression",
    body: "Surface queries where you're recommended in the answer but never cited as the source.",
    severity: "Warning",
    severityTone: "bg-amber-500/15 text-amber-800",
  },
  {
    icon: Trophy,
    title: "Top-1 position loss",
    body: "Know the moment a competitor takes the first-named recommendation away from you.",
    severity: "Critical",
    severityTone: "bg-red-500/12 text-red-700",
  },
  {
    icon: ShieldAlert,
    title: "Authority gap",
    body: "Find the categories where rivals are seen as more authoritative in AI answers than you.",
    severity: "Info",
    severityTone: "bg-brand/10 text-accent",
  },
  {
    icon: CodeXml,
    title: "Missing structured data",
    body: "Pinpoint pages lacking the structured data that helps assistants ground answers on you.",
    severity: "Info",
    severityTone: "bg-brand/10 text-accent",
  },
];

const STATS = [
  {
    value: 6,
    label: "AI assistants monitored — ChatGPT, Gemini, Perplexity, Claude, Meta AI & Mistral",
  },
  {
    value: 6,
    label: "Detector types built to surface visibility, citation & ranking risks",
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
];

const FAQS: FaqItem[] = [
  {
    q: "How does HeyOtis generate prompts?",
    a: "Each campaign auto-generates unbiased, buyer-intent queries based on your category, region and customer voice — the questions real buyers ask AI. You review, edit and approve the set before it runs, then schedule it to repeat so visibility is tracked continuously.",
  },
  {
    q: "Can I track competitors?",
    a: "Yes. You define your named competitor set and HeyOtis benchmarks you head-to-head in AI answers — ranked Share of Voice, Top-1 and Top-3 presence, and per-query wins and losses so you can see exactly where rivals get recommended instead.",
  },
  {
    q: "Does HeyOtis connect to GA4?",
    a: "Yes. Connect your GA4 property and HeyOtis ties AI visibility to downstream impact — AI referral sessions, AI Traffic Share and conversions broken down by AI source, so you can prove the value to leadership.",
  },
  {
    q: "Which AI engines are supported?",
    a: "HeyOtis monitors ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral — the assistants most people use to research and compare brands. Every campaign runs across all six, and we add engines as adoption grows.",
  },
  {
    q: "What are citations and why do they matter?",
    a: "Citations are the sources an AI grounds its answer on. HeyOtis shows which domains get cited, whether they're owned or third-party, and where you're recommended but not cited — the citation gaps that, once closed, make AI more likely to trust and name you.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Features", href: "/features" },
        ])}
      />
      <JsonLd data={faqPageSchema(faqItemsToSchema(FAQS))} />

      {/* Page hero */}
      <section className="surface-cream relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, oklch(0.24 0.02 285 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.24 0.02 285 / 0.045) 1px, transparent 1px)",
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
                "radial-gradient(closest-side, oklch(0.68 0.1 280 / 0.18), transparent)",
            }}
          />
        </div>

        <Container className="relative pb-12 pt-28 sm:pt-32 md:pb-16 lg:pt-36">
          <Eyebrow>The platform</Eyebrow>
          <h1
            className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[1.0] tracking-[-0.03em] text-foreground"
            style={{ fontStretch: "80%", fontWeight: 800 }}
          >
            Everything you need to win the answer in{" "}
            <span className="text-accent">AI search</span>
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            data-speakable
          >
            HeyOtis runs scheduled campaigns of unbiased buyer-intent prompts
            across ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral, measures your Share of Voice,
            the citations AI trusts and how you rank against named competitors —
            surfaces the opportunities that matter most, and ties it to AI
            referral traffic in GA4.
          </p>
          <div className="mt-8">
            <BookCta nudge withArrow />
          </div>
        </Container>
      </section>

      {/* Feature tabs — inside the platform */}
      <Section surface="cream">
        <SectionHeading
          eyebrow="How HeyOtis works"
          title="Inside the platform"
          sub="One connected loop — measure where you stand across every assistant, benchmark the competition, own the citations AI trusts, act on what matters, and prove the impact."
          className="max-w-2xl"
        />
        <div className="mt-12">
          <FeatureTabs tabs={TABS} />
        </div>
      </Section>

      {/* Detectors / signals grid */}
      <Section surface="card">
        <SectionHeading
          eyebrow="Insights & detectors"
          title="Signals HeyOtis surfaces"
          sub="Purpose-built detectors are designed to surface visibility, citation and ranking risks by severity — so the openings that matter never slip past."
          className="max-w-2xl"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {DETECTORS.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.title}
                className="rounded-2xl border border-border bg-background/50 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-accent ring-1 ring-brand/15">
                    <Icon className="size-5" />
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[0.65rem] font-semibold",
                      d.severityTone,
                    )}
                  >
                    {d.severity}
                  </span>
                </div>
                <h3
                  className="mt-5 font-display text-xl text-foreground"
                  style={{ fontStretch: "85%", letterSpacing: "-0.01em" }}
                >
                  {d.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {d.body}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Coverage — animated beam */}
      <Section surface="cream">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Coverage"
              title="Across every assistant that matters"
              sub="Your customers ask ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral what to buy, compare and trust. Every HeyOtis campaign runs across all six — capturing how each one answers, who it recommends, and which sources it leans on."
            />
          </div>
          <AiSourceBeam />
        </div>
      </Section>

      {/* Stat band */}
      <Section surface="card">
        <SectionHeading
          align="center"
          eyebrow="At a glance"
          title="Built to measure what AI says about you"
          className="mx-auto max-w-3xl"
        />
        <div className="mt-14">
          <StatBand stats={STATS} />
        </div>
      </Section>

      {/* FAQ */}
      <Section surface="cream">
        <Faq
          items={FAQS}
          sub="How the platform measures, benchmarks and improves your brand's visibility in AI search."
        />
      </Section>

      <CtaBand secondary={{ label: "See pricing", href: "/pricing" }} />
    </>
  );
}
