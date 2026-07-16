# Nory Card System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the tilted-tablet reveal, orbit-ring loop and coverage beam with Nory-grammar card sections — beige stages, periwinkle banners, lime/salmon delta chips, AEO metric fragments — per the approved spec.

**Architecture:** Three new section components (`PlatformCard`, `EvidenceCards`, `AnswerReel`) plus one new visual (`LoopBento`) built on shared stage primitives (`components/marketing/primitives/stage.tsx`) and three new color tokens. Old components (`ProductReveal`/`ContainerScroll`, `StrategyLoopOrbit`+vignettes, `AiSourceBeam`) are deleted after their call sites are swapped.

**Tech Stack:** Next.js 16 App Router, React 19, Motion 12 (`motion/react`), Tailwind 4 oklch tokens, lucide-react + @lobehub/icons, existing `NumberTicker`.

**Spec:** `docs/superpowers/specs/2026-07-16-nory-card-system-design.md`

## Global Constraints

- No new dependencies.
- Motion discipline: transform/opacity only; shared `EASE = [0.32, 0.72, 0, 1]` (moves to `lib/ease.ts` in Task 1 — the old export dies with the vignettes file in Task 4); micro 200–400ms, section moves ~500–700ms; no springs.
- Reduced motion: every animated component uses `useIsomorphicReducedMotion()` (never Motion's `useReducedMotion` — hydration) and renders a composed static frame with no timers.
- Timers/reels gate on `useInView` and clean up on unmount.
- Chips: lime/salmon/periwinkle always carry near-black text (`text-foreground`).
- Sample data keeps the existing honesty convention: numbers already used on the site (34.8%, +12.4 pts, 1.4→4.9 = +250% attribution, +300% Halenstein) and "Sample"/"Illustrative" labels where a card implies real customer data.
- `LOOP_STAGES` copy in `lib/strategy-content.ts` is consumed, never edited.
- Decorative scenes are `aria-hidden`; real copy stays in semantic elements.
- Verification (no test runner): `pnpm typecheck && pnpm lint`, `pnpm build`, real-wall-clock CDP screenshots (never `--virtual-time-budget` for animation states), 500px overflow scan.
- Commits: `feat(marketing): …` + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Keep `components/ui/animated-beam.tsx` (SignalIntake still uses it). Delete `components/ui/container-scroll-animation.tsx` (sole consumer dies in Task 2).

---

### Task 1: Tokens, easing module, stage primitives

**Files:**
- Modify: `app/globals.css` (`:root` block ~line 23-45 area; `@theme inline` block ~line 67+)
- Create: `lib/ease.ts`
- Create: `components/marketing/primitives/stage.tsx`

**Interfaces:**
- Produces: CSS utilities `bg-stage`, `bg-periwinkle`, `bg-lime` (+ existing `bg-salmon`); `EASE` from `@/lib/ease`; `Stage`, `BannerTile`, `Chip` from `@/components/marketing/primitives/stage`.
  - `Stage({ className?, children })` — beige inset panel.
  - `BannerTile({ icon?, label, right?, className? })` — periwinkle banner row.
  - `Chip({ tone: "lime" | "salmon" | "neutral", className?, children })` — status/delta chip.

- [ ] **Step 1: Add tokens.** In `app/globals.css`, immediately after the `--salmon:` line in `:root`, add:

```css
  /* Nory-grammar card system (2026-07 visual rebuild) */
  --stage: oklch(0.945 0.012 85);        /* warm beige inset panels   */
  --periwinkle: oklch(0.75 0.1 285);     /* banner tiles, dark text   */
  --lime: oklch(0.9 0.17 125);           /* positive delta/status     */
```

In the `@theme inline` block, next to `--color-salmon`, add:

```css
  --color-stage: var(--stage);
  --color-periwinkle: var(--periwinkle);
  --color-lime: var(--lime);
```

- [ ] **Step 2: Create `lib/ease.ts`:**

```ts
/* Spec easing: confident, no bounce. One curve for the whole site. */
export const EASE = [0.32, 0.72, 0, 1] as const;
```

- [ ] **Step 3: Create `components/marketing/primitives/stage.tsx`:**

```tsx
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Warm beige inset panel that holds product fragments inside a card. */
export function Stage({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl bg-stage p-4 sm:p-5", className)}>
      {children}
    </div>
  );
}

/** Periwinkle banner row — context label for a stage (Nory's location tile). */
export function BannerTile({
  icon: Icon,
  label,
  right,
  className,
}: {
  icon?: LucideIcon;
  label: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl bg-periwinkle px-4 py-2.5",
        className,
      )}
    >
      {Icon ? <Icon className="size-4 text-foreground/70" strokeWidth={2} /> : null}
      <span className="text-sm font-bold tracking-tight text-foreground">
        {label}
      </span>
      {right ? (
        <span className="ml-auto text-xs font-semibold text-foreground/60">
          {right}
        </span>
      ) : null}
    </div>
  );
}

/** Status / delta chip. Lime = up/good, salmon = down/bad, neutral = beige. */
export function Chip({
  tone,
  className,
  children,
}: {
  tone: "lime" | "salmon" | "neutral";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[0.7rem] font-bold text-foreground",
        tone === "lime" && "bg-lime",
        tone === "salmon" && "bg-salmon",
        tone === "neutral" && "bg-stage",
        className,
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Verify.** Run: `pnpm typecheck && pnpm lint` → both exit 0.

- [ ] **Step 5: Commit.**

```bash
git add app/globals.css lib/ease.ts components/marketing/primitives/stage.tsx
git commit -m "feat(marketing): stage/banner/chip primitives + nory-grammar tokens

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: PlatformCard (metric reel) replaces the tilted tablet

**Files:**
- Create: `components/marketing/sections/PlatformCard.tsx`
- Modify: `app/(marketing)/page.tsx` (import + `<ProductReveal />` at line ~85)
- Delete: `components/marketing/sections/ProductReveal.tsx`, `components/ui/container-scroll-animation.tsx`

**Interfaces:**
- Consumes: `Stage`, `BannerTile`, `Chip`, `EASE`, `NumberTicker`, `Eyebrow`, `useIsomorphicReducedMotion`, `Section` primitive (`@/components/marketing/primitives/Section`).
- Produces: `export function PlatformCard()` — self-contained section including its own `<Section>` wrapper and `id="product"` anchor (the Hero's "See the platform ↓" link targets it).

- [ ] **Step 1: Create `components/marketing/sections/PlatformCard.tsx`:**

```tsx
"use client";

import * as React from "react";
import { Crosshair } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { Section } from "@/components/marketing/primitives/Section";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { Stage, BannerTile, Chip } from "@/components/marketing/primitives/stage";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

const TICK_MS = 2800;

/* One believable AEO metric tile per beat. Values echo the site's existing
   sample story (34.8% visibility, +96% referrals, 1.4→4.9 attribution). */
const TILES = [
  {
    key: "visibility",
    cap: "AI visibility",
    render: (live: boolean) => (
      <>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            {live ? <NumberTicker value={34.8} startValue={20} decimalPlaces={1} /> : "34.8"}
            %
          </span>
          <Chip tone="lime">▲ 12.4 pts</Chip>
        </div>
        <Bars heights={[30, 38, 42, 47, 58, 66, 84]} />
      </>
    ),
  },
  {
    key: "sentiment",
    cap: "Answer sentiment",
    render: () => (
      <>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            +0.62
          </span>
          <Chip tone="lime">▲ 0.08</Chip>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          &ldquo;a reliable, well-priced choice&rdquo; — ChatGPT, this week
        </p>
      </>
    ),
  },
  {
    key: "citations",
    cap: "Citations won",
    render: () => (
      <>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            41
          </span>
          <Chip tone="salmon">▼ 2 this week</Chip>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Top source: your pricing page · 14 answers
        </p>
      </>
    ),
  },
  {
    key: "traffic",
    cap: "AI referral sessions",
    render: () => (
      <>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
            +96%
          </span>
          <Chip tone="lime">30-day window</Chip>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          chatgpt.com +128% · perplexity.ai +64%
        </p>
      </>
    ),
  },
] as const;

function Bars({ heights }: { heights: number[] }) {
  return (
    <div aria-hidden className="mt-2 flex h-9 items-end gap-1">
      {heights.map((h, i) => (
        <motion.span
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: EASE }}
          style={{ height: `${h}%` }}
          className={cn(
            "w-2.5 origin-bottom rounded-t",
            i === heights.length - 1 ? "bg-brand" : "bg-periwinkle/60",
          )}
        />
      ))}
    </div>
  );
}

function MetricTile({ tile, live }: { tile: (typeof TILES)[number]; live: boolean }) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-sm">
      <p className="label-mono text-[0.6rem] text-muted-foreground">{tile.cap}</p>
      <div className="mt-1.5">{tile.render(live)}</div>
    </div>
  );
}

/**
 * "The platform" as a Nory-style card: text left, beige stage right with a
 * periwinkle campaign banner and a slow vertical reel of AEO metric tiles.
 * Reduced motion / off-screen: static first two tiles, no timers.
 */
export function PlatformCard() {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const playing = !reduced && inView;

  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setIdx((i) => i + 1), TICK_MS);
    return () => clearInterval(id);
  }, [playing]);

  /* Window of two tiles; the reel advances one tile per tick. */
  const visible = [idx, idx + 1].map((k) => ({
    key: k,
    tile: TILES[k % TILES.length],
  }));

  return (
    <Section surface="cream" id="product">
      <div
        ref={ref}
        className="grid items-center gap-10 rounded-3xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16"
      >
        <div>
          <Eyebrow>The platform</Eyebrow>
          <h2 className="display-md mt-4 max-w-md text-balance text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Your brand&rsquo;s standing in AI search, in one place
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Visibility, sentiment, citations and the traffic AI sends you —
            measured across every assistant, moving in one direction.
          </p>
          <a
            href="/features"
            className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Tour the platform →
          </a>
        </div>

        <Stage aria-hidden className="relative">
          <BannerTile icon={Crosshair} label="Everyday range · NZ" right="Sample" />
          {reduced ? (
            <div className="mt-3 flex flex-col gap-3">
              <MetricTile tile={TILES[0]} live={false} />
              <MetricTile tile={TILES[1]} live={false} />
            </div>
          ) : (
            <div className="relative mt-3 h-[264px] overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map(({ key, tile }) => (
                  <motion.div
                    key={key}
                    layout
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -28 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mb-3"
                  >
                    <MetricTile tile={tile} live={playing} />
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-stage to-transparent" />
            </div>
          )}
        </Stage>
      </div>
    </Section>
  );
}
```

Note: `Stage` renders a plain div — `aria-hidden` passes through only if Stage spreads props. It does not. Instead wrap: change the `Stage` usage to `<div aria-hidden><Stage …>…</Stage></div>` OR (preferred, do this) add `aria-hidden` support by giving Stage's outer div `aria-hidden={ariaHidden}`… Keep it simple: wrap the `<Stage>` in `<div aria-hidden>` in this and every later section. The code above should be written with that wrapper.

- [ ] **Step 2: Swap the home page.** In `app/(marketing)/page.tsx`: replace the `ProductReveal` import with `import { PlatformCard } from "@/components/marketing/sections/PlatformCard";` and replace `<ProductReveal />` with `<PlatformCard />`.

- [ ] **Step 3: Delete retired files.**

```bash
git rm components/marketing/sections/ProductReveal.tsx components/ui/container-scroll-animation.tsx
```

- [ ] **Step 4: Verify.** `pnpm typecheck && pnpm lint` → exit 0. Dev server: real-time CDP screenshot of `/#product` at t=2s and t=5s — banner + two tiles visible, reel advanced between shots, no blank window (popLayout overlap).

- [ ] **Step 5: Commit.**

```bash
git add -A && git commit -m "feat(marketing): PlatformCard metric reel replaces tilted-tablet reveal

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: EvidenceCards half-card row + stat band content

**Files:**
- Create: `components/marketing/sections/EvidenceCards.tsx`
- Modify: `app/(marketing)/page.tsx` (insert `<EvidenceCards />` between `<PlatformCard />` and the "Why it matters" Section; trim `STATS` at line ~22 to three entries; pass `className="lg:grid-cols-3"` to `StatBand`)

**Interfaces:**
- Consumes: `Stage`, `Chip`, `EASE`, `SIGNAL_STREAMS` from `@/lib/strategy-content` (fields `id`, `short`, `icon`), `LogoGlyph`, `useIsomorphicReducedMotion`, `Section`, `Eyebrow`.
- Produces: `export function EvidenceCards()` — self-contained `<Section surface="cream">` with the two half-cards.

- [ ] **Step 1: Create `components/marketing/sections/EvidenceCards.tsx`:**

```tsx
"use client";

import * as React from "react";
import { CircleCheck, TriangleAlert, TrendingUp } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { Section } from "@/components/marketing/primitives/Section";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { Stage, Chip } from "@/components/marketing/primitives/stage";
import { LogoGlyph } from "@/components/marketing/Logo";
import { SIGNAL_STREAMS } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/* ── Card A: findings pills ─────────────────────────────────────────────── */

const PILLS = [
  { icon: TriangleAlert, tone: "salmon" as const, text: "Schema missing on /products" },
  { icon: CircleCheck, tone: "lime" as const, text: "Move verified live · 14:02" },
  { icon: TrendingUp, tone: "lime" as const, text: "Citations +3 this week" },
  { icon: TriangleAlert, tone: "salmon" as const, text: "Pricing page 90 days stale" },
  { icon: CircleCheck, tone: "lime" as const, text: "Prove: attribution lift +250%" },
];

const PILL_TICK_MS = 2200;
const PILL_WINDOW = 3;

function FindingsPills({ playing, reduced }: { playing: boolean; reduced: boolean }) {
  const [count, setCount] = React.useState(PILL_WINDOW);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setCount((c) => c + 1), PILL_TICK_MS);
    return () => clearInterval(id);
  }, [playing]);

  const pills = [];
  for (let i = Math.max(0, count - PILL_WINDOW); i < count; i++) {
    pills.push({ ...PILLS[i % PILLS.length], key: i });
  }

  return (
    <div aria-hidden>
      <Stage className="flex h-[190px] flex-col justify-end gap-2.5 overflow-hidden">
        <AnimatePresence initial={false}>
          {pills.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.key}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex w-fit items-center gap-2 rounded-full bg-card py-1.5 pl-2 pr-3.5 shadow-sm"
              >
                <Chip tone={p.tone} className="rounded-full px-1.5 py-1">
                  <Icon className="size-3.5" strokeWidth={2.25} />
                </Chip>
                <span className="text-sm font-medium text-foreground">{p.text}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Stage>
    </div>
  );
}

