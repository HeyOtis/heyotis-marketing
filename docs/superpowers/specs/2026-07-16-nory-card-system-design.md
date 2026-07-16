# Nory Card System — Design Spec

**Date:** 2026-07-16
**Status:** Approved by Ash (visual companion session, screens preserved in `.superpowers/brainstorm/29622-1784209264/content/`)

## Problem

The three hero visuals — the tilted-tablet dashboard reveal, the orbit-ring loop
diagram, and the coverage beam diagram — read as unpolished and "AI-generated".
Benchmarking against the reference sites Ash likes (nory.ai, searchable.com,
tryprofound.com) shows best-practice marketing sites never use abstract
geometry or device frames: they show small, crisp product fragments with
believable data inside contained cards, animated with restraint.

## Direction (approved)

Adopt **Nory's card grammar** with HeyOtis content and brand:

- White cards on the cream page; inside each card, a **warm beige "stage"
  panel** holds the product fragments.
- **Periwinkle banner tiles** label/cycle context (Nory's "South London"
  banner → our assistant/campaign banners).
- **Lime and salmon chips** carry status and deltas (▲ lime up / ▼ salmon
  down), always dark text on the chip.
- Fragments speak **AEO/GEO metrics**: visibility, sentiment, citations,
  fan-out query coverage — always with movement (deltas).
- Motion system: slow vertical reels, staggered pill/tile entries, count-ups,
  delta-chip pops. Transform/opacity only, shared `EASE = [0.32, 0.72, 0, 1]`,
  `useInView`-gated, static frames under reduced motion
  (`useIsomorphicReducedMotion`). No rings, beams, orbits, particles, or
  device frames anywhere.

## Design tokens (additions to `app/globals.css` `:root` + `@theme inline`)

