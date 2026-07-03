# Strategy Engine Flagship Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the input-side ("what flows in") and learning-side ("it compounds") of the Strategy Engine story to `/strategy-engine` and the home page, with four bespoke animated visuals replacing the static loop card grid.

**Architecture:** Four new client-component visuals (`SignalIntake`, `StrategyLoopOrbit`, `BotLogFeed`, `CompoundingChart`) driven by typed data in `lib/strategy-content.ts`; pages stay server components. One new server section component (`EvidenceLadder`) composes the attribution story. Spec: `docs/superpowers/specs/2026-07-03-strategy-engine-flagship-design.md`.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, `motion` v12, lucide-react, existing `AnimatedBeam` component.

## Global Constraints

- **No test framework exists in this repo.** The verification gate for every task is: `pnpm typecheck && pnpm lint` (fast) and `pnpm build` at the end. Visual verification happens in Task 9 with the dev server. Do not add a test framework.
- **No new dependencies.** Everything is built with what's in `package.json`.
- **Pages stay server components.** Only the visuals are `"use client"` (existing pattern — see `AiSourceBeam`).
- **Reduced motion:** every animated visual renders a static equivalent via `useIsomorphicReducedMotion()` from `@/lib/use-reduced-motion` (never motion's own `useReducedMotion` — it causes hydration mismatches).
- **Off-screen gating:** infinite animations only run while `useInView(ref, { margin: "0px" })` (from `motion/react`) is true — see `AiSourceBeam` for the pattern.
- **Accessibility:** animated diagrams are `aria-hidden`; adjacent semantic text (lists, headings) carries the content.
- **Honesty labels:** every synthetic number carries a `Sample` chip or "Illustrative" caption, matching `AttributionPanel`/`OpportunityBoard`.
- **US English.** Site copy conventions: "recommendation share", "campaign-led", em-dashes, sentence case.
- **CLS:** every visual sits in a fixed-height or fixed-aspect container.
- **Commit after every task** with a `feat(strategy): …` message.
- Design tokens (from `app/globals.css`): `--brand` oklch(0.68 0.1 280) decorative only; `--brand-strong`/`--accent` oklch(0.5 0.16 280) accessible fill (hex `#5552bb` — validated ≥3:1 on white via the dataviz palette validator); surfaces `surface-cream`/`surface-card`/`surface-dark`; utility classes `label-mono`, `display-md`.

---

### Task 1: Signal-stream, log-line and compounding data

**Files:**
- Modify: `lib/strategy-content.ts` (append after the `HALENSTEIN` block at the end of the file; extend the lucide import at the top)

**Interfaces:**
- Produces: `SIGNAL_STREAMS: SignalStream[]` (5 items, `{ id, name, short, blurb, icon, differentiator? }`), `LOG_LINES: LogLine[]` (8 items, `{ time, tag, text, kind: "bot" | "referral" | "session" }`), `COMPOUNDING_POINTS: CompoundingPoint[]` (4 items, `{ cycle, share, note }`). Tasks 2, 5, 6 import these.

- [ ] **Step 1: Extend the lucide import**

In `lib/strategy-content.ts`, the existing import (lines 1–13) gains five icons. Final import:

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
  MessageSquare,
  Terminal,
  LineChart,
  Globe,
  Users,
  type LucideIcon,
} from "lucide-react";
```

- [ ] **Step 2: Append the three data blocks at the end of the file**

```ts
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
  time: string;
  tag: string;
  text: string;
  kind: "bot" | "referral" | "session";
};

export const LOG_LINES: LogLine[] = [
  { time: "09:41:07", tag: "GPTBot", text: "GET /compare/best-everyday · 200", kind: "bot" },
  { time: "09:41:32", tag: "PerplexityBot", text: "GET /compare/best-everyday · 200", kind: "bot" },
  { time: "09:43:10", tag: "ClaudeBot", text: "GET /products/everyday · 200", kind: "bot" },
  { time: "10:02:55", tag: "referral", text: "chatgpt.com → /compare/best-everyday", kind: "referral" },
  { time: "10:03:41", tag: "session", text: "4 pages · 6m 12s · demo booked", kind: "session" },
  { time: "10:18:24", tag: "ChatGPT-User", text: "GET /compare/best-everyday · 200", kind: "bot" },
  { time: "10:26:09", tag: "referral", text: "perplexity.ai → /products/everyday", kind: "referral" },
  { time: "10:27:02", tag: "session", text: "3 pages · 4m 05s · signup", kind: "session" },
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
  { cycle: "Cycle 4", share: 4.9, note: "Schema moves prioritized" },
];
```

- [ ] **Step 3: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass with no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/strategy-content.ts
git commit -m "feat(strategy): add signal-stream, log-feed and compounding data"
```