/* ── Card B: signal cluster ─────────────────────────────────────────────── */

/* Five sources arranged around the center glyph (percent coordinates). */
const CLUSTER_POS = [
  { left: "18%", top: "16%" },
  { left: "82%", top: "20%" },
  { left: "14%", top: "78%" },
  { left: "84%", top: "76%" },
  { left: "50%", top: "8%" },
] as const;

const HIGHLIGHT_MS = 2000;

function SignalCluster({ playing, reduced }: { playing: boolean; reduced: boolean }) {
  const [hot, setHot] = React.useState(0);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () => setHot((h) => (h + 1) % SIGNAL_STREAMS.length),
      HIGHLIGHT_MS,
    );
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div aria-hidden>
      <Stage className="relative h-[190px]">
        <svg className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
          {CLUSTER_POS.map((p, i) => (
            <line
              key={i}
              x1={p.left}
              y1={p.top}
              x2="50%"
              y2="52%"
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}
        </svg>
        <span className="absolute left-1/2 top-[52%] flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-surface-dark shadow-md">
          <LogoGlyph className="h-6 w-6" />
        </span>
        {SIGNAL_STREAMS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.span
              key={s.id}
              initial={reduced ? false : { opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.09, ease: EASE }}
              style={{ left: CLUSTER_POS[i].left, top: CLUSTER_POS[i].top }}
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-xl bg-card px-2.5 py-1.5 shadow-sm transition-shadow duration-300",
                !reduced && hot === i && "shadow-[0_0_0_2px_var(--periwinkle)]",
              )}
            >
              <Icon className="size-3.5 text-accent" strokeWidth={2} />
              <span className="text-xs font-semibold text-foreground">{s.short}</span>
            </motion.span>
          );
        })}
      </Stage>
    </div>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */

