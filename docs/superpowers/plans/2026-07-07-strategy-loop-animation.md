# Strategy Engine Loop Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `StrategyLoopOrbit` as an auto-playing six-stage story loop — each stage plays a miniature product moment in a center "screen", the ring fills as progress, and a feedback beat visibly closes the loop once per cycle.

**Architecture:** One orchestrator component (`StrategyLoopOrbit.tsx`, rebuilt in place — same export, same `compact` prop) owns a 7-step timer state machine (6 stages + feedback beat), the SVG ring/progress arc/feedback chord, the stage nodes, the center screen shell, and the legend. Six vignette micro-scenes live in a co-located module (`strategy-loop-vignettes.tsx`) behind a `VIGNETTES` record keyed by stage id; each vignette is a zero-prop component that plays its scene on mount.

**Tech Stack:** Next.js 16 (App Router), React 19, Motion 12 (`motion/react` — already installed), Tailwind 4 with the repo's oklch design tokens, lucide-react icons.

**Spec:** `docs/superpowers/specs/2026-07-07-strategy-loop-animation-design.md`

## Global Constraints

- **No new dependencies.** Motion 12 (`motion/react`) is already in `package.json`.
- **Public interface unchanged:** `export function StrategyLoopOrbit({ compact = false, className }: { compact?: boolean; className?: string })`. Call sites (`app/(marketing)/page.tsx:110`, `app/(marketing)/strategy-engine/page.tsx:169`) must not change.
- **Motion discipline (from spec):** opacity + transform only; easing `[0.32, 0.72, 0, 1]`; micro-transitions 200–400ms; stage transitions ~500ms; no bouncy springs.
- **Palette:** existing tokens only — `var(--border)`, `var(--brand)`, `var(--brand-strong)`, `var(--card)`, `text-accent`, `text-muted-foreground`, `bg-brand/10`. Fixed oklch values allowed only for the decorative amber/green status colors (pattern already used in `BotLogFeed.tsx:26-33`).
- **Copy in `lib/strategy-content.ts` (`LOOP_STAGES`) must not change.**
- **Reduced motion:** static composed frame (Diagnose vignette, all nodes, differentiator arc), no timers. Use the existing `useIsomorphicReducedMotion()` hook — never Motion's own `useReducedMotion()` (hydration mismatch, see `lib/use-reduced-motion.ts` doc comment).
- **Accessibility:** the diagram stays `aria-hidden`; the legend `<ol>` remains the semantic content.
- **Verification commands** (no test runner exists in this repo): `pnpm typecheck`, `pnpm lint`, `pnpm build`, plus headless-Chrome screenshots. Headless Chrome clamps below ~500px width — never screenshot narrower than 500px.
- Commit style: `feat(strategy): …` with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` trailer.

## Shared Design Facts (referenced by every task)

- Ring geometry (unchanged from current file): viewBox `0 0 100 100`, radius 38, stage `i` at −90° + i·60°.
- Step timing: `STEP_MS = [3000, 3200, 3200, 3000, 3600, 3800, 2200]` — indexes 0–5 are stages Define…Prove, index 6 is the feedback beat. Full cycle ≈ 22.1s.
- During the feedback beat (`step === 6`), the *stage* remains 5 (Prove): the Prove vignette stays mounted, all six nodes read "done", the progress arc fades out, a particle travels the Prove→Measure chord, the "evidence feeds back" pill appears.
- Screen: 48% of ring width, centered; header strip (logo chip + "strategy engine" + `NN/06` counter); body height 140px (116px compact).

---

### Task 1: Rebuild the orchestrator with placeholder vignettes

**Files:**
- Create: `components/marketing/visuals/strategy-loop-vignettes.tsx`
- Modify: `components/marketing/visuals/StrategyLoopOrbit.tsx` (full rewrite, keep export)

**Interfaces:**
- Consumes: `LOOP_STAGES` from `@/lib/strategy-content` (stage ids: `define`, `measure`, `diagnose`, `prioritize`, `verify`, `prove`; fields `id`, `n`, `verb`, `title`, `blurb`, `icon`, `differentiator?`), `useIsomorphicReducedMotion` from `@/lib/use-reduced-motion`, `LogoGlyph` from `@/components/marketing/Logo`, `cn` from `@/lib/utils`.
- Produces (Tasks 2–3 rely on these exact names):
  - `EASE: readonly [0.32, 0.72, 0, 1]` exported from `strategy-loop-vignettes.tsx`
  - `VIGNETTES: Record<string, React.ComponentType>` exported from `strategy-loop-vignettes.tsx` — keys are the six stage ids; components take **no props** and render into a `h-[140px]` (or 116px compact) container with `absolute inset-0` parent.
  - Orchestrator behavior contract: a vignette is mounted when its stage activates and unmounted ~500ms after the stage ends (AnimatePresence exit), so vignettes play on mount and must clean up any internal timers on unmount.

- [ ] **Step 1: Create the vignettes module with placeholders**

Write `components/marketing/visuals/strategy-loop-vignettes.tsx`:

```tsx
"use client";

