# Strategy Engine Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-center the HeyOtis marketing site on the Strategy Engine — a campaign-led, self-improving feedback loop with real attribution — via a new flagship `/strategy-engine` page plus home/features/llms re-points, new loop/attribution/opportunity visuals, real Halenstein proof, 6 monitored engines, and recommendation-share vocabulary.

**Architecture:** Static-first Next.js 16 App Router marketing pages. New designed visual components are server components that use the existing `Reveal` primitive (already `"use client"` + reduced-motion safe) for entrance animation — no new client components unless required. All strategy copy/data lives in one module (`lib/strategy-content.ts`) so the flagship page, home, and visuals stay DRY. Follows the audit-pass patterns: `useIsomorphicReducedMotion`, `useInView` gating, `useMediaQuery`, US spelling, `buildMetadata` + JSON-LD on every page.

**Tech Stack:** Next.js 16, React 19, Tailwind v4 (CSS-first tokens in `app/globals.css`), `motion/react`, lucide-react, `@lobehub/icons` (5.10.0), shadcn primitives.

## Global Constraints

- **No unit-test framework exists** (static marketing site). The per-task verification gate is `pnpm typecheck && pnpm lint && pnpm build` (all green; new route prerenders) **plus** the visual checks listed in each task. Do NOT add a test runner (YAGNI).
- **Framing:** present the full engine — including Predictive and Autonomous — as **current capability, present tense**. (Deliberate; 3–4 month sales cycle.)
- **Honesty rule:** state capabilities present-tense, but never fabricate specific customer proof. Only **Halenstein** is real, named proof. Sample dashboards/data stay labeled *illustrative*.
- **Primary CTA everywhere:** "Book a call" via the existing `BookCta` (routes to `/contact#book`). Never imply a self-serve "scorecard" product.
- **Engines = 6:** ChatGPT, Gemini, Perplexity, Claude, Meta AI, Mistral. (`@lobehub/icons` exports `OpenAI, Gemini, Perplexity, Claude, MetaAI, Mistral` — verified present.)
- **Spelling:** US English (prioritize, optimize, behavior, analyze, programs).
- **Vocabulary:** "recommendation share" is primary (keep "Share of Voice" as secondary synonym). Mocks mirror real product vocabulary verbatim: "Your action plan", opportunity cards, "Why this / What to do / What you'll see", "Measured by {metric}", "Based on N signals", and *"Composed by the strategy engine from deterministic signals above. The wording is generated; the evidence is not."*
- **Canonical loop (6 stages):** Define → Measure → Diagnose → Prioritize → Verify → Prove (Prove feeds back into Measure). Stages 5–6 (Verify, Prove) are the differentiator.
- **Spec:** `docs/superpowers/specs/2026-06-30-strategy-engine-positioning-design.md`.
- **Branch:** work on `feat/strategy-engine-positioning` (already checked out). Commit after each task.

---

## File Structure

**Create:**
- `lib/strategy-content.ts` — single source of truth for loop stages, maturity levels, sample opportunities, attribution sample, Halenstein proof. (Task 2)
- `components/marketing/visuals/StrategyLoop.tsx` — the 6-stage self-improving loop diagram. (Task 3)
- `components/marketing/visuals/OpportunityBoard.tsx` — mock action-plan board mirroring the product. (Task 4)
- `components/marketing/visuals/AttributionPanel.tsx` — before→after recommendation-share proof tile. (Task 5)
- `components/marketing/sections/MaturityLevels.tsx` — the four-level explainer. (Task 6)
- `components/marketing/sections/ProofHalenstein.tsx` — named case-study stat block. (Task 7)
- `app/(marketing)/strategy-engine/page.tsx` — flagship page assembling all of the above. (Task 8)

**Modify:**
- `components/marketing/visuals/AiSourceLogos.tsx` — add Meta AI + Mistral (Task 1).
- `components/marketing/sections/Hero.tsx` — 6 engines + new headline/sub (Task 1 + Task 10).
- `app/(marketing)/page.tsx` — STATS/FAQ engine count (Task 1); how-it-works swap + Halenstein + de-illustrative STATS (Task 10).
- `app/(marketing)/features/page.tsx` — STATS engine count (Task 1); reorder TABS strategy-first + deep-link (Task 11).
- `lib/site.ts` — `description` (6 engines); add "Strategy Engine" nav entry (Task 1 + Task 9).
- `app/sitemap.ts` — add `/strategy-engine` (Task 9).
- `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts` — closed-loop engine rewrite + 6 engines + Halenstein (Task 12).

---

### Task 1: Six engines, site-wide

**Files:**
- Modify: `components/marketing/visuals/AiSourceLogos.tsx`
- Modify: `components/marketing/sections/Hero.tsx:46-49`
- Modify: `app/(marketing)/page.tsx:20-42, 44-69`
- Modify: `app/(marketing)/features/page.tsx:593-597`
- Modify: `lib/site.ts:21-22`

