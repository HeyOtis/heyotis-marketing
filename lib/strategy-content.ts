import {
  Crosshair,
  Gauge,
  ScanSearch,
  ListChecks,
  CircleCheck,
  TrendingUp,
  Activity,
  ClipboardList,
  Radar,
  Bot,
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
  /** Stages 5–6 are the differentiator nobody else closes. */
  differentiator?: boolean;
};

export const LOOP_STAGES: LoopStage[] = [
  {
    id: "define",
    n: 1,
    verb: "Define",
    title: "Scope the campaign",
    blurb:
      "Set the brand, market, competitors, personas and buying journeys that matter — the engine measures the questions real customers ask.",
    icon: Crosshair,
  },
  {
    id: "measure",
    n: 2,
    verb: "Measure",
    title: "See how AI answers",
    blurb:
      "Capture how every assistant interprets, compares and recommends you across the prompts that shape decisions.",
    icon: Gauge,
  },
  {
    id: "diagnose",
    n: 3,
    verb: "Diagnose",
    title: "Find the weak signals",
    blurb:
      "Deterministic detectors surface why you're absent, misrepresented or losing — each finding grounded in evidence.",
    icon: ScanSearch,
  },
  {
    id: "prioritize",
    n: 4,
    verb: "Prioritize",
    title: "Rank the moves",
    blurb:
      "Findings become a focused action plan — opportunities ranked by impact and effort, each backed by the evidence behind it.",
    icon: ListChecks,
  },
  {
    id: "verify",
    n: 5,
    verb: "Verify",
    title: "Confirm it shipped",
    blurb:
      "Detectors watch your surfaces and mark a move done the moment the change goes live — no self-reporting required.",
    icon: CircleCheck,
    differentiator: true,
  },
  {
    id: "prove",
    n: 6,
    verb: "Prove",
    title: "Measure the lift",
    blurb:
      "Track whether recommendation share actually moved on the real metric, with an immutable evidence trail — then feed it back in.",
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
    title: 'Own the "best for everyday" recommendation',
    impact: "High",
    effort: "Medium",
    measure: "ChatGPT recommendation share",
    signals: 4,
    why: "You're named in the answer but rarely first, and never as the cited source — assistants lean on a retailer page instead of yours.",
    doThis: [
      'Publish a comparison page targeting the "best everyday" buying question.',
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
  pre: "0.9%",
  post: "3.7%",
  preNum: 0.9,
  postNum: 3.7,
  deltaLabel: "+300%",
  windowDays: 30,
  evidence: "Measured across 64 tracked prompts · evidence trail attached",
};

/* ── Real proof (cleared — appears in the cofounder's website copy) ───────── */
export const HALENSTEIN = {
  brand: "Halenstein",
  market: "Australia",
  shareAfter: "3.7%",
  lift: "+300%",
  lede: "From near-zero to 3.7% AI recommendation share in Australia.",
  detail:
    "Halenstein started from near-zero presence in Australian AI recommendations. After benchmarking where the brand stood, diagnosing the gaps and improving the signals that mattered, recommendation share grew 300%. The result wasn't just more mentions — it was a clear view of where competitors were chosen instead, and what to do about it.",
} as const;