---

### Task 2: `SignalIntake` visual + "What flows in" section

**Files:**
- Create: `components/marketing/visuals/SignalIntake.tsx`
- Modify: `app/(marketing)/strategy-engine/page.tsx` (insert a new section after the "The shift" section, i.e. after the `</Section>` that closes the `surface="card"` "Why now" block ending at current line 122)

**Interfaces:**
- Consumes: `SIGNAL_STREAMS` from Task 1; `AnimatedBeam` (`components/ui/animated-beam.tsx`), `LogoGlyph` (`components/marketing/Logo.tsx`).
- Produces: `SignalIntake({ className? })` — self-contained diagram, `aria-hidden` inside.

- [ ] **Step 1: Create `components/marketing/visuals/SignalIntake.tsx`**

```tsx
"use client";

import * as React from "react";
import { ListChecks } from "lucide-react";
import { useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { LogoGlyph } from "@/components/marketing/Logo";
import { SIGNAL_STREAMS } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

const Node = React.forwardRef<
  HTMLDivElement,
  { className?: string; children: React.ReactNode }
>(({ className, children }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-10 flex size-12 items-center justify-center rounded-2xl border border-border bg-card shadow-[0_8px_24px_-12px_rgba(40,30,70,0.4)]",
      className,
    )}
  >
    {children}
  </div>
));
Node.displayName = "IntakeNode";

const CURVES = [-84, -42, 0, 42, 84];

/**
 * The five signal streams converging into the engine core, which emits ranked
 * moves. Decorative (aria-hidden) — the section's semantic stream list carries
 * the content. Beams mount only in view and never under reduced motion,
 * matching AiSourceBeam.
 */
export function SignalIntake({ className }: { className?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const coreRef = React.useRef<HTMLDivElement>(null);
  const outRef = React.useRef<HTMLDivElement>(null);
  const s0 = React.useRef<HTMLDivElement>(null);
  const s1 = React.useRef<HTMLDivElement>(null);
  const s2 = React.useRef<HTMLDivElement>(null);
  const s3 = React.useRef<HTMLDivElement>(null);
  const s4 = React.useRef<HTMLDivElement>(null);
  const streamRefs = [s0, s1, s2, s3, s4];
  const reduced = useIsomorphicReducedMotion();
  const inView = useInView(containerRef, { margin: "0px" });

  const beam = {
    gradientStartColor: "oklch(0.72 0.1 280)",
    gradientStopColor: "oklch(0.5 0.16 280)",
    pathColor: "oklch(0.5 0.02 285)",
    pathOpacity: 0.12,
    duration: 4,
  };

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "relative mx-auto flex h-[400px] w-full max-w-xl items-center justify-between px-2 sm:px-6",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        {SIGNAL_STREAMS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center gap-2.5">
              <Node
                ref={streamRefs[i]}
                className={cn(
                  s.differentiator && "border-transparent ring-2 ring-brand/40",
                )}
              >
                <Icon className="size-5 text-accent" strokeWidth={1.75} />
              </Node>
              <span className="text-[0.65rem] font-medium text-foreground/80 sm:text-xs">
                {s.short}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <Node ref={coreRef} className="size-16 border-transparent bg-surface-dark">
          <LogoGlyph className="h-7 w-7" />
        </Node>
        <span className="label-mono text-[0.6rem] text-muted-foreground">
          strategy engine
        </span>
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <Node ref={outRef}>
          <ListChecks className="size-5 text-accent" strokeWidth={1.75} />
        </Node>
        <span className="label-mono text-[0.6rem] text-muted-foreground">
          ranked moves
        </span>
      </div>

      {!reduced && inView ? (
        <>
          {streamRefs.map((r, i) => (
            <AnimatedBeam
              key={SIGNAL_STREAMS[i].id}
              containerRef={containerRef}
              fromRef={r}
              toRef={coreRef}
              curvature={CURVES[i]}
              delay={i * 0.3}
              {...beam}
            />
          ))}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={coreRef}
            toRef={outRef}
            delay={1.6}
            {...beam}
            duration={3}
          />
        </>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Insert the "What flows in" section on `/strategy-engine`**

In `app/(marketing)/strategy-engine/page.tsx`:

Add imports:

```tsx
import { SignalIntake } from "@/components/marketing/visuals/SignalIntake";
import { SIGNAL_STREAMS } from "@/lib/strategy-content";
```

Insert this section **between** the "2 — The shift" section and the "3 — The loop" section:

```tsx
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
```

Renumber the section comments below it (`3 — The loop` → `4 — The loop`, etc.) as you touch them in later tasks — comment renumbering alone doesn't warrant edits.

**Surface re-alternation:** with two new sections inserted, surfaces alternate as: hero `cream` → shift `card` → inputs `cream` → loop `card` → levels `cream` → action plan `card` → evidence `cream` → learns `card` → honesty `cream` → proof `card` → platform `cream` → vision `card`. In this task change the loop section to `surface="card"` and the MaturityLevels section to `surface="cream"` and the action-plan section to `surface="card"` (the attribution section is rebuilt in Task 5 as `cream`; honesty/proof/platform/vision already match).

- [ ] **Step 3: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/visuals/SignalIntake.tsx "app/(marketing)/strategy-engine/page.tsx"
git commit -m "feat(strategy): add SignalIntake visual + What-flows-in section"
```