**Interfaces:**
- Produces: `AI_SOURCES` now has 6 entries (adds `metaai`, `mistral`). Other tasks rely on `AiSourceLogos` rendering 6.

- [ ] **Step 1: Add Meta AI + Mistral to the logo source list**

Replace the import and `AI_SOURCES` array in `components/marketing/visuals/AiSourceLogos.tsx`:

```tsx
import { OpenAI, Claude, Gemini, Perplexity, MetaAI, Mistral } from "@lobehub/icons";
import { cn } from "@/lib/utils";

type LobeIcon = React.ComponentType<{ size?: number }>;

/** The AI engines HeyOtis monitors. Order is intentional. */
export const AI_SOURCES: Array<{
  key: string;
  name: string;
  Icon: LobeIcon;
}> = [
  { key: "chatgpt", name: "ChatGPT", Icon: OpenAI },
  { key: "gemini", name: "Gemini", Icon: Gemini },
  { key: "perplexity", name: "Perplexity", Icon: Perplexity },
  { key: "claude", name: "Claude", Icon: Claude },
  { key: "metaai", name: "Meta AI", Icon: MetaAI },
  { key: "mistral", name: "Mistral", Icon: Mistral },
];
```

(Leave the `AiSourceLogos` function body unchanged.)

- [ ] **Step 2: Update the Hero rotating engines**

In `components/marketing/sections/Hero.tsx`, replace the `words` prop (line 47):

```tsx
          <RotatingWord
            words={["ChatGPT", "Gemini", "Perplexity", "Claude", "Meta AI", "Mistral"]}
            className="min-w-[6rem] justify-items-start font-semibold text-foreground"
          />
```

- [ ] **Step 3: Update home STATS + FAQ engine references**

In `app/(marketing)/page.tsx`, change the first STATS entry label (line 23) and the three FAQ answers that list four engines so they read six. Replace `value: 4,` / label with:

```tsx
  {
    value: 6,
    label: "AI assistants monitored — ChatGPT, Gemini, Perplexity, Claude, Meta AI & Mistral",
  },
```

In the FAQS array, replace every occurrence of `ChatGPT, Claude, Gemini and Perplexity` with `ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral`, and in the "Which AI assistants" answer replace `Today HeyOtis monitors ChatGPT, Claude, Gemini and Perplexity` with `HeyOtis monitors ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral`.

- [ ] **Step 4: Update features STATS engine count**

In `app/(marketing)/features/page.tsx`, the STATS entry at line 594-597 currently reads `value: 4, label: "AI assistants monitored — ChatGPT, Claude, Gemini & Perplexity"`. Replace with:

```tsx
  {
    value: 6,
    label: "AI assistants monitored — ChatGPT, Gemini, Perplexity, Claude, Meta AI & Mistral",
  },
```

Also update the two `bullets` arrays that list `"ChatGPT, Claude, Gemini, Perplexity"` (lines 453, 532) to `"ChatGPT, Gemini, Perplexity, Claude, Meta AI, Mistral"`.

- [ ] **Step 5: Update site description**

In `lib/site.ts`, replace the `description` (lines 21-22):

```tsx
  description:
    "See how ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral recommend your brand — and what to do about it. HeyOtis measures your AI recommendation share, citations and competitive rank.",
```

- [ ] **Step 6: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all green. (If typecheck fails on `MetaAI`/`Mistral`, confirm the export names with `grep -rl "MetaAI\|Mistral" node_modules/.pnpm/@lobehub+icons*/node_modules/@lobehub/icons/es/` — the folders `MetaAI/` and `Mistral/` exist, so the named exports resolve.)
Visual: `pnpm dev`, open `/` — the hero logo strip shows **6** logos; the rotating word cycles 6 engines.

- [ ] **Step 7: Commit**

```bash
git add components/marketing/visuals/AiSourceLogos.tsx components/marketing/sections/Hero.tsx "app/(marketing)/page.tsx" "app/(marketing)/features/page.tsx" lib/site.ts
git commit -m "feat(strategy): show six monitored engines site-wide (+ Meta AI, Mistral)"
```

---

### Task 2: Strategy content module

**Files:**
- Create: `lib/strategy-content.ts`

**Interfaces:**
- Produces:
  - `type LoopStage = { id: string; n: number; verb: string; title: string; blurb: string; icon: LucideIcon; differentiator?: boolean }`
  - `LOOP_STAGES: LoopStage[]` (6 entries)
  - `type MaturityLevel = { id: string; level: string; tagline: string; blurb: string; icon: LucideIcon }`
  - `MATURITY_LEVELS: MaturityLevel[]` (4 entries)
  - `type Opportunity = { rank: number; title: string; impact: "High" | "Medium" | "Low"; effort: "High" | "Medium" | "Low"; measure: string; signals: number; why: string; doThis: string[]; expect: string }`
  - `OPPORTUNITIES: Opportunity[]` (3 entries)
  - `type Attribution = { metric: string; pre: string; post: string; preNum: number; postNum: number; deltaLabel: string; windowDays: number; evidence: string }`
  - `ATTRIBUTION: Attribution`
  - `HALENSTEIN: { brand: string; market: string; shareAfter: string; lift: string; lede: string; detail: string }`