import * as React from "react";

/* Spec easing: confident, no bounce. Shared by orchestrator and vignettes. */
export const EASE = [0.32, 0.72, 0, 1] as const;

/* Placeholder scenes — replaced stage by stage in follow-up tasks. */
function makePlaceholder(verb: string, title: string) {
  return function PlaceholderVignette() {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 p-3 text-center">
        <p className="text-sm font-semibold tracking-tight text-foreground">
          {verb}
        </p>
        <p className="text-[0.6rem] text-muted-foreground">{title}</p>
      </div>
    );
  };
}

/**
 * One micro-scene per loop stage, keyed by LOOP_STAGES id. Each component
 * takes no props, plays on mount, and must clear its own timers on unmount
 * (the orchestrator mounts/unmounts vignettes via AnimatePresence).
 */
export const VIGNETTES: Record<string, React.ComponentType> = {
  define: makePlaceholder("Define", "Scope the campaign"),
  measure: makePlaceholder("Measure", "See how AI answers"),
  diagnose: makePlaceholder("Diagnose", "Find the weak signals"),
  prioritize: makePlaceholder("Prioritize", "Rank the moves"),
  verify: makePlaceholder("Verify", "Confirm it shipped"),
  prove: makePlaceholder("Prove", "Measure the lift"),
};
```

- [ ] **Step 2: Rewrite the orchestrator**

Replace the entire contents of `components/marketing/visuals/StrategyLoopOrbit.tsx` with:

```tsx
"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
} from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { LogoGlyph } from "@/components/marketing/Logo";
import { LOOP_STAGES } from "@/lib/strategy-content";
import {
  EASE,
  VIGNETTES,
} from "@/components/marketing/visuals/strategy-loop-vignettes";
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

/* Full ring drawn clockwise from the top — the progress arc fills this path. */
const RING =
  "M 50 12 A 38 38 0 0 1 88 50 A 38 38 0 0 1 50 88 A 38 38 0 0 1 12 50 A 38 38 0 0 1 50 12";
/* The Verify→Prove segment (θ 125°→235°) — the differentiator arc. */
const DIFF_ARC = "M 28.2 81.1 A 38 38 0 0 1 28.2 18.9";
/* Prove→Measure chord — evidence returning for the next measure. */
const FEEDBACK = "M 17.1 31 Q 50 47 82.9 31";

/* Six stage beats + the feedback beat that closes the loop (~22s cycle). */
const STEP_MS = [3000, 3200, 3200, 3000, 3600, 3800, 2200] as const;
const FEEDBACK_STEP = 6;
/* Reduced-motion static frame freezes on Diagnose — mid-loop, most legible. */
const STATIC_STEP = 2;

