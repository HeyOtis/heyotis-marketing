import {
  Gauge,
  ScanSearch,
  ListChecks,
  CircleCheck,
  TrendingUp,
  Activity,
  ClipboardList,
  Radar,
  Bot,
  MessageSquare,
  Terminal,
  LineChart,
  Globe,
  Users,
  type LucideIcon,
} from "lucide-react";

/* ── The self-improving loop (Prove feeds back into Measure) ─────────────── */
export type LoopStage = {
  id: string;
  n: number;
  verb: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  /** Stages 4–5 are the differentiator nobody else closes. */
  differentiator?: boolean;
};

export const LOOP_STAGES: LoopStage[] = [
  {
    id: "measure",
    n: 1,
    verb: "Measure",
    title: "See exactly how you show up",
    blurb:
      "Every assistant, every query in your campaign. Where you appear in the answer, how you're described, and who gets cited instead of you.",
    icon: Gauge,
  },
  {
    id: "diagnose",
    n: 2,
    verb: "Diagnose",
    title: "Find the reason, with evidence",
    blurb:
      "Detectors read your surfaces and the answers, and every finding traces to a fact you can click: the answer, the citation, the page, the date.",
    icon: ScanSearch,
  },
  {
    id: "prioritise",
    n: 3,
    verb: "Prioritise",
    title: "Get the short list that matters",
    blurb:
      "Ranked by impact and effort, scoped to a campaign, sized to get done. If we can't verify it, we don't recommend it.",
    icon: ListChecks,
  },
  {
    id: "verify",
    n: 4,
    verb: "Verify",
    title: "We watch the work land",
    blurb:
      "The engine re-checks your site until the change is live. Nobody has to tell us. If it slips later, you'll know that too.",
    icon: CircleCheck,
    differentiator: true,
  },
  {
    id: "prove",
    n: 5,
    verb: "Prove",
    title: "Measure the lift",
    blurb:
      "Visibility, referrals and conversions, tied back to the move that earned them.",
    icon: TrendingUp,
    differentiator: true,
  },
];

/* ── The four levels the engine operates at ──────────────────────────────── */
export type MaturityLevel = {
  id: string;
  level: string;
  tagline: string;
  blurb: string;
  icon: LucideIcon;
};

export const MATURITY_LEVELS: MaturityLevel[] = [
  {
    id: "diagnostic",
    level: "Diagnostic",
    tagline: "Here's what's happening",
    blurb:
      "Where you stand across every assistant, and the signals explaining why.",
    icon: Activity,
  },
  {
    id: "prescriptive",
    level: "Prescriptive",
    tagline: "Here's what to do about it",
    blurb:
      "A ranked, evidence-backed action plan — the moves with the best return first.",
    icon: ClipboardList,
  },
  {
    id: "predictive",
    level: "Predictive",
    tagline: "Here's what's about to happen",
    blurb:
      "Emerging prompts, drift and competitive risk surfaced before they cost you the answer.",
    icon: Radar,
  },
  {
    id: "autonomous",
    level: "Autonomous",
    tagline: "We've already done it for you",
    blurb:
      "The engine ships and verifies the fix, then proves it moved your recommendation share.",
    icon: Bot,
  },
];

/* ── Sample action plan (illustrative — mirrors the product's shape) ──────── */
export type Opportunity = {
  rank: number;
  title: string;
  impact: "High" | "Medium" | "Low";
  effort: "High" | "Medium" | "Low";
  measure: string;
  signals: number;
  why: string;
  doThis: string[];
  expect: string;
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    rank: 1,
    title: 'Own the “best for everyday” recommendation',
    impact: "High",
    effort: "Medium",
    measure: "ChatGPT recommendation share",
    signals: 4,
    why: "You're named in the answer but rarely first, and never as the cited source — assistants lean on a retailer page instead of yours.",
    doThis: [
      'Publish a comparison page targeting the “best everyday” buying question.',
      "Add Product and FAQ structured data so assistants can ground on you.",
      "Reclaim the citation with first-party proof points and reviews.",
    ],
    expect: "Move from mentioned to first-named on the everyday-use prompts.",
  },
  {
    rank: 2,
    title: "Turn recognition into top placement",
    impact: "High",
    effort: "Medium",
    measure: "Top-3 presence",
    signals: 3,
    why: "Strong brand awareness isn't translating into Top-3 recommendations on your highest-intent prompts.",
    doThis: [
      "Strengthen category language on your core landing pages.",
      "Close the proof gaps competitors are framed more clearly on.",
    ],
    expect: "Climb into Top-3 on the prompts that drive consideration.",
  },
  {
    rank: 3,
    title: "Win back the retailer citation layer",
    impact: "Medium",
    effort: "Low",
    measure: "Owned citation share",
    signals: 2,
    why: "A third-party source has overtaken your owned pages as the citation assistants trust.",
    doThis: [
      "Refresh the stale page the assistant is citing instead of you.",
      "Add the structured data the retailer page already has.",
    ],
    expect: "Reclaim the owned citation on your branded queries.",
  },
];