- [ ] **Step 1: Create the module**

Create `lib/strategy-content.ts`:

```ts
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
    title: "Own the “best for everyday” recommendation",
    impact: "High",
    effort: "Medium",
    measure: "ChatGPT recommendation share",
    signals: 4,
    why: "You're named in the answer but rarely first, and never as the cited source — assistants lean on a retailer page instead of yours.",
    doThis: [
      "Publish a comparison page targeting the “best everyday” buying question.",
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
```

- [ ] **Step 2: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: green (all lucide icon names above exist in lucide-react: `Crosshair, Gauge, ScanSearch, ListChecks, CircleCheck, TrendingUp, Activity, ClipboardList, Radar, Bot`).

- [ ] **Step 3: Commit**

```bash
git add lib/strategy-content.ts
git commit -m "feat(strategy): add shared strategy-content data module"
```

---

### Task 3: StrategyLoop visual

**Files:**
- Create: `components/marketing/visuals/StrategyLoop.tsx`

**Interfaces:**
- Consumes: `LOOP_STAGES` from `lib/strategy-content.ts`; `Reveal` from `@/components/marketing/primitives/Reveal`.
- Produces: `StrategyLoop` (default-styled, accepts `className?`). Server component (uses `Reveal` for entrance — no client hooks of its own).

- [ ] **Step 1: Create the component**

Create `components/marketing/visuals/StrategyLoop.tsx`:

```tsx
import { ArrowRight, RefreshCw } from "lucide-react";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { LOOP_STAGES } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/**
 * The self-improving Strategy Engine loop. Six stages laid out as a connected
 * sequence; the last two (Verify, Prove) are highlighted as the differentiator,
 * and a "loops back" caption makes the compounding cycle explicit. Static markup
 * with per-card Reveal entrance (reduced-motion safe).
 */
export function StrategyLoop({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LOOP_STAGES.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <Reveal key={stage.id} delay={i * 0.06} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-6 transition-colors",
                  stage.differentiator
                    ? "border-brand/30 bg-brand/[0.06]"
                    : "border-border bg-card",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl ring-1",
                      stage.differentiator
                        ? "bg-brand/15 text-accent ring-brand/20"
                        : "bg-brand/10 text-accent ring-brand/15",
                    )}
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="label-mono text-xs text-muted-foreground">
                    {String(stage.n).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                  <span className="text-accent">{stage.verb}.</span>{" "}
                  {stage.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {stage.blurb}
                </p>
                {stage.differentiator ? (
                  <span className="label-mono mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[0.6rem] text-accent">
                    What others skip
                  </span>
                ) : null}
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.4}>
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <RefreshCw className="size-4 text-accent" aria-hidden />
          <span>
            <span className="font-medium text-foreground">Prove</span> feeds back
            into <span className="font-medium text-foreground">Measure</span> —
            every campaign compounds.
          </span>
          <ArrowRight className="size-4 text-accent" aria-hidden />
        </p>
      </Reveal>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: green. (`ArrowRight`, `RefreshCw` exist in lucide-react.)

- [ ] **Step 3: Commit**

```bash
git add components/marketing/visuals/StrategyLoop.tsx
git commit -m "feat(strategy): add StrategyLoop diagram"
```

---

### Task 4: OpportunityBoard visual

**Files:**
- Create: `components/marketing/visuals/OpportunityBoard.tsx`

**Interfaces:**
- Consumes: `OPPORTUNITIES`, `type Opportunity` from `lib/strategy-content.ts`.
- Produces: `OpportunityBoard` (accepts `className?`). Static server component mirroring the product's action-plan UI vocabulary.

- [ ] **Step 1: Create the component**

Create `components/marketing/visuals/OpportunityBoard.tsx`:

```tsx
import { CircleCheck, Shield } from "lucide-react";
import { OPPORTUNITIES, type Opportunity } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

const IMPACT_DOT: Record<Opportunity["impact"], string> = {
  High: "bg-brand",
  Medium: "bg-amber-500",
  Low: "bg-muted-foreground",
};

/**
 * Illustrative "Your action plan" board — mirrors the product's Strategy Engine:
 * ranked opportunities with impact × effort, the metric each is measured by, and
 * the underlying signal count. The top opportunity is shown expanded with the
 * product's drawer sections (Why this / What to do / What you'll see).
 */
