# Strategy Engine loop animation — design

**Date:** 2026-07-07
**Status:** Approved concept, pending spec review
**Replaces:** the current `StrategyLoopOrbit` visual (static ring + 16s orbiting dot)

## Problem

The "campaign-led loop that closes itself" section (home page and `/strategy-engine`)
is carried by `components/marketing/visuals/StrategyLoopOrbit.tsx`. Its only motion
is a 2px dot orbiting the ring every 16 seconds and a dashed chord. It doesn't
demonstrate anything: no stage does anything, the feedback loop is a static line,
and the section reads as a generic cycle diagram.

## Goal

A top-tier, **extremely professional** auto-playing animation that *demonstrates
the engine doing its job* — each stage plays a miniature product moment, and the
loop visibly closes once per cycle. Benchmark feel: Stripe / Linear product
diagrams — disciplined, precise, restrained.

## Governing design principles (professionalism)

- **Restraint over spectacle.** No bouncy springs, no cartoon physics, no confetti.
  Motion is opacity + transform only, with confident cubic-bezier easing
  (e.g. `[0.32, 0.72, 0, 1]`). Micro-transitions inside vignettes run 200–400ms;
  stage transitions ~500ms.
- **Existing palette only.** `--border` / `--muted-foreground` for structure,
  `--brand` / `--brand-strong` as the single accent, `--card` surfaces. The
  differentiator stages (Verify, Prove) own the strongest accent usage.
- **Real product vocabulary.** Vignette copy uses genuine domain language
  (schema missing, outdated pricing, recommendation share) — no filler.
- **Typography discipline.** `label-mono` for micro-labels, existing text scale.
  Nothing smaller than the current `0.55rem` mono labels.
- **Unhurried timing.** ~3s per stage, a beat longer on Verify/Prove,
  ~22s full cycle. Nothing flashes faster than the eye can follow.

## Form (decided)

- **Auto-playing story loop.** No scroll hijack, no required interaction.
  Runs only while in view; loops indefinitely.
- **Ring as frame, vignette center-stage.** The six stage nodes stay on the ring
  (existing `POS` geometry). The ring's center becomes a small "screen" — a
  rounded card where each stage's vignette plays.
- **Miniature product moments** as vignette style, echoing the visual vocabulary
  of `OpportunityBoard`, `BotLogFeed`, and `CompoundingChart` so the site reads
  as one system.

## Choreography

Per stage activation (driven by a single `activeStage` index advancing on a timer):

1. Node scales up slightly (~1.15) with a soft brand glow ring; previous nodes
   keep a subtle "completed" fill (brand-tinted).
2. The ring arc fills clockwise up to the active node (SVG stroke-dashoffset
   animation on a progress path).
3. The center screen transitions to the stage's vignette
   (`AnimatePresence mode="wait"`, ~500ms crossfade + 8px vertical slide).
4. The legend row for the stage highlights; inactive rows dim to ~60% opacity.
   A user hovering/focusing a legend row does not interrupt the cycle (v1 is
   non-interactive; the legend remains plain semantic content).

### The six vignettes (center screen, 2–3s each)

| # | Stage | Micro-scene |
|---|-------|-------------|
| 1 | Define | Scope chips (*brand, competitors, personas, prompts*) pop in sequentially and slot into a campaign card. |
| 2 | Measure | Three mini assistant-answer lines slide in; a scan sweep passes; the brand name highlights in one answer and is visibly absent in another. |
| 3 | Diagnose | The rows get inspected: two flag amber (*schema missing*, *outdated pricing*), one passes with a check. |
| 4 | Prioritize | Three/four move rows with impact bars reorder; highest impact rises to the top as scores settle. |
| 5 | Verify | A detector sweep passes over the top move; status flips pending → **live** with a green check and timestamp tick. |
| 6 | Prove | A mini line chart draws upward; *recommendation share* ticks 18% → 24%; an evidence stamp lands. |

### The feedback beat (the money shot)

After Prove: the evidence stamp condenses into a particle that travels the
existing dashed Prove→Measure chord, the "evidence feeds back" pill pulses once,
ring progress resets, and the cycle restarts. This is the one moment per cycle
where the "closes itself" claim is made literal.

## Technical design

- **Rebuild `StrategyLoopOrbit.tsx` in place.** Same export name, same
  `compact?: boolean` prop — both placements (home compact, `/strategy-engine`
  full) upgrade with no call-site changes. Extract vignettes into a co-located
  private module (e.g. `StrategyLoopVignettes.tsx`) if the file grows past
  comfortable size.
- **Stack:** Motion 12 (already installed) — `AnimatePresence`, `motion.*`,
  variants; SVG for ring/arc; DOM for nodes, screen, legend. **No new
  dependencies.**
- **State:** one `activeStage` index + a `phase` flag for the feedback beat,
  advanced by a `useEffect` timer. Timer runs only when `useInView` is true and
  reduced motion is off (existing `useIsomorphicReducedMotion` hook).
- **Reduced motion / SSR:** render a static composed frame — ring with all
  nodes, Verify/Prove arc emphasized, Diagnose vignette frozen in the screen,
  full legend. No timers, no animation.
- **Accessibility:** diagram stays `aria-hidden`; the legend `<ol>` remains the
  semantic content (unchanged).
- **Performance:** transform/opacity only; no layout animation, no canvas;
  vignettes are cheap DOM (≤ ~15 elements each); everything unmount-safe.
- **Compact variant:** same sequence, smaller ring (existing 400px max-width),
  legend keeps its existing compact behavior (no blurbs).

## Out of scope

- Interactivity (click-to-jump stepper) — possible v2.
- Scroll-driven variant.
- Changes to `LOOP_STAGES` content in `lib/strategy-content.ts` (copy stays).

## Verification

- `pnpm lint` and `pnpm build` pass.
- Visual check on dev server: home (compact) and `/strategy-engine` (full),
  light + dark, ≥500px viewport screenshots; confirm reduced-motion static
  frame via emulation.