| Token | Value | Use |
|---|---|---|
| `--stage` | `oklch(0.945 0.012 85)` (≈ #f1ede3) | beige inset panels inside cards |
| `--periwinkle` | `oklch(0.75 0.1 285)` (≈ #aca3f2) | banner tiles, reel headers; dark text on top |
| `--lime` | `oklch(0.9 0.17 125)` (≈ #cdf463) | positive delta/status chips; dark text |

Existing tokens reused: `--salmon` (negative deltas/status), `--brand`
(CTAs/links, unchanged), `--brand-soft` (eyebrow chips), `--surface-dark`
(hero/footer only — no longer used as a fragment stage). Sample data keeps the
existing "Sample"/"Illustrative" labeling convention.

## Sections (home page order) and components

### 1. Platform card — `sections/PlatformCard.tsx` (new)
Replaces `ProductReveal` (retire `ContainerScroll` tilted-tablet usage; keep
`MockDashboard` — still used by FeatureTabs).
One big white card: text left (eyebrow "The platform", H2 "Your brand's
standing in AI search, in one place", blurb, link to /features). Right: beige
stage with a periwinkle campaign banner ("Everyday range · NZ") and a **slow
vertical reel** of white metric tiles cycling: visibility trend (sparkline +
count-up), sentiment, citations, AI referral traffic. Tile heights equal;
reel advances one tile every ~2.8s with a 600ms ease slide; the incoming
tile's delta chip pops (scale 0.8→1) 300ms after it seats.

### 2. Half-card row — `sections/EvidenceCards.tsx` (new)
Two white half-cards side by side (stack below `md`):
- **"Findings, not guesses"** — beige stage with notification pills sliding in
  staggered, loop of ~5: "⚠ schema missing on /products" (salmon icon),
  "✓ move verified live · 14:02" (lime), "↗ citations +3 this week" (lime),
  "⚠ pricing page stale" (salmon), "✓ Prove: lift +250%" (lime). Pills enter
  bottom, exit top, 3 visible.
- **"Every signal, one model"** — beige stage with a compact cluster: HeyOtis
  glyph tile center, five smaller white tiles around it (AI answers, bot
  logs, GA4, your site, competitors) connected by short hairlines; tiles pop
  in staggered, then one at a time gets a brief periwinkle ring highlight.

### 3. Stat band — existing `StatBand` restyled content only
Three stats with AEO framing: "+250% recommendation share lift", "6 assistants
watched", "28 moves verified live" (values from `lib/site-stats` equivalents /
existing STATS source, keep sample labeling). Component already does
count-ups; keep, retint dividers if needed. No structural change.

### 4. How-it-works bento — `sections/LoopBento.tsx` (new)
Replaces `StrategyLoopOrbit` at both call sites (home `compact`, strategy-engine
full). Retire `StrategyLoopOrbit.tsx` + `strategy-loop-vignettes.tsx`.
2×2 bento of white cards on the cream section (full variant; compact = same
grid, tighter paddings, no blurbs):
- **01–02 · Measure** — share KPI count-up (18→34.8%) + bar sparkline where the
  last bars tint periwinkle→brand as they rise.
- **03 · Diagnose** — three findings rows land staggered with amber/green
  status icons (existing BotLogFeed color pattern) and an "evidence attached"
  caption.
- **04 · Prioritize** — three move rows re-rank once by impact (Motion
  `layout`), impact bars extend.
- **05–06 · Verify & Prove** — before/after bars extend (1.4% → 4.9%), then a
  lime "✓ change detected live · +250%" pill pops.
Eyebrow chips (periwinkle) carry stage numbers "01–02 · Measure" etc. Legend
copy comes from `LOOP_STAGES` (`lib/strategy-content.ts` — copy unchanged, used
for card titles/blurbs). Cards reveal staggered on scroll; each card's inner
scene plays once when it enters view, then holds.

### 5. Coverage: answer reel — `sections/AnswerReel.tsx` (new)
Replaces `AiSourceBeam` on home and features (retire `AiSourceBeam.tsx`).
White card: text left ("Across every assistant that matters" + blurb naming
all six). Right beige stage: periwinkle banner cycles the six assistants
(lobehub icons + name + "n / 6" counter, vertical slide every ~3s). Below,
one white tile re-renders per assistant with:
- verdict chip (lime "↗ Recommended · #2" / beige "Mentioned" / salmon
  "Missing") + the fan-out query it came from (italic, quoted)
- 2×2 metric grid: Visibility, Sentiment, Citations, Fan-out coverage — each
  value + lime/salmon delta chip
- footer: top cited source · "30-day window"
Data: one believable record per assistant in the component (e.g. Gemini =
Missing, salmon-heavy). Dots progress indicator. Reduced motion: static
ChatGPT frame, all six named in the visible copy.

## Placements

- `app/(marketing)/page.tsx`: swap ProductReveal → PlatformCard; insert
  EvidenceCards after it; StatBand stays; StrategyLoopOrbit compact →
  LoopBento compact; AiSourceBeam → AnswerReel.
- `app/(marketing)/strategy-engine/page.tsx`: StrategyLoopOrbit → LoopBento
  (full).
- `app/(marketing)/features/page.tsx`: AiSourceBeam → AnswerReel.
- `public/llms.txt` / `llms-full.txt`: update if any visible copy changes.

## Accessibility & performance

- All animated stages `aria-hidden`; adjacent text carries the semantics
  (the bento card titles/blurbs are real text, so the bento is NOT aria-hidden
  — only its decorative inner scenes are).
- Reduced motion: no timers, composed static frames.
- Reels/timers pause off-screen (`useInView`).
- Transform/opacity only; no layout thrash except the single Prioritize
  re-rank (`layout`, transform-based).

## Verification

`pnpm typecheck && pnpm lint && pnpm build`; real-wall-clock CDP screenshots
(never `--virtual-time-budget` for animation states — see project memory) at
1440/768/500px; 500px overflow scan on every touched route; reduced-motion
frame check.

## Retired

`StrategyLoopOrbit.tsx`, `strategy-loop-vignettes.tsx`, `AiSourceBeam.tsx`,
`ProductReveal.tsx` (+ `ContainerScroll` if no other consumer). Check
`components/ui/animated-beam.tsx` and `container-scroll-animation.tsx` for
other consumers before deleting.