export function OpportunityBoard({ className }: { className?: string }) {
  const [top, ...rest] = OPPORTUNITIES;

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-card p-5 sm:p-6",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            Strategy Engine
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            Your action plan
          </h3>
          <p className="text-sm text-muted-foreground">
            {OPPORTUNITIES.length} opportunities to focus on this month
          </p>
        </div>
        <span className="label-mono shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[0.6rem] text-accent">
          Impact × Effort
        </span>
      </div>

      {/* Expanded top opportunity */}
      <div className="mt-5 rounded-xl border border-brand/25 bg-brand/[0.05] p-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-brand/15 text-[0.7rem] font-semibold text-accent">
            {top.rank}
          </span>
          <span className="label-mono text-[0.6rem] text-accent">
            Highest priority
          </span>
        </div>
        <h4 className="mt-3 text-sm font-semibold text-foreground">
          {top.title}
        </h4>

        <div className="mt-3 flex flex-wrap gap-2 text-[0.7rem]">
          <Chip dot={IMPACT_DOT[top.impact]}>{top.impact} impact</Chip>
          <Chip dot="bg-muted-foreground">{top.effort} effort</Chip>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-muted-foreground">
            <CircleCheck className="size-3 text-accent" aria-hidden />
            Measured by {top.measure}
          </span>
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="label-mono text-[0.6rem] text-muted-foreground">
              Why this
            </dt>
            <dd className="mt-1 text-xs leading-relaxed text-foreground/80">
              {top.why}
            </dd>
          </div>
          <div>
            <dt className="label-mono text-[0.6rem] text-muted-foreground">
              What to do
            </dt>
            <dd className="mt-1">
              <ol className="flex flex-col gap-1 text-xs leading-relaxed text-foreground/80">
                {top.doThis.map((step, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-accent">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </dd>
          </div>
        </dl>

        <p className="mt-3 border-t border-brand/15 pt-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            What you&apos;ll see:
          </span>{" "}
          {top.expect}
        </p>
        <p className="mt-2 label-mono text-[0.6rem] text-muted-foreground">
          Based on {top.signals} signals
        </p>
      </div>

      {/* Remaining opportunities (compact) */}
      <ul className="mt-3 flex flex-col gap-2">
        {rest.map((o) => (
          <li
            key={o.rank}
            className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.7rem] font-semibold text-foreground/70">
              {o.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                {o.title}
              </p>
              <p className="label-mono text-[0.6rem] text-muted-foreground">
                Measured by {o.measure} · {o.signals} signals
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className={cn("size-2 rounded-full", IMPACT_DOT[o.impact])} />
              <span className="text-[0.65rem] text-muted-foreground">
                {o.impact}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Honesty footer (verbatim product line) */}
      <p className="mt-4 flex items-start gap-2 border-t border-border pt-3 text-[0.7rem] leading-relaxed text-muted-foreground">
        <Shield className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
        Composed by the strategy engine from deterministic signals above. The
        wording is generated; the evidence is not.
      </p>
    </div>
  );
}

function Chip({ dot, children }: { dot: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2 py-0.5 text-muted-foreground">
      <span className={cn("size-2 rounded-full", dot)} />
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: green.

- [ ] **Step 3: Commit**

```bash
git add components/marketing/visuals/OpportunityBoard.tsx
git commit -m "feat(strategy): add OpportunityBoard mock"
```

---

### Task 5: AttributionPanel visual

**Files:**
- Create: `components/marketing/visuals/AttributionPanel.tsx`

**Interfaces:**
- Consumes: `ATTRIBUTION` from `lib/strategy-content.ts`.
- Produces: `AttributionPanel` (accepts `className?`). Static; before→after bars sized from `preNum`/`postNum`.

- [ ] **Step 1: Create the component**

Create `components/marketing/visuals/AttributionPanel.tsx`:

```tsx
import { ArrowUpRight, Shield } from "lucide-react";
import { ATTRIBUTION } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/**
 * Real-attribution proof tile: before → after on the actual metric over a
 * window, with the delta and an evidence line. Bars are sized from the sample
 * values relative to the post value. Illustrative numbers, real mechanism.
 */
export function AttributionPanel({ className }: { className?: string }) {
  const { metric, pre, post, preNum, postNum, deltaLabel, windowDays, evidence } =
    ATTRIBUTION;
  const max = Math.max(preNum, postNum);
  const prePct = Math.round((preNum / max) * 100);
  const postPct = Math.round((postNum / max) * 100);

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-card p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            Attribution · {windowDays}-day window
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">
            {metric}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-sm font-semibold text-accent">
          <ArrowUpRight className="size-4" aria-hidden />
          {deltaLabel}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Bar label="Before" value={pre} pct={prePct} tone="muted" />
        <Bar label="After" value={post} pct={postPct} tone="brand" />
      </div>

      <p className="mt-6 flex items-start gap-2 border-t border-border pt-3 text-[0.7rem] leading-relaxed text-muted-foreground">
        <Shield className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
        {evidence}
      </p>
    </div>
  );
}

function Bar({
  label,
  value,
  pct,
  tone,
}: {
  label: string;
  value: string;
  pct: number;
  tone: "muted" | "brand";
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="label-mono text-[0.6rem] text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            tone === "brand" ? "text-accent" : "text-muted-foreground",
          )}
        >
          {value}
        </span>
      </div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "brand" ? "bg-accent" : "bg-muted-foreground/40",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: green.

- [ ] **Step 3: Commit**

```bash
git add components/marketing/visuals/AttributionPanel.tsx
git commit -m "feat(strategy): add AttributionPanel proof tile"
```

---

### Task 6: MaturityLevels section component

**Files:**
- Create: `components/marketing/sections/MaturityLevels.tsx`

**Interfaces:**
- Consumes: `MATURITY_LEVELS` from `lib/strategy-content.ts`; `Reveal`.
- Produces: `MaturityLevels` (accepts `className?`). Renders the 4-level ladder grid.

- [ ] **Step 1: Create the component**

Create `components/marketing/sections/MaturityLevels.tsx`:

```tsx
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { MATURITY_LEVELS } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/**
 * The four levels the engine operates at, as a left-to-right ladder.
 * All present tense per the positioning decision.
 */
export function MaturityLevels({ className }: { className?: string }) {
  return (
    <div
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
    >
      {MATURITY_LEVELS.map((level, i) => {
        const Icon = level.icon;
        return (
          <Reveal key={level.id} delay={i * 0.06} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-accent ring-1 ring-brand/15">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span className="label-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                {level.level}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent">
                {level.tagline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {level.blurb}
              </p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: green.

- [ ] **Step 3: Commit**

```bash
git add components/marketing/sections/MaturityLevels.tsx
git commit -m "feat(strategy): add MaturityLevels ladder"
```

---

### Task 7: ProofHalenstein section component

**Files:**
- Create: `components/marketing/sections/ProofHalenstein.tsx`

**Interfaces:**
- Consumes: `HALENSTEIN` from `lib/strategy-content.ts`.
- Produces: `ProofHalenstein` (accepts `className?`). Named case-study stat block. Text-only (no logo asset yet).

- [ ] **Step 1: Create the component**

Create `components/marketing/sections/ProofHalenstein.tsx`:

```tsx
import { Quote } from "lucide-react";
import { HALENSTEIN } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/**
 * Real, named proof. Text-first (logo asset optional/later). The +300% here is
 * an attributed result, not illustrative.
 */
export function ProofHalenstein({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[2rem] border border-brand/20 bg-brand/[0.06] p-8 sm:p-12",
        className,
      )}
    >
      <Quote aria-hidden className="size-8 text-accent/70" strokeWidth={1.5} />
      <blockquote
        className="mt-5 max-w-3xl font-display text-2xl leading-snug tracking-tight text-foreground sm:text-3xl"
        style={{ fontStretch: "85%" }}
      >
        {HALENSTEIN.lede}
      </blockquote>
      <figcaption className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {HALENSTEIN.detail}
      </figcaption>
      <div className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-t border-brand/15 pt-6">
        <Stat value={HALENSTEIN.lift} label="AI recommendation share" />
        <Stat
          value={HALENSTEIN.shareAfter}
          label={`Recommendation share in ${HALENSTEIN.market}`}
        />
        <Stat value={HALENSTEIN.brand} label="Apparel brand" />
      </div>
    </figure>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p
        className="font-display text-3xl text-foreground sm:text-4xl"
        style={{ fontStretch: "80%", fontWeight: 800 }}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: green.

- [ ] **Step 3: Commit**

```bash
git add components/marketing/sections/ProofHalenstein.tsx
git commit -m "feat(strategy): add Halenstein proof block"
```

---

### Task 8: Flagship `/strategy-engine` page

**Files:**
- Create: `app/(marketing)/strategy-engine/page.tsx`

**Interfaces:**
- Consumes: `Container`, `Section`, `SectionHeading`, `Eyebrow`, `BookCta`, `Reveal`, `AiSourceLogos`, `JsonLd`, `buildMetadata`, `breadcrumbSchema`, and Task 3–7 components.

- [ ] **Step 1: Create the page**

Create `app/(marketing)/strategy-engine/page.tsx`:

```tsx
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
import { MaturityLevels } from "@/components/marketing/sections/MaturityLevels";
import { ProofHalenstein } from "@/components/marketing/sections/ProofHalenstein";
import { CtaBand } from "@/components/marketing/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

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

      {/* 3 — The loop */}
      <Section surface="cream" id="loop">
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

      {/* 4 — Four levels */}
      <Section surface="card">
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

      {/* 5 — The action plan */}
      <Section surface="cream">
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
          <Eyebrow className="justify-center">Where this is heading</Eyebrow>
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
```

- [ ] **Step 2: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: green; build output lists `/strategy-engine` as a prerendered route.
Visual: `pnpm dev`, open `/strategy-engine` — all 10 sections render top-to-bottom; the loop shows 6 stages with Verify/Prove highlighted; OpportunityBoard + AttributionPanel render; Halenstein proof shows; CTA at the bottom. Toggle "Reduce motion" in DevTools rendering — content still fully visible.

- [ ] **Step 3: Commit**

```bash
git add "app/(marketing)/strategy-engine/page.tsx"
git commit -m "feat(strategy): add flagship /strategy-engine page"
```

---

### Task 9: Nav + sitemap wiring

**Files:**
- Modify: `lib/site.ts:33-38` (nav)
- Modify: `app/sitemap.ts:10-16`

**Interfaces:**
- Consumes: the `/strategy-engine` route from Task 8.

- [ ] **Step 1: Add the nav entry**

In `lib/site.ts`, update the `nav` array so Strategy Engine leads:

```tsx
  nav: [
    { href: "/strategy-engine", label: "Strategy Engine" },
    { href: "/features", label: "Product" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Resources" },
    { href: "/about", label: "About" },
  ],
```

- [ ] **Step 2: Add the sitemap entry**

In `app/sitemap.ts`, add to `STATIC_ROUTES` (after the `/` entry) and bump `STATIC_LAST_MODIFIED`:

```tsx
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/strategy-engine", changeFrequency: "monthly", priority: 0.95 },
  { path: "/features", changeFrequency: "monthly", priority: 0.9 },
```

```tsx
const STATIC_LAST_MODIFIED = "2026-06-30";
```

- [ ] **Step 3: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: green.
Visual: `pnpm dev` — the top nav shows "Strategy Engine" first and it links to `/strategy-engine`; open `/sitemap.xml` and confirm the `/strategy-engine` URL is present.

- [ ] **Step 4: Commit**

```bash
git add lib/site.ts app/sitemap.ts
git commit -m "feat(strategy): add Strategy Engine to nav + sitemap"
```

---

### Task 10: Home page re-point

**Files:**
- Modify: `components/marketing/sections/Hero.tsx:34-59`
- Modify: `app/(marketing)/page.tsx:5-7, 20-42, 95-106, 122-141`

**Interfaces:**
- Consumes: `StrategyLoop` (Task 3), `ProofHalenstein` (Task 7), `HALENSTEIN` (Task 2).

- [ ] **Step 1: Re-point the hero copy at the loop/proof**

In `components/marketing/sections/Hero.tsx`, replace the eyebrow, `h1`, and lede paragraph (lines 34, 36-42, 52-59) — keep the RotatingWord block from Task 1:

```tsx
        <p className="label-mono text-accent">The Strategy Engine for AI search</p>

        <h1
          className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] tracking-[-0.03em] text-foreground"
          style={{ fontStretch: "75%", fontWeight: 800 }}
        >
          See how AI recommends your brand —{" "}
          <span className="text-accent">then prove you changed it.</span>
        </h1>
```

```tsx
        <p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          data-speakable
        >
          HeyOtis measures how AI assistants recommend you, finds the moves that
          grow your recommendation share, and proves the lift — a campaign-led
          Strategy Engine, not another dashboard.
        </p>
```

- [ ] **Step 2: Swap the "How it works" pillars for the loop**

In `app/(marketing)/page.tsx`, update the import (line 7) and the "How it works" section (lines 95-106). Replace the `PillarBento` import:

```tsx
import { StrategyLoop } from "@/components/marketing/visuals/StrategyLoop";
```

Replace the how-it-works `Section` block:

```tsx
      {/* How it works — the loop */}
      <Section surface="cream">
        <SectionHeading
          eyebrow="How it works"
          title="A campaign-led loop that closes itself"
          sub="Measure where you stand, diagnose the gaps, prioritize the moves — then verify they shipped and prove your recommendation share moved."
          className="max-w-2xl"
        />
        <div className="mt-12">
          <StrategyLoop />
        </div>
        <div className="mt-10">
          <a
            href="/strategy-engine"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Go deeper on the Strategy Engine →
          </a>
        </div>
      </Section>
```

(The `PillarBento` import on line 7 is now unused — remove it. `PillarBento.tsx` stays in the repo for potential reuse.)

- [ ] **Step 3: De-illustrative the proof stat + add Halenstein**

In `app/(marketing)/page.tsx`, update the second STATS entry (lines 25-31) to the real attributed number, and import + render `ProofHalenstein` in the "What you get" area. Replace the STATS entry:

```tsx
  {
    value: 300,
    prefix: "+",
    suffix: "%",
    label: "AI recommendation share lift — Halenstein, Australia",
    customer: "Halenstein",
  },
```

Add the import:

```tsx
import { ProofHalenstein } from "@/components/marketing/sections/ProofHalenstein";
```

Add a proof Section immediately before the FAQ section (before the `{/* FAQ */}` block):

```tsx
      {/* Proof */}
      <Section surface="card">
        <SectionHeading
          align="center"
          eyebrow="Proof"
          title="AI presence can be improved — and measured"
          className="mx-auto max-w-2xl"
        />
        <Reveal className="mt-10">
          <ProofHalenstein />
        </Reveal>
      </Section>
```

Add the `Reveal` import to the page if not present:

```tsx
import { Reveal } from "@/components/marketing/primitives/Reveal";
```

- [ ] **Step 4: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: green; no "unused import" lint error (PillarBento removed).
Visual: `/` hero reads the new headline; "How it works" shows the 6-stage loop with a link to `/strategy-engine`; a Halenstein proof block appears before the FAQ.

- [ ] **Step 5: Commit**

```bash
git add components/marketing/sections/Hero.tsx "app/(marketing)/page.tsx"
git commit -m "feat(strategy): re-point home hero + how-it-works at the loop; add Halenstein proof"
```

---

### Task 11: Features page — Strategy Engine first

**Files:**
- Modify: `app/(marketing)/features/page.tsx:442-536` (TABS order + strategy tab copy).

**Interfaces:**
- Consumes: nothing new. (`/strategy-engine` is reachable from `/features` via the global nav added in Task 9, so the tab itself carries no inline URL.)

- [ ] **Step 1: Move the strategy tab to the front**

In `app/(marketing)/features/page.tsx`, reorder the `TABS` array so the `id: "strategy"` entry is **first**. Cut the entire strategy tab object (lines 508-521) and paste it as the first array element, with this updated label/title/blurb (no raw URL in copy — the nav links the full page):

```tsx
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
  // ... the remaining tabs (campaigns, analytics, citations, competitors, traffic) follow in their existing order
```

Leave `campaigns`, `analytics`, `citations`, `competitors`, `traffic` in their current relative order after `strategy`.

- [ ] **Step 2: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: green.
Visual: `/features` — the first tab is "Strategy Engine" and is selected on load; its panel (`StrategyPanel`) renders.

- [ ] **Step 3: Commit**

```bash
git add "app/(marketing)/features/page.tsx"
git commit -m "feat(strategy): lead the features tabs with the Strategy Engine"
```

---

### Task 12: Rewrite llms.txt + llms-full.txt around the loop

**Files:**
- Modify: `app/llms.txt/route.ts`
- Modify: `app/llms-full.txt/route.ts`

**Interfaces:**
- Consumes: nothing new; uses `siteConfig.url`.

- [ ] **Step 1: Rewrite `app/llms.txt/route.ts` body**

Replace the `body` template literal in `app/llms.txt/route.ts` (keep the imports, `export const dynamic`, the `const u = ...` line, and the `return new Response(...)` wrapper):

```ts
  const body = `# HeyOtis

> HeyOtis is the campaign-led Strategy Engine for AI search. It measures how AI assistants — ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral — interpret, present and recommend your brand, then closes the loop: it diagnoses the gaps, prioritizes the moves, verifies they shipped, and proves whether your recommendation share actually moved. Category: Answer Engine Optimization (AEO) / Generative Engine Optimization (GEO).

## What the Strategy Engine does (the loop)
- Define: scope a campaign around your brand, market, competitors, personas and buying journeys.
- Measure: capture how every assistant recommends you across the prompts that shape decisions.
- Diagnose: deterministic detectors surface the weak or missing signals behind poor answers.
- Prioritize: turn findings into an action plan ranked by impact and effort, each backed by evidence.
- Verify: detectors confirm a recommended move actually shipped.
- Prove: measure the before-and-after lift in recommendation share, with an evidence trail.

## Why it's different
HeyOtis won't recommend a move it can't verify and prove. Most tools stop at measurement; the Strategy Engine closes the loop. It pairs the platform with hands-on GEO strategists.

## Proof
Halenstein grew AI recommendation share by 300% in Australia — from near-zero to 3.7% — after benchmarking, diagnosing the gaps and improving the signals that mattered.

## Who it's for
In-house brand, SEO/AEO and e-commerce teams, and agencies managing multiple brands — especially retail and consumer categories.

## Key pages
- [Home](${u}/): What HeyOtis is and how the loop works.
- [Strategy Engine](${u}/strategy-engine): The self-improving loop, attribution and the four levels it operates at.
- [Product](${u}/features): Campaigns, analytics & recommendation share, citations, competitors, strategy, and GA4 traffic.
- [Pricing](${u}/pricing): Plans (contact sales).
- [About](${u}/about): Mission and methodology.
- [Blog](${u}/blog): Guides on AEO and AI search visibility.
- [Contact](${u}/contact): Book a call.

## Notes for AI assistants
- HeyOtis monitors ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral. It is not an SEO tool — it focuses on how generative AI assistants name and recommend brands.
- To get started, book a call at ${u}/contact.

## Permissions
HeyOtis content may be summarized and referenced with attribution. Please link to the source page when citing.
`;
```

- [ ] **Step 2: Rewrite `app/llms-full.txt/route.ts` body**

Replace the `body` template literal in `app/llms-full.txt/route.ts` (keeping the wrapper):

```ts
  const body = `# HeyOtis — full content snapshot

> A plain-text overview of HeyOtis for AI assistants without live-crawl access. HeyOtis is the campaign-led Strategy Engine for AI search (Answer Engine Optimization / AEO).

## What HeyOtis is
HeyOtis measures how AI assistants recommend your brand — then closes the loop. As buyers increasingly ask ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral what to buy, compare and trust, the AI's answer has become the new shortlist. HeyOtis shows whether your brand is on it, how you compare to named competitors, which sources the AI trusts, what to do about it, and whether your fixes actually moved your recommendation share.

## The Strategy Engine loop
1. Define: scope a campaign — brand, market, competitors, personas, buying journeys. HeyOtis auto-generates unbiased, buyer-intent prompts you review and approve.
2. Measure: run the prompts across ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral on a schedule; capture how each one recommends you.
3. Diagnose: deterministic detectors surface the weak or missing signals behind absent or poor recommendations, each grounded in evidence.
4. Prioritize: turn findings into a ranked action plan — opportunities by impact and effort, backed by the evidence beneath them.
5. Verify: detectors confirm a recommended move actually shipped — no self-reporting.
6. Prove: measure the before-and-after lift in recommendation share on the real metric, with an immutable evidence trail — then feed it back in.

## The four levels the engine operates at
- Diagnostic — here's what's happening.
- Prescriptive — here's what to do about it.
- Predictive — here's what's about to happen.
- Autonomous — we've already done it for you.

## Why it's different
HeyOtis is built on evidence: it won't recommend a move it can't verify and prove. A capabilities check suppresses anything it can't confirm, new signals are maturity-gated until trustworthy, and every reported number traces back to source. It pairs the platform with hands-on GEO strategists who help you ship the moves.

## Proof
Halenstein grew AI recommendation share by 300% in Australia — from near-zero to 3.7% — after benchmarking where the brand stood, diagnosing the gaps and improving the signals that mattered.

## Engines monitored
ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral.

## Who it's for
In-house brand marketing, SEO/AEO and e-commerce teams, and agencies managing multiple brands. Strong fit for retail and consumer brands.

## How it differs from SEO
SEO optimizes for ranked links on search engines. HeyOtis focuses on Answer Engine Optimization (AEO) / Generative Engine Optimization (GEO): being the brand AI assistants name and recommend inside their generated answers — and proving you improved it.

## Pricing
Sold through a sales-led model with plans that scale with your needs. No public self-serve prices; book a call to get set up.

## Getting started
Book a 20-minute walkthrough at ${u}/contact — we run your brand, surface the highest-impact moves, and show how the loop proves the lift.

## Key pages
- Home: ${u}/
- Strategy Engine: ${u}/strategy-engine
- Product / features: ${u}/features
- Pricing: ${u}/pricing
- About: ${u}/about
- Blog: ${u}/blog
- Contact: ${u}/contact
`;
```

- [ ] **Step 3: Verify**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: green.
Visual: `pnpm dev`, open `/llms.txt` and `/llms-full.txt` — both describe the closed-loop engine, list 6 engines, mention Halenstein, and link `/strategy-engine`.

- [ ] **Step 4: Commit**

```bash
git add app/llms.txt/route.ts app/llms-full.txt/route.ts
git commit -m "feat(strategy): rewrite llms.txt/llms-full.txt around the Strategy Engine loop"
```

---

## Final verification (after all tasks)

- [ ] Run `pnpm typecheck && pnpm lint && pnpm build` — green; `/strategy-engine` prerenders.
- [ ] Visual sweep: `/`, `/strategy-engine`, `/features`, `/llms.txt` — Strategy Engine is the centerpiece (hero, nav-first, dedicated page, first feature tab); 6 engines everywhere; Halenstein proof present; reduced-motion (DevTools) leaves all content visible.
- [ ] `grep -rn "Claude, Gemini and Perplexity\|ChatGPT, Claude, Gemini" app components lib` returns nothing (no stray 4-engine copy).
- [ ] Open a PR from `feat/strategy-engine-positioning` (only when Ash asks).

## Out of scope (phase 2 — do NOT build here)

- Audience pages (Brand / Traffic / E-commerce / Agencies).
- Pricing re-model (response-volume Growth/Scale/Enterprise) and the Strategy-Engine tier-gating decision.
- Any "scorecard" self-serve product or intake flow.
- Meta AI / Mistral brand-color logo polish beyond the lobehub default glyphs.