---

### Task 3: `StrategyLoopOrbit` + swap on `/strategy-engine`

**Files:**
- Create: `components/marketing/visuals/StrategyLoopOrbit.tsx`
- Modify: `app/globals.css` (add `orbit-dash` keyframes + class near the existing component utilities)
- Modify: `app/(marketing)/strategy-engine/page.tsx` (loop section: replace `<StrategyLoop />` with `<StrategyLoopOrbit />`, swap the import)

**Interfaces:**
- Consumes: `LOOP_STAGES` from `lib/strategy-content.ts` (existing, unchanged), `LogoGlyph`.
- Produces: `StrategyLoopOrbit({ compact?: boolean; className?: string })` — orbit diagram + semantic legend in one component. Task 4 uses `compact`.

- [ ] **Step 1: Add the dash animation to `app/globals.css`**

Append near the other component-layer utilities (after the `.label-mono` block, inside the same `@layer components`):

```css
  .orbit-dash {
    animation: orbit-dash 1.4s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .orbit-dash {
      animation: none;
    }
  }
```

And at the end of the file (top level, outside all layers):

```css
@keyframes orbit-dash {
  to {
    stroke-dashoffset: -12;
  }
}
```

- [ ] **Step 2: Create `components/marketing/visuals/StrategyLoopOrbit.tsx`**