/* ── Real attribution sample (illustrative numbers, real mechanism) ───────── */
export type Attribution = {
  metric: string;
  pre: string;
  post: string;
  preNum: number;
  postNum: number;
  deltaLabel: string;
  windowDays: number;
  evidence: string;
};

export const ATTRIBUTION: Attribution = {
  metric: "ChatGPT recommendation share",
  pre: "1.4%",
  post: "4.9%",
  preNum: 1.4,
  postNum: 4.9,
  deltaLabel: "+250%",
  windowDays: 30,
  evidence: "Illustrative · 30-day window across tracked prompts, evidence trail attached",
};

/* ── Real proof (cleared — appears in the cofounder's website copy) ───────── */
export const HALLENSTEINS = {
  brand: "Hallensteins",
  market: "Australia",
  shareAfter: "3.7%",
  lift: "+300%",
  lede: "From near-zero to 3.7% AI recommendation share in Australia.",
  detail:
    "Hallensteins started from near-zero presence in Australian AI recommendations. After benchmarking where the brand stood, diagnosing the gaps and improving the signals that mattered, recommendation share grew 300%. The result wasn't just more mentions — it was a clear view of where competitors were chosen instead, and what to do about it.",
} as const;

/* ── The five signal streams the engine ingests ──────────────────────────── */
export type SignalStream = {
  id: string;
  name: string;
  /** Short label used inside the intake diagram nodes. */
  short: string;
  blurb: string;
  icon: LucideIcon;
  /** The stream that powers log-level attribution — visually emphasized. */
  differentiator?: boolean;
};

export const SIGNAL_STREAMS: SignalStream[] = [
  {
    id: "answers",
    name: "AI answer sampling",
    short: "AI answers",
    blurb:
      "How six assistants answer, cite and rank you across the prompts that matter.",
    icon: MessageSquare,
  },
  {
    id: "logs",
    name: "AI traffic & bot logs",
    short: "Bot logs",
    blurb:
      "GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User — which pages they fetch, and the humans assistants send you.",
    icon: Terminal,
    differentiator: true,
  },
  {
    id: "analytics",
    name: "Site analytics",
    short: "Analytics",
    blurb:
      "Sessions, conversions and landing pages, so lift ties to business outcomes.",
    icon: LineChart,
  },
  {
    id: "surfaces",
    name: "Your surfaces",
    short: "Your site",
    blurb:
      "Crawls of your own site — structured data, freshness, what actually shipped.",
    icon: Globe,
  },
  {
    id: "competitive",
    name: "Competitive signals",
    short: "Competitors",
    blurb: "Who wins the answer when you don't, and why.",
    icon: Users,
  },
];

/* ── Sample ingest feed (illustrative — mirrors the product's log ingestion) ─ */
export type LogLine = {
  tag: string;
  text: string;
  kind: "bot" | "referral" | "session";
};

export const LOG_LINES: LogLine[] = [
  { tag: "GPTBot", text: "GET /compare/best-everyday · 200", kind: "bot" },
  { tag: "PerplexityBot", text: "GET /compare/best-everyday · 200", kind: "bot" },
  { tag: "ClaudeBot", text: "GET /products/everyday · 200", kind: "bot" },
  { tag: "referral", text: "chatgpt.com → /compare/best-everyday", kind: "referral" },
  { tag: "session", text: "4 pages · 6m 12s · demo booked", kind: "session" },
  { tag: "ChatGPT-User", text: "GET /compare/best-everyday · 200", kind: "bot" },
  { tag: "referral", text: "perplexity.ai → /products/everyday", kind: "referral" },
  { tag: "session", text: "3 pages · 4m 05s · signup", kind: "session" },
];

/* ── Compounding share across loop cycles (illustrative numbers) ─────────── */
export type CompoundingPoint = {
  cycle: string;
  /** AI recommendation share, % */
  share: number;
  note: string;
};

export const COMPOUNDING_POINTS: CompoundingPoint[] = [
  { cycle: "Cycle 1", share: 1.2, note: "Baseline measured" },
  { cycle: "Cycle 2", share: 2.1, note: "Comparison page proven" },
  { cycle: "Cycle 3", share: 3.4, note: "Citation moves reweighted" },
  { cycle: "Cycle 4", share: 4.9, note: "Schema moves prioritised" },
];