/**
 * The self-improving loop, played rather than described: a timer steps
 * through the six stages, each playing a miniature product moment in the
 * center screen while its node glows and the ring arc fills; a feedback
 * beat then carries the evidence back from Prove to Measure and the cycle
 * restarts. The diagram is decorative (aria-hidden); the legend list is the
 * semantic content. `compact` shrinks the orbit and drops the stage blurbs
 * (home-page variant). Reduced motion: a static composed frame, no timers.
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
  const playing = !reduced && inView;

  const [rawStep, setRawStep] = React.useState(0);
  React.useEffect(() => {
    if (!playing) return;
    const id = setTimeout(
      () => setRawStep((s) => (s + 1) % STEP_MS.length),
      STEP_MS[rawStep],
    );
    return () => clearTimeout(id);
  }, [playing, rawStep]);

  const step = reduced ? STATIC_STEP : rawStep;
  const stage = step === FEEDBACK_STEP ? 5 : step;
  const Vignette = VIGNETTES[LOOP_STAGES[stage].id];

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
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
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            fill="none"
          >
            <path d={RING} stroke="var(--border)" strokeWidth="1.2" />
            <path
              d={DIFF_ARC}
              stroke="var(--brand)"
              strokeOpacity="0.55"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {reduced ? (
              <path
                d={RING}
                pathLength={1}
                strokeDasharray={`${STATIC_STEP / 6} ${1 - STATIC_STEP / 6}`}
                stroke="var(--brand)"
                strokeOpacity="0.9"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <motion.path
                d={RING}
                stroke="var(--brand)"
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={false}
                animate={{
                  pathLength:
                    step === FEEDBACK_STEP ? 1 : Math.max(step / 6, 0.0001),
                  /* Invisible at Define (nothing completed yet) and while
                     fading out during the feedback beat's reset. */
                  opacity: step === 0 || step === FEEDBACK_STEP ? 0 : 0.9,
                }}
                transition={{
                  pathLength:
                    step === 0
                      ? { duration: 0 }
                      : { duration: 0.7, ease: EASE },
                  opacity:
                    step === FEEDBACK_STEP
                      ? { duration: 1.2, delay: 0.8 }
                      : { duration: 0.3 },
                }}
              />
            )}
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
              strokeOpacity={step === FEEDBACK_STEP ? 0.8 : 0.3}
              strokeWidth="1.4"
              strokeDasharray="3 3"
              markerEnd={`url(#${markerId})`}
              className={cn(
                "transition-[stroke-opacity] duration-500",
                playing && step === FEEDBACK_STEP && "orbit-dash",
              )}
            />
            {playing && step === FEEDBACK_STEP ? (
              <circle r="1.7" fill="var(--brand-strong)">
                <animateMotion
                  dur="1.8s"
                  repeatCount="1"
                  fill="freeze"
                  path={FEEDBACK}
                />
              </circle>
            ) : null}
          </svg>

          {LOOP_STAGES.map((s, i) => {
            const Icon = s.icon;
            const isActive = !reduced && i === stage;
            const isDone =
              !reduced && (step === FEEDBACK_STEP ? i < 5 : i < stage);
            return (
              <div
                key={s.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${POS[i].x}%`, top: `${POS[i].y}%` }}
              >
                <div className="flex flex-col items-center gap-1">
                  <motion.span
                    initial={false}
                    animate={{ scale: isActive ? 1.12 : 1 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className={cn(
                      "flex items-center justify-center rounded-xl shadow-sm ring-1",
                      "transition-[color,background-color,box-shadow] duration-300",
                      compact ? "size-10" : "size-11",
                      isActive
                        ? "bg-brand/15 ring-brand/60 shadow-[0_0_18px_-2px_var(--brand)]"
                        : isDone
                          ? "bg-brand/10 ring-brand/30"
                          : cn(
                              "bg-card ring-border",
                              reduced &&
                                s.differentiator &&
                                "bg-brand/10 ring-brand/40",
                            ),
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 transition-colors duration-300",
                        isActive || isDone || reduced
                          ? "text-accent"
                          : "text-muted-foreground",
                      )}
                      strokeWidth={1.75}
                    />
                  </motion.span>
                  <span
                    className={cn(
                      "text-[0.7rem] font-semibold transition-colors duration-300",
                      isActive ? "text-accent" : "text-foreground",
                    )}
                  >
                    {s.verb}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="absolute left-1/2 top-1/2 w-[48%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-border bg-card shadow-md">
            <div className="flex items-center gap-1.5 border-b border-border px-2.5 py-1.5">
              <span className="flex size-4 items-center justify-center rounded bg-surface-dark">
                <LogoGlyph className="h-2.5 w-2.5" />
              </span>
              <span className="label-mono text-[0.5rem] text-muted-foreground">
                strategy engine
              </span>
              <span className="label-mono ml-auto text-[0.5rem] tabular-nums text-accent">
                {String(stage + 1).padStart(2, "0")}/06
              </span>
            </div>
            <div
              className={cn("relative", compact ? "h-[116px]" : "h-[140px]")}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Vignette />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {step === FEEDBACK_STEP ? (
              <motion.span
                key="feedback-pill"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute left-1/2 top-[24%] flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5"
              >
                <RefreshCw className="size-3 text-accent" />
                <span className="label-mono whitespace-nowrap text-[0.55rem] text-accent">
                  evidence feeds back
                </span>
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>

        <ol className={cn("flex flex-col", compact ? "gap-2.5" : "gap-4")}>
          {LOOP_STAGES.map((s, i) => {
            const isActive = !reduced && i === stage;
            return (
              <li
                key={s.id}
                className={cn(
                  "flex items-baseline gap-3 transition-opacity duration-300",
                  !reduced && !isActive && "opacity-55",
                )}
              >
                <span
                  className={cn(
                    "label-mono text-xs transition-colors duration-300",
                    isActive ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  {String(s.n).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold tracking-tight text-foreground">
                    <span className="text-accent">{s.verb}.</span> {s.title}
                    {s.differentiator ? (
                      <span className="label-mono ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[0.55rem] text-accent">
                        what others skip
                      </span>
                    ) : null}
                  </p>
                  {!compact ? (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {s.blurb}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </MotionConfig>
  );
}
```

Notes on intent (do not skip):
- The old always-visible center logo block, the always-visible "evidence feeds back" pill, and the 16s orbiting dot are **gone** — replaced by the screen, the feedback-beat pill, and the progress arc respectively.
- `orbit-dash` (marching-ants keyframes in `app/globals.css:217`) is reused for the chord during the feedback beat only. Do not delete the CSS.
- The legend keeps its exact semantic structure; only opacity/color classes were added.
- Vignettes replay on stage re-entry because `AnimatePresence` remounts by `key={stage}`; during the feedback beat `stage` stays 5, so the Prove vignette does **not** remount.
- Known accepted behavior: on first page load below the fold, the Define vignette settles to its end state before the section scrolls into view; the cycle starts advancing once `useInView` fires. This is fine.

- [ ] **Step 3: Typecheck and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: both exit 0, no errors.

- [ ] **Step 4: Visual check — the cycle plays**

```bash
pnpm dev &   # background; note the port (default 3000)
sleep 6
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SCRATCH=/private/tmp/claude-501/-Users-ashtoncochrane-Git-heyotis-heyotis-marketing/8e31ce85-8993-4b08-8ae8-00c593d61a62/scratchpad
"$CHROME" --headless=new --disable-gpu --window-size=1440,3600 \
  --virtual-time-budget=4000 --screenshot="$SCRATCH/loop-t4.png" \
  http://localhost:3000/strategy-engine
"$CHROME" --headless=new --disable-gpu --window-size=1440,3600 \
  --virtual-time-budget=11000 --screenshot="$SCRATCH/loop-t11.png" \
  http://localhost:3000/strategy-engine
"$CHROME" --headless=new --disable-gpu --window-size=1440,3600 \
  --virtual-time-budget=19000 --screenshot="$SCRATCH/loop-t19.png" \
  http://localhost:3000/strategy-engine
```

Read the three screenshots and confirm: different stages are active at each timestamp (different node glowing, different `NN/06` counter, different placeholder text in the screen), the progress arc grows between t4 and t11, and the legend dims all rows except the active one. Also capture the home page (`http://localhost:3000/`) once to confirm the compact variant renders without overflow.

- [ ] **Step 5: Commit**

```bash
git add components/marketing/visuals/StrategyLoopOrbit.tsx components/marketing/visuals/strategy-loop-vignettes.tsx
git commit -m "feat(strategy): rebuild loop orbit as auto-playing story loop

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Vignettes — Define, Measure, Diagnose

**Files:**
- Modify: `components/marketing/visuals/strategy-loop-vignettes.tsx`

**Interfaces:**
- Consumes: `EASE` (same file), `cn` from `@/lib/utils`, icons from `lucide-react`.
- Produces: real components replacing the `define`, `measure`, `diagnose` entries in `VIGNETTES`. Keys and the zero-prop contract are unchanged; the orchestrator needs no edits.

- [ ] **Step 1: Add shared variants and the three vignettes**

In `strategy-loop-vignettes.tsx`, add below the `EASE` export:

```tsx
import { Bot, Check, TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/* Decorative status colors on card surfaces (same pattern as BotLogFeed). */
const AMBER = "text-[oklch(0.72_0.13_75)]";
const GREEN = "text-[oklch(0.55_0.13_160)]";

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};
```

Then the three scenes:

```tsx
/* 01 Define — scope chips slot into the campaign card. */
const SCOPE_CHIPS = ["Brand", "Competitors ×4", "Personas ×3", "Prompts ×24"];

function DefineVignette() {
  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col justify-center gap-2 p-3"
    >
      <motion.p
        variants={item}
        className="label-mono text-[0.5rem] text-muted-foreground"
      >
        campaign scope
      </motion.p>
      <div className="flex flex-wrap gap-1">
        {SCOPE_CHIPS.map((c) => (
          <motion.span
            key={c}
            variants={item}
            className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[0.55rem] font-medium text-accent"
          >
            {c}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* 02 Measure — assistant answers scan in; present in one, absent in another. */
const ANSWERS = [
  { name: "ChatGPT", tag: "cited", ok: true },
  { name: "Claude", tag: "absent", ok: false },
  { name: "Gemini", tag: "stale", ok: false },
] as const;

function MeasureVignette() {
  return (
    <div className="relative flex h-full flex-col justify-center gap-1.5 overflow-hidden p-3">
      <motion.div
        variants={list}
        initial="hidden"
        animate="show"
        className="contents"
      >
        {ANSWERS.map((a) => (
          <motion.div
            key={a.name}
            variants={item}
            className="flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1"
          >
            <Bot className="size-2.5 shrink-0 text-muted-foreground" />
            <span className="text-[0.55rem] font-semibold text-foreground">
              {a.name}
            </span>
            <span className="h-1 min-w-0 flex-1 rounded-full bg-border" />
            <span
              className={cn(
                "label-mono text-[0.45rem]",
                a.ok ? "text-accent" : "text-muted-foreground",
              )}
            >
              {a.tag}
            </span>
          </motion.div>
        ))}
      </motion.div>
      <motion.span
        className="pointer-events-none absolute inset-x-2 top-0 h-8 bg-gradient-to-b from-transparent via-brand/15 to-transparent"
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 148, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.4, delay: 0.8, ease: "linear" }}
      />
    </div>
  );
}

/* 03 Diagnose — the same surfaces re-read as findings, flags land. */
const FINDINGS = [
  { text: "schema missing", warn: true },
  { text: "pricing outdated", warn: true },
  { text: "source cited", warn: false },
] as const;

function DiagnoseVignette() {
  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col justify-center gap-1.5 p-3"
    >
      {FINDINGS.map((f) => (
        <motion.div
          key={f.text}
          variants={item}
          className="flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1"
        >
          <span className="text-[0.55rem] font-medium text-foreground">
            {f.text}
          </span>
          <motion.span
            className="ml-auto"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1.1, ease: EASE }}
          >
            {f.warn ? (
              <TriangleAlert className={cn("size-3", AMBER)} />
            ) : (
              <Check className={cn("size-3", GREEN)} />
            )}
          </motion.span>
        </motion.div>
      ))}
      <motion.p
        className="label-mono text-[0.45rem] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.6 }}
      >
        2 findings · evidence attached
      </motion.p>
    </motion.div>
  );
}
```

Replace the three placeholder entries:

```tsx
export const VIGNETTES: Record<string, React.ComponentType> = {
  define: DefineVignette,
  measure: MeasureVignette,
  diagnose: DiagnoseVignette,
  prioritize: makePlaceholder("Prioritize", "Rank the moves"),
  verify: makePlaceholder("Verify", "Confirm it shipped"),
  prove: makePlaceholder("Prove", "Measure the lift"),
};
```

- [ ] **Step 2: Typecheck and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: both exit 0.

- [ ] **Step 3: Visual check**

With the dev server running, capture `--virtual-time-budget=1500` (Define), `=4500` (Measure), `=8000` (Diagnose) screenshots of `http://localhost:3000/strategy-engine` (same Chrome invocation as Task 1 Step 4, new filenames). Confirm: chips visible in Define; three assistant rows with `cited`/`absent`/`stale` tags in Measure; amber triangles + green check + "2 findings" caption in Diagnose. Confirm text fits the screen at compact size too (home page screenshot).

- [ ] **Step 4: Commit**

```bash
git add components/marketing/visuals/strategy-loop-vignettes.tsx
git commit -m "feat(strategy): define, measure and diagnose loop vignettes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Vignettes — Prioritize, Verify, Prove

**Files:**
- Modify: `components/marketing/visuals/strategy-loop-vignettes.tsx`

**Interfaces:**
- Consumes: `EASE`, `list`, `item`, `AMBER`, `GREEN` from Task 2 (same file).
- Produces: real components for `prioritize`, `verify`, `prove`; `makePlaceholder` deleted.

- [ ] **Step 1: Add the three vignettes**

Extend the imports:

```tsx
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
```

(Keep the existing named imports; this replaces the Task 2 `motion` import line.)

```tsx
/* 04 Prioritize — moves re-rank by impact. */
const MOVES = [
  { text: "Refresh pricing page", impact: 7.5 },
  { text: "Add product schema", impact: 9.2 },
  { text: "Publish comparison", impact: 5.1 },
] as const;

function PrioritizeVignette() {
  const [sorted, setSorted] = React.useState(false);
  React.useEffect(() => {
    const id = setTimeout(() => setSorted(true), 1100);
    return () => clearTimeout(id);
  }, []);
  const moves = sorted
    ? [...MOVES].sort((a, b) => b.impact - a.impact)
    : [...MOVES];
  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col justify-center gap-1.5 p-3"
    >
      {moves.map((m) => (
        <motion.div
          key={m.text}
          layout
          variants={item}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1"
        >
          <span className="min-w-0 flex-1 truncate text-[0.55rem] font-medium text-foreground">
            {m.text}
          </span>
          <span className="h-1 w-10 overflow-hidden rounded-full bg-border">
            <span
              className="block h-full rounded-full bg-brand-strong/60"
              style={{ width: `${m.impact * 10}%` }}
            />
          </span>
          <span className="label-mono text-[0.45rem] tabular-nums text-muted-foreground">
            {m.impact.toFixed(1)}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* 05 Verify — the detector marks the top move live. No self-reporting. */
function VerifyVignette() {
  const [live, setLive] = React.useState(false);
  React.useEffect(() => {
    const id = setTimeout(() => setLive(true), 1400);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-3">
      <p className="label-mono text-[0.5rem] text-muted-foreground">
        detector · your surfaces
      </p>
      <div className="flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1.5">
        <span className="min-w-0 flex-1 truncate text-[0.55rem] font-medium text-foreground">
          Add product schema
        </span>
        <AnimatePresence mode="wait" initial={false}>
          {live ? (
            <motion.span
              key="live"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={cn(
                "label-mono flex items-center gap-1 text-[0.45rem]",
                GREEN,
              )}
            >
              <Check className="size-2.5" /> live · 14:02
            </motion.span>
          ) : (
            <motion.span
              key="watching"
              exit={{ opacity: 0 }}
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="label-mono text-[0.45rem] text-muted-foreground"
            >
              monitoring…
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <motion.p
        className="label-mono text-[0.45rem] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: live ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        change detected on site — marked done
      </motion.p>
    </div>
  );
}

/* 06 Prove — recommendation share lifts; evidence stamped. */
const PROVE_PATH = "M 2 44 H 32 V 34 H 62 V 26 H 92 V 14 H 118";

function ProveVignette() {
  const count = useMotionValue(18);
  const label = useTransform(count, (v) => `${Math.round(v)}%`);
  React.useEffect(() => {
    const controls = animate(count, 24, {
      duration: 1.4,
      delay: 0.5,
      ease: EASE,
    });
    return () => controls.stop();
  }, [count]);
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 p-3">
      <div className="flex items-baseline justify-between">
        <p className="label-mono text-[0.5rem] text-muted-foreground">
          recommendation share
        </p>
        <motion.span className="text-sm font-semibold tabular-nums text-foreground">
          {label}
        </motion.span>
      </div>
      <svg viewBox="0 0 120 52" className="w-full" aria-hidden>
        <line
          x1="2"
          x2="118"
          y1="44"
          y2="44"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <motion.path
          d={PROVE_PATH}
          fill="none"
          stroke="var(--brand-strong)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
      </svg>
      <motion.span
        className="label-mono self-start rounded-full bg-brand/10 px-1.5 py-0.5 text-[0.45rem] text-accent"
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 1.9, ease: EASE }}
      >
        evidence #1284 ✓
      </motion.span>
    </div>
  );
}
```

Update the record and delete `makePlaceholder` entirely:

```tsx
export const VIGNETTES: Record<string, React.ComponentType> = {
  define: DefineVignette,
  measure: MeasureVignette,
  diagnose: DiagnoseVignette,
  prioritize: PrioritizeVignette,
  verify: VerifyVignette,
  prove: ProveVignette,
};
```

- [ ] **Step 2: Typecheck and lint**

Run: `pnpm typecheck && pnpm lint`
Expected: both exit 0 (in particular, no unused `makePlaceholder`).

- [ ] **Step 3: Visual check**

Screenshots at `--virtual-time-budget=10500` (Prioritize), `=13500` (Verify pre/post flip — take 13000 and 14000 if ambiguous), `=17500` (Prove), `=21000` (feedback beat: pill visible, chord bright). Confirm: moves sorted descending by bar length; green "live · 14:02" pill; chart drawn with "24%" and evidence stamp; feedback pill + particle frame.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/visuals/strategy-loop-vignettes.tsx
git commit -m "feat(strategy): prioritize, verify and prove loop vignettes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Reduced motion, dark mode, build verification

**Files:**
- Modify (only if checks fail): `components/marketing/visuals/StrategyLoopOrbit.tsx`, `components/marketing/visuals/strategy-loop-vignettes.tsx`

**Interfaces:**
- Consumes: everything from Tasks 1–3.
- Produces: verified feature; no interface changes.

- [ ] **Step 1: Reduced-motion static frame**

```bash
"$CHROME" --headless=new --disable-gpu --window-size=1440,3600 \
  --force-prefers-reduced-motion --virtual-time-budget=6000 \
  --screenshot="$SCRATCH/loop-reduced.png" http://localhost:3000/strategy-engine
```

Confirm: Diagnose vignette in the screen, progress arc statically at 2/6, no feedback pill, all legend rows at full opacity, differentiator nodes tinted.

- [ ] **Step 2: Dark mode**

Capture `http://localhost:3000/strategy-engine` with `--force-dark-mode` (and the site's own dark theme if it's class-based — check how `:root[data-theme]`/`.dark` is toggled in `app/globals.css` and replicate; if theme is media-query based, add `--force-color-scheme=dark`). Confirm screen card, rows (`bg-muted/60`), and status colors stay legible.

- [ ] **Step 3: Production build**

Run: `pnpm build`
Expected: build succeeds with no errors or new warnings.

- [ ] **Step 4: Final visual pass on both placements**

Screenshot home (`/`, compact variant) and `/strategy-engine` at two virtual-time budgets each. Confirm no overflow at the compact size and that both cycle correctly. Fix anything found; re-run the failed check.

- [ ] **Step 5: Commit (only if fixes were made)**

```bash
git add -A components/marketing/visuals
git commit -m "fix(strategy): loop animation polish from verification pass

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Self-Review Notes

- **Spec coverage:** auto-playing loop ✓ (Task 1 state machine); ring-as-frame + center screen ✓ (Task 1); six miniature product moments ✓ (Tasks 2–3, copy matches spec table); feedback beat with particle + pill ✓ (Task 1); legend sync ✓ (Task 1); professionalism constraints ✓ (EASE constant, opacity/transform only, token palette); same export/props ✓; reduced-motion static frame ✓ (Task 1 + Task 4 verification); performance ✓ (no layout animation except Prioritize's `layout` reorder, which is transform-based; SMIL particle matches existing codebase idiom); compact variant ✓.
- **Type consistency:** `VIGNETTES: Record<string, React.ComponentType>` and `EASE` are defined in Task 1 and consumed by name in Tasks 2–3; stage ids match `LOOP_STAGES` in `lib/strategy-content.ts:32-89`.
- **Placeholder scan:** all code blocks complete; the only "placeholder" is the deliberate `makePlaceholder` scaffold, created in Task 1 and deleted in Task 3.
