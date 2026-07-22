# Loop section: scroll-driven pinned stepper

**Date:** 2026-07-22
**Component:** `components/marketing/sections/HeroLoopTabs.tsx` → `LoopStages`
**Status:** Design approved, pending spec review

## Problem

The "One loop that compounds" section (`LoopStages`) presents four loop stages —
Measure, Strategy, Act, Attribute — as a horizontal tab row that auto-advances
on a 5s timer. Visitors rarely click the tabs, and the timer either moves too
slowly to notice or advances before a stage is read. The stages get skimmed
past.

## Goal

Turn the section into a **scroll-driven pinned stepper**: as the visitor
scrolls into the section it pins to the viewport, and their scroll advances the
active stage instead of moving the page. After the last stage, the section
unpins and the page scrolls on normally. This makes the four stages
unmissable and self-paced by the visitor's own scroll.

Reference for the target look/feel: DOSS product pages (vertical rail + panel on
desktop, stacked on mobile) — the same DOSS-derived language the rest of this
site already uses.

## Approach: sticky-pin, not scroll-hijack

Implement with a **tall outer wrapper + `position: sticky` inner frame**, driven
by Motion's `useScroll` progress. The inner frame stays pinned while the wrapper's
extra height scrolls past; scroll progress (0→1) maps to the active stage index.

This is native scroll throughout — scrollbar, trackpad momentum, Page Down/Up,
keyboard, and screen readers all keep working. It *feels* like "scroll pours into
the tabs, then releases" without intercepting any scroll events.

**Rejected alternative — wheel/touch hijacking** (`preventDefault` on wheel +
snap between stages): fights trackpad momentum, breaks on many input devices, and
is an accessibility regression. Not pursued.

## Layout

### Desktop / large screens (pinned)

Within one pinned viewport-height frame:

```
┌─────────────────────────────────────────────┐
│ / THE LOOP     One loop that compounds        │  ← compact heading
│                                               │
│  ●  01 Measure      ┌───────────────────────┐ │
│  │     your rec…    │                       │ │
│  ○  02 Strategy     │   active stage's      │ │
│  │     the moves…   │   vignette panel      │ │
│  ○  03 Act          │   (slides up/in on    │ │
│  │     watch…       │    stage change)      │ │
│  ○  04 Attribute    │                       │ │
│        the lift…    └───────────────────────┘ │
└─────────────────────────────────────────────┘
```

- **Left rail (~1/3 width):** the four stages as a vertical list. Each item
  shows its number (01–04), stage name, and subline (reused verbatim from the
  existing `TABS` data). Active item is emphasised (foreground text + accent
  number); inactive items are ghosted (`text-foreground/40`-ish), matching the
  current tab treatment.
- **Progress line:** a vertical rule down the rail whose fill (`scaleY`, origin
  top) is bound to overall scroll progress, so it grows continuously as you move
  through the stages — the rail's answer to today's underline indicator.
- **Right panel (~2/3 width):** the active stage's vignette (`MeasureVignette`,
  `StrategyVignette`, `ActVignette`, `AttributeVignette`). On stage change it
  swaps via `AnimatePresence`, sliding **vertically** (up on advance, down on
  reverse) instead of the current horizontal slide — so the motion reads with
  the scroll direction.
- **Compact heading:** eyebrow ("The loop") + title sit at the top of the pinned
  frame so context stays on screen. Title sized down from the current large
  `SectionHeading` so heading + rail + panel all fit inside one
  `100dvh` frame. The vignette panel height is reduced from today's ~560px to
  whatever fits the pinned frame.

### Mobile + reduced-motion (stacked, no pin)

No wrapper height, no sticky, no scroll-mapping. All four stages render as
ordinary flowing page content, one after another:

```
01 Measure  — subline
[MeasureVignette]
02 Strategy — subline
[StrategyVignette]
03 Act      — subline
[ActVignette]
04 Attribute — subline
[AttributeVignette]
```

Normal scroll. This path is used when **either** the viewport is below the
desktop breakpoint **or** `prefers-reduced-motion: reduce` is set. Fully
accessible, no motion dependency, no timer.

## Pacing / scroll mechanics

- **Wrapper height:** ≈ `(4 + lead-in) × 100vh` — roughly one viewport of scroll
  per stage ("Balanced"). Exact multiplier tuned during implementation.
- **Progress → index:** `useScroll({ target: wrapperRef, offset: ["start start",
  "end end"] })` gives `scrollYProgress` 0→1. Active index =
  `clamp(floor(progress × 4), 0, 3)`. A small hysteresis/settle band around each
  threshold prevents flicker between two stages at the boundary. Index is pushed
  into React state via `useMotionValueEvent` (or equivalent) so only the panel
  swap re-renders.
- **Pin offset:** inner frame is `sticky top-0`, height `100dvh`. The site nav is
  `sticky top-0` and auto-hides on scroll-down — during forward progress (scroll
  down) the nav is hidden, so the full viewport is available. On reverse scroll
  the nav reappears and overlaps the top strip; the pinned frame carries a little
  top padding so the compact heading is never flush against the very top edge.
- Reaching stage 04's end unpins the frame; the page scrolls on to the next
  section as normal.

## Rail interactivity & accessibility

- Rail keeps `role="tablist"` / `role="tab"` semantics from the current
  implementation (tabs, `aria-selected`, `aria-controls`, roving `tabIndex`,
  Arrow-key navigation).
- Clicking or keyboard-selecting a rail item **scrolls the page** to that stage's
  slice of the wrapper (compute target = wrapperTop + index × stageHeight), so
  the pinned state and scroll position stay in sync rather than diverging.
- Panel keeps `role="tabpanel"` + `aria-labelledby`.
- The stacked fallback is plain semantic content (headings + panels), no tab
  semantics needed.

## Code changes

Single client component, rebuilt in place:

- **`LoopStages`** (`HeroLoopTabs.tsx`):
  - Remove the 5s auto-rotate `useEffect` and its `paused`/hover-pause wiring.
  - Add a media/reduced-motion check (`matchMedia` for desktop breakpoint +
    `useIsomorphicReducedMotion`) that branches between `PinnedStepper` and
    `StackedStages` renderers. Extract these as two internal sub-components (or
    clearly separated render branches) so each has one job.
  - `PinnedStepper`: the sticky-wrapper + `useScroll`/`useTransform` plumbing,
    vertical rail, progress line, and vertical panel swap.
  - `StackedStages`: the four stages rendered flowing.
- **Unchanged:** `HeroFold`, `Backdrop`, the `TABS` data, and
  `LoopVignettes.tsx` (vignettes may get a size/prop tweak to fit the pinned
  frame, but their internals and hover-replay behaviour stay).
- `SectionHeading` may be used as-is for the stacked path and rendered compactly
  (or inline) for the pinned frame.

## Out of scope

- No change to vignette content or the four stages' copy.
- No change to `HeroFold` or the lavender backdrop.
- No new dependencies (Motion / `motion/react` is already used here).

## Success criteria

1. Scrolling into the section on desktop pins it; continued scroll advances
   01→04 one stage at a time at a readable pace; past 04 the page scrolls on.
2. The active rail item and the panel always match the current scroll position;
   the progress line tracks overall progress.
3. Clicking/arrowing a rail item moves to that stage and stays in sync.
4. On mobile or under `prefers-reduced-motion`, all four stages render stacked
   with normal scroll and no pin/timer.
5. No layout shift or overlap against the auto-hiding nav.