/**
 * Nory's half-card row: findings-as-notifications left, the five signal
 * streams clustered around the engine right. Both stages are decorative;
 * the headings and blurbs carry the meaning.
 */
export function EvidenceCards() {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const playing = !reduced && inView;

  return (
    <Section surface="cream" className="pt-0">
      <div ref={ref} className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <Eyebrow>Findings, not guesses</Eyebrow>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
            The engine tells you what changed — with evidence
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Deterministic detectors watch your surfaces and the answers, so
            every finding arrives verified — not self-reported.
          </p>
          <div className="mt-6">
            <FindingsPills playing={playing} reduced={reduced} />
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <Eyebrow>Every signal, one model</Eyebrow>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
            Answers, bot logs, analytics and your own pages — together
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The engine is only as good as its evidence, so all five signal
            streams flow into one model of the gap.
          </p>
          <div className="mt-6">
            <SignalCluster playing={playing} reduced={reduced} />
          </div>
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Wire into home + trim STATS.** In `app/(marketing)/page.tsx`:
  - Add `import { EvidenceCards } from "@/components/marketing/sections/EvidenceCards";` and insert `<EvidenceCards />` on the line after `<PlatformCard />`.
  - Replace the `STATS` array with (existing claims only, trimmed to three):

```tsx
const STATS = [
  {
    value: 300,
    prefix: "+",
    suffix: "%",
    label: "AI recommendation share lift — Halenstein, Australia",
    customer: "Halenstein",
  },
  {
    value: 6,
    label:
      "AI assistants monitored — ChatGPT, Gemini, Perplexity, Claude, Meta AI & Mistral",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Always-on tracking of how AI answers about you",
  },
];
```

  - Change `<StatBand stats={STATS} />` to `<StatBand stats={STATS} className="lg:grid-cols-3" />`.

- [ ] **Step 3: Verify.** `pnpm typecheck && pnpm lint` → 0. CDP real-time shots at t=2/t=5 of the section: pills ticking upward, cluster highlight moving, three stats.

- [ ] **Step 4: Commit.**

```bash
git add -A && git commit -m "feat(marketing): findings + signal-cluster half-cards, 3-stat band

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: LoopBento replaces the orbit (both pages)

**Files:**
- Create: `components/marketing/visuals/LoopBento.tsx`
- Modify: `app/(marketing)/page.tsx` (~line 110), `app/(marketing)/strategy-engine/page.tsx` (~line 169)
- Delete: `components/marketing/visuals/StrategyLoopOrbit.tsx`, `components/marketing/visuals/strategy-loop-vignettes.tsx`

**Interfaces:**
- Consumes: `LOOP_STAGES` (ids `define|measure|diagnose|prioritize|verify|prove`; fields `n`, `verb`, `title`, `blurb`, `differentiator?`), `Stage`, `Chip`, `EASE`, `NumberTicker`, `useIsomorphicReducedMotion`.
- Produces: `export function LoopBento({ compact = false, className }: { compact?: boolean; className?: string })` — same prop contract the orbit had, so call sites swap 1:1.

- [ ] **Step 1: Create `components/marketing/visuals/LoopBento.tsx`:**

```tsx
"use client";

import * as React from "react";
import { Check, TriangleAlert } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { Stage, Chip } from "@/components/marketing/primitives/stage";
import { NumberTicker } from "@/components/ui/number-ticker";
import { LOOP_STAGES } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/* Decorative status colors on card surfaces (same pattern as BotLogFeed). */
const AMBER = "text-[oklch(0.72_0.13_75)]";
const GREEN = "text-[oklch(0.55_0.13_160)]";

const stageById = Object.fromEntries(LOOP_STAGES.map((s) => [s.id, s]));

/* The six loop stages compressed into four analytics moments. */
const CARDS = [
  { chip: "01–02", stages: [stageById.define, stageById.measure], scene: MeasureScene },
  { chip: "03", stages: [stageById.diagnose], scene: DiagnoseScene },
  { chip: "04", stages: [stageById.prioritize], scene: PrioritizeScene },
  { chip: "05–06", stages: [stageById.verify, stageById.prove], scene: ProveScene, differentiator: true },
];

const scene = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

function MeasureScene({ live }: { live: boolean }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="label-mono text-[0.6rem] text-muted-foreground">
        AI recommendation share
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
          {live ? <NumberTicker value={34.8} startValue={18} decimalPlaces={1} /> : "34.8"}%
        </span>
        <Chip tone="lime">▲ 12.4 pts</Chip>
      </div>
      <div aria-hidden className="mt-2.5 flex h-10 items-end gap-1">
        {[26, 32, 37, 45, 55, 67, 84].map((h, i) => (
          <motion.span
            key={i}
            variants={item}
            style={{ height: `${h}%` }}
            className={cn(
              "w-3 origin-bottom rounded-t",
              i >= 5 ? "bg-brand" : "bg-periwinkle/60",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function DiagnoseScene() {
  const rows = [
    { text: "Schema missing", warn: true, meta: "2 pages" },
    { text: "Pricing stale", warn: true, meta: "1 page" },
    { text: "Citations OK", warn: false, meta: "✓" },
  ];
  return (
    <motion.div variants={scene} className="flex h-full flex-col justify-center gap-2">
      {rows.map((r) => (
        <motion.div
          key={r.text}
          variants={item}
          className="flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 shadow-sm"
        >
          {r.warn ? (
            <TriangleAlert className={cn("size-3.5", AMBER)} />
          ) : (
            <Check className={cn("size-3.5", GREEN)} />
          )}
          <span className="text-xs font-medium text-foreground">{r.text}</span>
          <span className="ml-auto text-[0.65rem] tabular-nums text-muted-foreground">
            {r.meta}
          </span>
        </motion.div>
      ))}
      <motion.p variants={item} className="label-mono text-[0.55rem] text-muted-foreground">
        every finding · evidence attached
      </motion.p>
    </motion.div>
  );
}

function PrioritizeScene({ live }: { live: boolean }) {
  const MOVES = [
    { text: "Refresh pricing page", impact: 7.5 },
    { text: "Add product schema", impact: 9.2 },
    { text: "Publish comparison", impact: 5.1 },
  ];
  const [sorted, setSorted] = React.useState(false);
  React.useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => setSorted(true), 1000);
    return () => clearTimeout(id);
  }, [live]);
  const moves = sorted ? [...MOVES].sort((a, b) => b.impact - a.impact) : MOVES;
  return (
    <motion.div variants={scene} className="flex h-full flex-col justify-center gap-2">
      {moves.map((m) => (
        <motion.div
          key={m.text}
          layout={live}
          variants={item}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 shadow-sm"
        >
          <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
            {m.text}
          </span>
          <span className="h-1.5 w-12 overflow-hidden rounded-full bg-stage">
            <span
              className="block h-full rounded-full bg-brand"
              style={{ width: `${m.impact * 10}%` }}
            />
          </span>
          <span className="text-[0.65rem] font-bold tabular-nums text-muted-foreground">
            {m.impact.toFixed(1)}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

function ProveScene() {
  return (
    <motion.div variants={scene} className="flex h-full flex-col justify-center gap-2.5">
      {[
        { cap: "before", w: "22%", muted: true, v: "1.4%" },
        { cap: "after", w: "72%", muted: false, v: "4.9%" },
      ].map((b) => (
        <motion.div key={b.cap} variants={item} className="flex items-center gap-2">
          <span className="label-mono w-10 text-[0.6rem] text-muted-foreground">{b.cap}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-card shadow-sm">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
              style={{ width: b.w }}
              className={cn(
                "block h-full origin-left rounded-full",
                b.muted ? "bg-border" : "bg-brand",
              )}
            />
          </span>
          <span className="w-9 text-right text-xs font-bold tabular-nums text-foreground">
            {b.v}
          </span>
        </motion.div>
      ))}
      <motion.div variants={item}>
        <Chip tone="lime">✓ change detected live · +250%</Chip>
      </motion.div>
    </motion.div>
  );
}

/**
 * The campaign loop as a bento of four analytics moments. Each card plays its
 * scene once when scrolled into view, then holds. Stage numbers ride the
 * periwinkle chips so the loop order stays legible without any geometry.
 * `compact` (home) drops the blurbs; the full variant (strategy-engine)
 * shows them. Reduced motion: composed static frames, no timers.
 */
export function LoopBento({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25, once: true });
  const live = !reduced && inView;

  return (
    <div ref={ref} className={cn("grid gap-5 sm:grid-cols-2", className)}>
      {CARDS.map((card, ci) => {
        const Scene = card.scene;
        const titleStage = card.stages[card.stages.length - 1];
        return (
          <motion.article
            key={card.chip}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={live || reduced ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, delay: ci * 0.1, ease: EASE }}
            className="rounded-3xl border border-border bg-card p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-periwinkle/35 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-foreground">
                <span className="size-1.5 rounded-full bg-brand" />
                {card.chip} · {card.stages.map((s) => s.verb).join(" & ")}
              </span>
              {card.differentiator ? (
                <span className="label-mono rounded-full bg-brand/10 px-2 py-0.5 text-[0.55rem] text-accent">
                  what others skip
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
              {titleStage.title}
            </h3>
            {!compact ? (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {titleStage.blurb}
              </p>
            ) : null}
            <div aria-hidden className="mt-4">
              <Stage className={cn(compact ? "h-[150px]" : "h-[170px]", "px-4 py-3")}>
                <motion.div
                  variants={scene}
                  initial={reduced ? "show" : "hidden"}
                  animate={live || reduced ? "show" : "hidden"}
                  className="h-full"
                >
                  <Scene live={live} />
                </motion.div>
              </Stage>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
```

Note: `MeasureScene`/`PrioritizeScene` accept `{ live }`; `DiagnoseScene`/`ProveScene` take no props — type `CARDS[].scene` as `React.ComponentType<{ live: boolean }>` and pass `live` to all (unused props are fine; keep the signatures uniform: give DiagnoseScene and ProveScene `_props: { live: boolean }`-compatible signatures by declaring `({ live }: { live: boolean })` and ignoring it, or `(_: { live: boolean })`).

- [ ] **Step 2: Swap both call sites.**
  - `app/(marketing)/page.tsx`: replace the `StrategyLoopOrbit` import with `import { LoopBento } from "@/components/marketing/visuals/LoopBento";` and `<StrategyLoopOrbit compact />` → `<LoopBento compact />`.
  - `app/(marketing)/strategy-engine/page.tsx`: same swap, `<StrategyLoopOrbit />` → `<LoopBento />`.

- [ ] **Step 3: Delete retired files.**

```bash
git rm components/marketing/visuals/StrategyLoopOrbit.tsx components/marketing/visuals/strategy-loop-vignettes.tsx
```

Check nothing else imports them first: `grep -rn "StrategyLoopOrbit\|strategy-loop-vignettes" app components lib` → only the two pages already swapped.

- [ ] **Step 4: Verify.** `pnpm typecheck && pnpm lint` → 0. CDP real-time: home how-it-works section at t=2 (cards staggering in, Measure counting) and t=4 (Prioritize re-ranked, Prove pill visible); strategy-engine full variant shows blurbs. Reduced-motion CDP pass: static frames, everything visible.

- [ ] **Step 5: Commit.**

```bash
git add -A && git commit -m "feat(strategy): LoopBento analytics moments replace the orbit ring

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: AnswerReel replaces the coverage beam (home + features)

**Files:**
- Create: `components/marketing/sections/AnswerReel.tsx`
- Modify: `app/(marketing)/page.tsx` (~line 132), `app/(marketing)/features/page.tsx` (~line 766 + import at line 27)
- Delete: `components/marketing/visuals/AiSourceBeam.tsx`

**Interfaces:**
- Consumes: lobehub icons (`OpenAI, Claude, Gemini, Perplexity, MetaAI, Mistral`), `Stage`, `BannerTile`, `Chip`, `EASE`, `useIsomorphicReducedMotion`.
- Produces: `export function AnswerReel({ className }: { className?: string })` — drop-in for the right-hand grid column both pages already have (it does NOT include a `Section` wrapper; the existing two-column layouts stay).

- [ ] **Step 1: Create `components/marketing/sections/AnswerReel.tsx`:**

```tsx
"use client";

import * as React from "react";
import {
  OpenAI,
  Claude,
  Gemini,
  Perplexity,
  MetaAI,
  Mistral,
} from "@lobehub/icons";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { Stage, Chip } from "@/components/marketing/primitives/stage";
import { cn } from "@/lib/utils";

type Tone = "lime" | "salmon" | "neutral";
type Metric = { v: string; d: string; up: boolean };

type Assistant = {
  name: string;
  Icon: React.ComponentType<{ size?: number }>;
  verdict: { tone: Tone; label: string };
  query: string;
  metrics: { visibility: Metric; sentiment: Metric; citations: Metric; fanout: Metric };
  source: string;
};

/* One believable 30-day record per assistant (sample data, mixed movement). */
const ASSISTANTS: Assistant[] = [
  {
    name: "ChatGPT", Icon: OpenAI,
    verdict: { tone: "lime", label: "↗ Recommended · #2" },
    query: "best everyday skincare nz",
    metrics: {
      visibility: { v: "31.2%", d: "▲ 9.1", up: true },
      sentiment: { v: "+0.62", d: "▲ 0.08", up: true },
      citations: { v: "14", d: "▼ 2", up: false },
      fanout: { v: "18/24", d: "▲ 3", up: true },
    },
    source: "your pricing page",
  },
  {
    name: "Claude", Icon: Claude,
    verdict: { tone: "lime", label: "↗ Recommended · #3" },
    query: "gentle moisturiser for sensitive skin",
    metrics: {
      visibility: { v: "27.4%", d: "▲ 4.2", up: true },
      sentiment: { v: "+0.55", d: "▲ 0.11", up: true },
      citations: { v: "11", d: "▲ 3", up: true },
      fanout: { v: "15/24", d: "▲ 2", up: true },
    },
    source: "your ingredients guide",
  },
  {
    name: "Gemini", Icon: Gemini,
    verdict: { tone: "neutral", label: "Mentioned, not recommended" },
    query: "top skincare brands nz",
    metrics: {
      visibility: { v: "12.1%", d: "▲ 1.9", up: true },
      sentiment: { v: "+0.31", d: "▼ 0.04", up: false },
      citations: { v: "6", d: "▼ 1", up: false },
      fanout: { v: "9/24", d: "▲ 1", up: true },
    },
    source: "retailer listicle",
  },
  {
    name: "Perplexity", Icon: Perplexity,
    verdict: { tone: "lime", label: "↗ Recommended · #1" },
    query: "best value retinal serum",
    metrics: {
      visibility: { v: "38.6%", d: "▲ 6.8", up: true },
      sentiment: { v: "+0.71", d: "▲ 0.05", up: true },
      citations: { v: "22", d: "▲ 5", up: true },
      fanout: { v: "21/24", d: "▲ 2", up: true },
    },
    source: "your comparison page",
  },
  {
    name: "Meta AI", Icon: MetaAI,
    verdict: { tone: "salmon", label: "Missing from the answer" },
    query: "everyday face cream under $50",
    metrics: {
      visibility: { v: "3.2%", d: "▼ 0.8", up: false },
      sentiment: { v: "+0.08", d: "▼ 0.12", up: false },
      citations: { v: "1", d: "▼ 1", up: false },
      fanout: { v: "4/24", d: "— 0", up: false },
    },
    source: "competitor blog",
  },
  {
    name: "Mistral", Icon: Mistral,
    verdict: { tone: "neutral", label: "Mentioned, not recommended" },
    query: "clean beauty brands oceania",
    metrics: {
      visibility: { v: "9.8%", d: "▲ 2.2", up: true },
      sentiment: { v: "+0.24", d: "▲ 0.02", up: true },
      citations: { v: "4", d: "▲ 1", up: true },
      fanout: { v: "7/24", d: "▲ 1", up: true },
    },
    source: "press coverage",
  },
];

const TICK_MS = 3000;
const METRIC_LABELS: [keyof Assistant["metrics"], string][] = [
  ["visibility", "Visibility"],
  ["sentiment", "Sentiment"],
  ["citations", "Citations"],
  ["fanout", "Fan-out coverage"],
];

/**
 * Nory's location reel, reinterpreted: the periwinkle banner cycles the six
 * assistants; the tile below shows each one's 30-day AEO record — verdict,
 * the fan-out query behind it, and the four metrics with movement. Decorative
 * (aria-hidden); the adjacent SectionHeading carries the semantics. Reduced
 * motion: static ChatGPT frame, no timers.
 */
export function AnswerReel({ className }: { className?: string }) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const playing = !reduced && inView;

  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % ASSISTANTS.length), TICK_MS);
    return () => clearInterval(id);
  }, [playing]);

  const a = ASSISTANTS[reduced ? 0 : idx];
  const Icon = a.Icon;

  return (
    <div ref={ref} aria-hidden className={className}>
      <Stage>
        <div className="relative overflow-hidden rounded-xl">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={a.name}
              layout
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex items-center gap-2.5 rounded-xl bg-periwinkle px-4 py-2.5"
            >
              <span className="flex size-6 items-center justify-center rounded-lg bg-card/80">
                <Icon size={15} />
              </span>
              <span className="text-sm font-bold tracking-tight text-foreground">
                {a.name}
              </span>
              <span className="ml-auto text-xs font-semibold tabular-nums text-foreground/60">
                {(reduced ? 0 : idx) + 1} / {ASSISTANTS.length}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative mt-3 min-h-[224px]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={a.name}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="rounded-xl bg-card p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Chip tone={a.verdict.tone}>{a.verdict.label}</Chip>
                <span className="text-[0.7rem] italic text-muted-foreground">
                  &ldquo;{a.query}&rdquo;
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {METRIC_LABELS.map(([k, label]) => {
                  const m = a.metrics[k];
                  return (
                    <div key={k} className="rounded-lg bg-stage/70 px-3 py-2">
                      <p className="label-mono text-[0.55rem] text-muted-foreground">
                        {label}
                      </p>
                      <p className="mt-0.5 flex items-baseline gap-1.5 text-base font-bold tabular-nums tracking-tight text-foreground">
                        {m.v}
                        <motion.span
                          initial={reduced ? false : { opacity: 0, scale: 0.75 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.35, ease: EASE }}
                        >
                          <Chip tone={m.up ? "lime" : "salmon"} className="px-1.5 text-[0.6rem]">
                            {m.d}
                          </Chip>
                        </motion.span>
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-[0.65rem] text-muted-foreground">
                <span>Top source: {a.source}</span>
                <span>30-day window · sample</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-3.5 flex justify-center gap-1.5">
          {ASSISTANTS.map((x, i) => (
            <span
              key={x.name}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === (reduced ? 0 : idx) ? "w-4 bg-brand" : "w-1 bg-border",
              )}
            />
          ))}
        </div>
      </Stage>
    </div>
  );
}
```

- [ ] **Step 2: Swap call sites.**
  - `app/(marketing)/page.tsx`: replace `AiSourceBeam` import with `import { AnswerReel } from "@/components/marketing/sections/AnswerReel";`, `<AiSourceBeam />` → `<AnswerReel />`. Update the coverage `SectionHeading` `sub` to mention the metrics: `"Your customers ask ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral what to buy. HeyOtis watches all six — visibility, sentiment, citations and the fan-out queries behind every answer."`
  - `app/(marketing)/features/page.tsx`: same import swap; `<AiSourceBeam />` → `<AnswerReel />`; make the same `sub` copy change on its coverage SectionHeading (line ~763).

- [ ] **Step 3: Delete retired file.** `grep -rn "AiSourceBeam" app components` → only swapped call sites; then:

```bash
git rm components/marketing/visuals/AiSourceBeam.tsx
```

- [ ] **Step 4: Verify.** `pnpm typecheck && pnpm lint` → 0. CDP real-time at t=2/t=5.5/t=9: banner cycles (ChatGPT → Claude → Gemini), tile content swaps with no blank window, delta chips pop, Gemini frame reads neutral/salmon.

- [ ] **Step 5: Commit.**

```bash
git add -A && git commit -m "feat(marketing): AnswerReel per-assistant AEO record replaces coverage beam

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: llms.txt, full verification pass, PR update

**Files:**
- Modify: `public/llms.txt`, `public/llms-full.txt` (coverage-section copy if quoted; sections describing the loop visuals if they name the orbit)
- Modify (only if checks fail): any file from Tasks 1–5

- [ ] **Step 1: llms.txt.** `grep -n "orbit\|beam\|loop" public/llms.txt public/llms-full.txt` — update any wording that describes the retired visuals; add the metric vocabulary line (visibility, sentiment, citations, fan-out coverage) to the coverage description if the files describe sections.

- [ ] **Step 2: Full build + overflow scan.** `pnpm build` → 19/19 pages. 500px overflow scan (cdp-overflow.mjs) on `/`, `/strategy-engine`, `/features` → `docScrollW == 500` each.

- [ ] **Step 3: Real-time CDP sweep.** Home top-to-bottom at 1440 (t=3 and t=8), strategy-engine loop section, features coverage section; 500px shots of each new section; reduced-motion pass (`EMULATE_RM=1`) on home + strategy-engine: static frames present, no timers (identical shots at t=3 vs t=6).

- [ ] **Step 4: Read every screenshot** and fix anything janky (spacing, clipped chips, reel gaps). Re-run the failed check after each fix.

- [ ] **Step 5: Commit + push + PR comment.**

```bash
git add -A && git commit -m "fix(marketing): verification-pass polish for the nory card system

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"   # only if fixes made
git push
gh pr comment 6 --body "Visual rebuild: Nory card grammar (stage panels, periwinkle banners, lime/salmon deltas) replaces the tablet reveal, orbit ring and coverage beam. See docs/superpowers/specs/2026-07-16-nory-card-system-design.md"
```

---

## Self-Review Notes

- **Spec coverage:** tokens ✓ (T1); platform card + reel ✓ (T2); half-cards ✓ (T3); stat band content ✓ (T3); bento ✓ (T4, both call sites); answer reel ✓ (T5, home + features); retirements ✓ (T2/T4/T5 with grep guards); llms.txt + a11y/reduced-motion/verification ✓ (T6 + per-task steps).
- **Type consistency:** `Stage`/`BannerTile`/`Chip` signatures defined in T1 and consumed as defined in T2–T5; `EASE` from `@/lib/ease` everywhere; `LoopBento` keeps the orbit's `{ compact, className }` contract; scene components take a uniform `{ live: boolean }` prop (noted in T4).
- **Placeholder scan:** all steps carry complete code or exact commands; the only conditional step is T6 Step 5's "only if fixes made" commit, which is explicit.
- **Known judgment calls:** STATS trimmed to three existing honest claims (no fabricated counts); `aria-hidden` wrapper noted in T2 applies to every Stage that is purely decorative; LoopBento is not aria-hidden at the article level because titles/blurbs are real content (only inner stages are).