```tsx
"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { LogoGlyph } from "@/components/marketing/Logo";
import { LOOP_STAGES } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/* Stage i sits at −90° + i·60° on a ring of radius 38 (viewBox 0 0 100 100). */
const POS = [
  { x: 50, y: 12 },
  { x: 82.9, y: 31 },
  { x: 82.9, y: 69 },
  { x: 50, y: 88 },
  { x: 17.1, y: 69 },
  { x: 17.1, y: 31 },
] as const;

/* Full ring drawn clockwise from the top — the pulse travels this path. */
const RING =
  "M 50 12 A 38 38 0 0 1 88 50 A 38 38 0 0 1 50 88 A 38 38 0 0 1 12 50 A 38 38 0 0 1 50 12";
/* The Verify→Prove segment (θ 125°→235°) — the differentiator arc. */
const DIFF_ARC = "M 28.2 81.1 A 38 38 0 0 1 28.2 18.9";
/* Prove→Measure chord — the evidence returning for the next measure. */
const FEEDBACK = "M 17.1 31 Q 50 47 82.9 31";

/**
 * The self-improving loop as an actual cycle: six stages on a ring, a pulse
 * traveling it, the Verify/Prove arc emphasized, and the Prove→Measure
 * feedback chord that makes "it compounds" visible. The orbit is decorative
 * (aria-hidden); the legend list is the semantic content. `compact` shrinks
 * the orbit and drops the stage blurbs (home-page variant).
 */
export function StrategyLoopOrbit({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const markerId = React.useId();
  const animate = !reduced && inView;

  return (
    <div
      ref={ref}
      className={cn(
        "grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16",
        className,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "relative mx-auto aspect-square w-full",
          compact ? "max-w-[400px]" : "max-w-[480px]",
        )}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none">
          <path d={RING} stroke="var(--border)" strokeWidth="1.2" />
          <path
            d={DIFF_ARC}
            stroke="var(--brand)"
            strokeOpacity="0.55"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--brand-strong)" />
            </marker>
          </defs>
          <path
            d={FEEDBACK}
            stroke="var(--brand-strong)"
            strokeOpacity="0.7"
            strokeWidth="1.4"
            strokeDasharray="3 3"
            markerEnd={`url(#${markerId})`}
            className={animate ? "orbit-dash" : undefined}
          />
          {animate ? (
            <circle r="2" fill="var(--brand-strong)">
              <animateMotion dur="16s" repeatCount="indefinite" path={RING} />
            </circle>
          ) : null}
        </svg>

        <span className="absolute left-1/2 top-[34%] flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5">
          <RefreshCw className="size-3 text-accent" />
          <span className="label-mono whitespace-nowrap text-[0.55rem] text-accent">
            evidence feeds back
          </span>
        </span>

        <div className="absolute left-1/2 top-[54%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-surface-dark shadow-lg">
            <LogoGlyph className="h-6 w-6" />
          </span>
          <span className="label-mono text-[0.6rem] text-muted-foreground">
            strategy engine
          </span>
        </div>

        {LOOP_STAGES.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${POS[i].x}%`, top: `${POS[i].y}%` }}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex items-center justify-center rounded-xl bg-card shadow-sm ring-1",
                    compact ? "size-10" : "size-11",
                    stage.differentiator
                      ? "bg-brand/10 ring-brand/40"
                      : "ring-border",
                  )}
                >
                  <Icon className="size-5 text-accent" strokeWidth={1.75} />
                </span>
                <span className="text-[0.7rem] font-semibold text-foreground">
                  {stage.verb}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <ol className={cn("flex flex-col", compact ? "gap-2.5" : "gap-4")}>
        {LOOP_STAGES.map((stage) => (
          <li key={stage.id} className="flex items-baseline gap-3">
            <span className="label-mono text-xs text-muted-foreground">
              {String(stage.n).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-foreground">
                <span className="text-accent">{stage.verb}.</span> {stage.title}
                {stage.differentiator ? (
                  <span className="label-mono ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[0.55rem] text-accent">
                    what others skip
                  </span>
                ) : null}
              </p>
              {!compact ? (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {stage.blurb}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
```

- [ ] **Step 3: Swap it in on `/strategy-engine`**

In `app/(marketing)/strategy-engine/page.tsx`:
- Replace the import `import { StrategyLoop } from "@/components/marketing/visuals/StrategyLoop";` with `import { StrategyLoopOrbit } from "@/components/marketing/visuals/StrategyLoopOrbit";`
- In the loop section, replace `<StrategyLoop />` with `<StrategyLoopOrbit />`.
- Per the Task 2 surface table this section is now `surface="card"` (keep `id="loop"`).

- [ ] **Step 4: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add components/marketing/visuals/StrategyLoopOrbit.tsx app/globals.css "app/(marketing)/strategy-engine/page.tsx"
git commit -m "feat(strategy): StrategyLoopOrbit — the loop as an animated cycle"
```

---

### Task 4: Home swap + delete the old card grid

**Files:**
- Modify: `app/(marketing)/page.tsx` (lines 7 + 106: import and usage)
- Delete: `components/marketing/visuals/StrategyLoop.tsx`

**Interfaces:**
- Consumes: `StrategyLoopOrbit` with `compact` from Task 3.

- [ ] **Step 1: Swap the home "How it works" visual**

In `app/(marketing)/page.tsx`:
- Replace `import { StrategyLoop } from "@/components/marketing/visuals/StrategyLoop";` with `import { StrategyLoopOrbit } from "@/components/marketing/visuals/StrategyLoopOrbit";`
- Replace `<StrategyLoop />` with `<StrategyLoopOrbit compact />`.

- [ ] **Step 2: Delete the old component**

```bash
git rm components/marketing/visuals/StrategyLoop.tsx
```

- [ ] **Step 3: Verify no stale imports remain**

Run: `grep -rn "visuals/StrategyLoop\"" app components ; pnpm typecheck && pnpm lint`
Expected: grep finds nothing; typecheck and lint pass.

- [ ] **Step 4: Commit**

```bash
git add "app/(marketing)/page.tsx"
git commit -m "feat(strategy): home how-it-works uses the compact orbit; drop card grid"
```

---

### Task 5: `BotLogFeed` + `EvidenceLadder` — the three-layer attribution section

**Files:**
- Create: `components/marketing/visuals/BotLogFeed.tsx`
- Create: `components/marketing/sections/EvidenceLadder.tsx`
- Modify: `app/(marketing)/strategy-engine/page.tsx` (replace the whole "Real attribution" section; remove the now-unused `AttributionPanel` import from the page — it moves into `EvidenceLadder`)

**Interfaces:**
- Consumes: `LOG_LINES`, `LogLine` from Task 1; existing `AttributionPanel`, `Reveal`.
- Produces: `BotLogFeed({ className? })`; `EvidenceLadder({ className? })` (server component composing the three layers).

- [ ] **Step 1: Create `components/marketing/visuals/BotLogFeed.tsx`**

```tsx
"use client";

import * as React from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { LOG_LINES, type LogLine } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

const VISIBLE = 6;
const TICK_MS = 2200;

function tagTone(kind: LogLine["kind"]) {
  switch (kind) {
    case "bot":
      return "text-[oklch(0.78_0.09_280)]";
    case "referral":
      return "text-[oklch(0.8_0.12_160)]";
    case "session":
      return "text-[oklch(0.85_0.09_85)]";
  }
}

/**
 * Terminal-style ingest feed: crawler hits, assistant referrals and the
 * sessions they become, ticking upward while in view. Illustrative lines that
 * mirror the product's real log ingestion. Reduced motion / off-screen: a
 * static window of lines.
 */
export function BotLogFeed({ className }: { className?: string }) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const [count, setCount] = React.useState(VISIBLE);

  React.useEffect(() => {
    if (reduced || !inView) return;
    const id = setInterval(() => setCount((c) => c + 1), TICK_MS);
    return () => clearInterval(id);
  }, [reduced, inView]);

  const start = Math.max(0, count - VISIBLE);
  const lines: (LogLine & { key: number })[] = [];
  for (let i = start; i < count; i++) {
    lines.push({ ...LOG_LINES[i % LOG_LINES.length], key: i });
  }

  return (
    <div ref={ref} className={className}>
      <div
        aria-hidden
        className="overflow-hidden rounded-2xl border border-border bg-surface-dark text-surface-dark-foreground shadow-lg"
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="ml-2 font-mono text-[0.65rem] text-surface-dark-foreground/60">
            otis-ingest · access.log
          </span>
        </div>
        <div className="flex h-[216px] flex-col justify-end gap-1 px-4 py-3 font-mono text-[0.7rem] leading-relaxed sm:text-xs">
          <AnimatePresence initial={false}>
            {lines.map((l) => (
              <motion.p
                key={l.key}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex gap-2 whitespace-nowrap"
              >
                <span className="text-surface-dark-foreground/35">{l.time}</span>
                <span className={cn("font-semibold", tagTone(l.kind))}>{l.tag}</span>
                <span className="truncate text-surface-dark-foreground/70">{l.text}</span>
              </motion.p>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <p className="label-mono mt-3 text-[0.6rem] text-muted-foreground">
        Illustrative — mirrors the product&apos;s log ingestion
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create `components/marketing/sections/EvidenceLadder.tsx`**

```tsx
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { BotLogFeed } from "@/components/marketing/visuals/BotLogFeed";
import { AttributionPanel } from "@/components/marketing/visuals/AttributionPanel";
import { cn } from "@/lib/utils";

const LAYERS = [
  {
    n: "01",
    name: "The crawl",
    lede: "AI bots fetch the fix.",
    body: "Within days of a move shipping, GPTBot, ClaudeBot and PerplexityBot fetch the changed pages — visible straight from your traffic and bot logs, because HeyOtis ingests them.",
  },
  {
    n: "02",
    name: "The visit",
    lede: "Assistants send the humans.",
    body: "Referral sessions arrive from chatgpt.com and perplexity.ai onto the pages the move touched — real buyers, from real answers.",
  },
  {
    n: "03",
    name: "The lift",
    lede: "The metric moves.",
    body: "Recommendation share is re-measured on the same prompts, before and after, with the evidence trail attached.",
  },
] as const;

/**
 * The attribution story as a ladder of evidence — raw log line → human visit →
 * business metric — connected by a spine. Layer visuals: BotLogFeed,
 * ReferralStat, AttributionPanel.
 */
export function EvidenceLadder({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex flex-col gap-10", className)}>
      <div
        aria-hidden
        className="absolute bottom-10 left-5 top-10 hidden w-px bg-border lg:block"
      />
      {LAYERS.map((layer, i) => (
        <Reveal key={layer.n} delay={i * 0.08}>
          <div className="grid items-center gap-6 lg:grid-cols-[40px_0.9fr_1.1fr] lg:gap-10">
            <span className="label-mono relative z-10 hidden size-10 items-center justify-center rounded-full border border-border bg-card text-xs text-accent lg:flex">
              {layer.n}
            </span>
            <div>
              <p className="label-mono text-[0.65rem] text-muted-foreground">
                {layer.name}
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                {layer.lede}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {layer.body}
              </p>
            </div>
            <div>
              {i === 0 ? <BotLogFeed /> : i === 1 ? <ReferralStat /> : <AttributionPanel />}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function ReferralStat() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            Referrals · 30-day window
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">
            AI referral sessions
          </h3>
          <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-accent">
            Sample
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-sm font-semibold text-accent">
          <ArrowUpRight className="size-4" aria-hidden />
          +142%
        </span>
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-3">
        {[
          { source: "chatgpt.com", value: "+128%" },
          { source: "perplexity.ai", value: "+64%" },
          { source: "gemini.google.com", value: "+41%" },
        ].map((r) => (
          <div key={r.source} className="rounded-xl bg-secondary px-3 py-2.5">
            <dt className="label-mono truncate text-[0.55rem] text-muted-foreground">
              {r.source}
            </dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums text-foreground">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 border-t border-border pt-3 text-[0.7rem] leading-relaxed text-muted-foreground">
        Sessions arriving from assistant surfaces onto the pages a move touched.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Replace the attribution section on `/strategy-engine`**

In `app/(marketing)/strategy-engine/page.tsx`:
- Remove the imports of `AttributionPanel` (now used only inside `EvidenceLadder`) and add `import { EvidenceLadder } from "@/components/marketing/sections/EvidenceLadder";`
- Replace the entire "6 — Real attribution" `<Section>…</Section>` block with:

```tsx
      {/* 7 — Real attribution, three layers deep */}
      <Section surface="cream">
        <SectionHeading
          eyebrow="Real attribution"
          title="Three layers of proof"
          sub={
            "“It worked” isn't a vibe. Because HeyOtis ingests your traffic and AI-bot logs, you can watch the crawlers fetch the fix, the assistants send the visitors, and the share move — with the evidence trail open."
          }
          className="max-w-2xl"
        />
        <div className="mt-12">
          <EvidenceLadder />
        </div>
      </Section>
```

- [ ] **Step 4: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass (watch for unused-import errors on the page).

- [ ] **Step 5: Commit**

```bash
git add components/marketing/visuals/BotLogFeed.tsx components/marketing/sections/EvidenceLadder.tsx "app/(marketing)/strategy-engine/page.tsx"
git commit -m "feat(strategy): three-layer evidence ladder with live bot-log feed"
```

---

### Task 6: `CompoundingChart` + "It learns" section

**Files:**
- Create: `components/marketing/visuals/CompoundingChart.tsx`
- Modify: `app/(marketing)/strategy-engine/page.tsx` (insert the new section between the evidence ladder and the honesty section)

**Interfaces:**
- Consumes: `COMPOUNDING_POINTS` from Task 1.
- Produces: `CompoundingChart({ className? })`.

**Chart spec (per dataviz skill, validated):** single series → no legend (the header names it); stepped line (share holds within a cycle, jumps when a move proves); line 2px round join, `--brand-strong` (#5552bb, passes ≥3:1 on white); markers r=4.5 with 2px card-surface ring; area wash at 8% opacity; 1px solid recessive gridlines; text in text tokens, never the series color; direct labels on first + last points only; per-point hover tooltip (CSS `group-hover`, no JS state); sr-only data list as the table view.

- [ ] **Step 1: Create `components/marketing/visuals/CompoundingChart.tsx`**

```tsx
"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { COMPOUNDING_POINTS } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/* Geometry: viewBox 560×240, y-scale 0–6% */
const W = 560;
const H = 240;
const PL = 44;
const PR = 16;
const PT = 24;
const PB = 36;
const Y_MAX = 6;
const px = (i: number) =>
  PL + (i * (W - PL - PR)) / (COMPOUNDING_POINTS.length - 1);
const py = (share: number) => PT + (H - PT - PB) * (1 - share / Y_MAX);

/**
 * Recommendation share stepping up across campaign cycles — the visible shape
 * of the feedback loop. Stepped single-series line per the dataviz specs;
 * illustrative numbers, real mechanism. The SVG is decorative; the sr-only
 * list carries the values.
 */
export function CompoundingChart({ className }: { className?: string }) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const pts = COMPOUNDING_POINTS;
  const last = pts.length - 1;
  const stepD = pts
    .map((p, i) =>
      i === 0 ? `M ${px(0)} ${py(p.share)}` : `H ${px(i)} V ${py(p.share)}`,
    )
    .join(" ");
  const areaD = `${stepD} V ${py(0)} H ${px(0)} Z`;

  return (
    <div
      ref={ref}
      className={cn("rounded-2xl border border-border bg-card p-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            The compounding loop
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">
            Recommendation share, by campaign cycle
          </h3>
        </div>
        <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-accent">
          Sample
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" aria-hidden>
        {[0, 2, 4, 6].map((v) => (
          <g key={v}>
            <line
              x1={PL}
              x2={W - PR}
              y1={py(v)}
              y2={py(v)}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text
              x={PL - 8}
              y={py(v) + 3}
              textAnchor="end"
              fontSize="10"
              className="font-mono"
              fill="var(--muted-foreground)"
            >
              {v}%
            </text>
          </g>
        ))}

        <path d={areaD} fill="var(--brand-strong)" opacity={0.08} />
        {reduced ? (
          <path
            d={stepD}
            fill="none"
            stroke="var(--brand-strong)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ) : (
          <motion.path
            d={stepD}
            fill="none"
            stroke="var(--brand-strong)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}

        {pts.map((p, i) => {
          const cx = px(i);
          const cy = py(p.share);
          const tx = Math.min(Math.max(cx - 78, 8), W - 164);
          return (
            <g key={p.cycle} className="group">
              <circle cx={cx} cy={cy} r="14" fill="transparent" />
              <circle
                cx={cx}
                cy={cy}
                r="4.5"
                fill="var(--brand-strong)"
                stroke="var(--card)"
                strokeWidth="2"
              />
              <text
                x={cx}
                y={H - 12}
                textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"}
                fontSize="10"
                className="font-mono"
                fill="var(--muted-foreground)"
              >
                {p.cycle}
              </text>
              <g className="pointer-events-none opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <rect
                  x={tx}
                  y={cy - 46}
                  width="156"
                  height="34"
                  rx="8"
                  fill="var(--surface-dark)"
                />
                <text x={tx + 10} y={cy - 32} fontSize="10" fontWeight="600" fill="var(--surface-dark-foreground)">
                  {p.share}% · {p.cycle}
                </text>
                <text x={tx + 10} y={cy - 19} fontSize="9" fill="var(--surface-dark-foreground)" opacity="0.7">
                  {p.note}
                </text>
              </g>
            </g>
          );
        })}

        <text
          x={px(0) + 8}
          y={py(pts[0].share) - 10}
          fontSize="11"
          className="font-mono"
          fill="var(--muted-foreground)"
        >
          {pts[0].share}%
        </text>
        <text
          x={px(last) - 8}
          y={py(pts[last].share) - 12}
          textAnchor="end"
          fontSize="12"
          fontWeight="600"
          fill="var(--foreground)"
        >
          {pts[last].share}%
        </text>
      </svg>

      <ul className="sr-only">
        {pts.map((p) => (
          <li key={p.cycle}>
            {p.cycle}: {p.share}% recommendation share — {p.note}
          </li>
        ))}
      </ul>
      <p className="label-mono mt-3 border-t border-border pt-3 text-[0.6rem] text-muted-foreground">
        Illustrative — the compounding mechanism is real
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Insert the "It learns" section on `/strategy-engine`**

Add the import: `import { CompoundingChart } from "@/components/marketing/visuals/CompoundingChart";`

Insert **between** the evidence-ladder section (Task 5) and the honesty section ("Built on evidence"):

```tsx
      {/* 8 — It learns */}
      <Section surface="card">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="The feedback loop"
              title="Every campaign makes the next one sharper"
              sub="Proof isn't the end of the loop — it's the input to the next one. Every outcome, proven or disproven, reweights what the engine recommends next."
            />
            <ul className="mt-8 flex flex-col gap-4">
              {[
                "Proven moves raise the weighting of moves like them",
                "Disproven moves get deprioritized — honestly",
                "Every cycle starts smarter than the last",
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
            <CompoundingChart />
          </Reveal>
        </div>
      </Section>
```

(`Check` is already imported on this page.)

- [ ] **Step 3: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/visuals/CompoundingChart.tsx "app/(marketing)/strategy-engine/page.tsx"
git commit -m "feat(strategy): CompoundingChart + It-learns section"
```

---

### Task 7: Home echoes — FeatureCards copy + FAQ entry

**Files:**
- Modify: `components/marketing/sections/FeatureCards.tsx` (the "Proven in real traffic" card, lines 36–41)
- Modify: `app/(marketing)/page.tsx` (FAQS array)

- [ ] **Step 1: Sharpen the "Proven in real traffic" card**

Replace that card object in `FeatureCards.tsx` with:

```ts
  {
    icon: LineChart,
    title: "Proven in real traffic",
    body: "HeyOtis ingests your traffic and AI-bot logs — GPTBot, ClaudeBot, PerplexityBot and friends — and ties AI referral visits and conversions back to the moves that earned them.",
    points: ["AI bot & crawler logs", "Referrals by assistant", "Conversions by source"],
  },
```

- [ ] **Step 2: Add the attribution FAQ on the home page**

In `app/(marketing)/page.tsx`, insert into `FAQS` directly after the "How does HeyOtis track AI search visibility?" entry:

```ts
  {
    q: "How does HeyOtis prove AI actually drove the result?",
    a: "HeyOtis ingests your traffic and AI-bot logs. When a recommended move ships, you can watch AI crawlers like GPTBot and PerplexityBot fetch the changed pages, see referral sessions arrive from assistants like ChatGPT and Perplexity, and measure the before-and-after change in your AI recommendation share — three layers of evidence, from raw log line to business metric.",
  },
```

- [ ] **Step 3: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/sections/FeatureCards.tsx "app/(marketing)/page.tsx"
git commit -m "feat(strategy): home echoes — bot-log attribution card copy + FAQ"
```

---

### Task 8: llms.txt, llms-full.txt and page metadata

**Files:**
- Modify: `app/llms.txt/route.ts`
- Modify: `app/llms-full.txt/route.ts`
- Modify: `app/(marketing)/strategy-engine/page.tsx` (metadata description)

- [ ] **Step 1: `app/llms.txt/route.ts`** — insert after the "## What the Strategy Engine does (the loop)" list and before "## Why it's different":

```
## What feeds it (the five signal streams)
- AI answer sampling: how six assistants answer, cite and rank you across the prompts that matter.
- AI traffic & bot logs: which AI crawlers (GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User) fetch which pages, and the human visitors assistants refer.
- Site analytics: sessions, conversions and landing pages, so lift ties to business outcomes.
- Your surfaces: crawls of your own site — structured data, freshness, what actually shipped.
- Competitive signals: who wins the answer when you don't, and why.
```

And extend the "## Why it's different" paragraph with this second sentence pair (after "…the Strategy Engine closes the loop."):

```
Attribution runs three layers deep — AI crawlers fetching a shipped fix in your logs, referral sessions arriving from assistants, and the before-and-after change in recommendation share. Every proven or disproven move feeds back in, so recommendations get sharper each cycle.
```

- [ ] **Step 2: `app/llms-full.txt/route.ts`** — insert after the "## The Strategy Engine loop" list:

```
## What feeds the engine (five signal streams)
- AI answer sampling: how ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral answer, cite and rank you.
- AI traffic & bot logs: HeyOtis ingests your traffic and bot logs — which AI crawlers (GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User) fetch which pages, and the human visitors assistants refer.
- Site analytics: sessions, conversions and landing pages, so lift ties to business outcomes.
- Your surfaces: crawls of your own site — structured data, freshness, what actually shipped.
- Competitive signals: who wins the answer when you don't, and why.

## Attribution and learning
Attribution runs three layers deep: (1) the crawl — AI bots fetch the changed pages after a move ships, visible in your logs; (2) the visit — referral sessions arrive from assistant surfaces onto the pages the move touched; (3) the lift — recommendation share is re-measured on the same prompts, before and after, with the evidence trail attached. Every outcome, proven or disproven, feeds back into the engine and reweights what it recommends next — each campaign cycle starts smarter than the last.
```

- [ ] **Step 3: Update the `/strategy-engine` metadata description**

```ts
export const metadata = buildMetadata({
  title: "The Strategy Engine",
  description:
    "The HeyOtis Strategy Engine finds the move, verifies it shipped, and proves it worked — from AI bot-log evidence to recommendation-share lift — then learns from every outcome.",
  path: "/strategy-engine",
});
```

- [ ] **Step 4: Verify**

Run: `pnpm typecheck && pnpm lint`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add app/llms.txt/route.ts app/llms-full.txt/route.ts "app/(marketing)/strategy-engine/page.tsx"
git commit -m "feat(strategy): teach llms.txt the inputs, attribution layers and learning loop"
```

---

### Task 9: Full verification pass

**Files:** none created — verification only.

- [ ] **Step 1: Build**

Run: `pnpm build`
Expected: production build succeeds; `/strategy-engine` and `/` prerender as static.

- [ ] **Step 2: Visual pass on the dev server**

Run `pnpm dev`, then check (screenshots via browser tooling if available, otherwise ask the user to eyeball):
- `/strategy-engine` at 360px, 768px, 1280px: no horizontal overflow; SignalIntake labels legible; orbit nodes and "evidence feeds back" chip don't collide; evidence-ladder spine aligns with the numbered markers on lg; CompoundingChart tooltips appear on hover and stay inside the panel.
- `/` at the same widths: compact orbit + condensed legend fit the how-it-works section.
- Surface alternation on `/strategy-engine` reads cream/card/cream/card down the page with no double-cream or double-card seams.

- [ ] **Step 3: Reduced-motion emulation**

In devtools, emulate `prefers-reduced-motion: reduce` and reload both pages:
- No beams animate in SignalIntake; orbit pulse and dash are absent (static ring, arcs and chord remain); BotLogFeed shows a static window of 6 lines; CompoundingChart line renders fully drawn.

- [ ] **Step 4: Claims audit**

Confirm `curl localhost:3000/llms.txt` and `/llms-full.txt` render the new sections, and that no page claims anything the spec didn't authorize (five streams, three attribution layers, learning loop — all confirmed by the user as claimable).

- [ ] **Step 5: Commit any fixups**

```bash
git add -A && git commit -m "fix(strategy): visual-pass fixups" # only if fixes were needed
```
