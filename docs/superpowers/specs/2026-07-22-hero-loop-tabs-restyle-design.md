# Hero loop-tabs restyle — naked rail + sliding underline

**Date:** 2026-07-22 · **Branch:** feat/blueprint-reskin · **Scope:** the tablist block in `components/marketing/sections/HeroLoopTabs.tsx` only. Copy, tab grid columns, panels, backdrop, and fold layout are unchanged.

## Problem

The current strip wraps the four stage tabs in a frosted glass card (`rounded-2xl bg-white/50 ring-1 ring-white/60 backdrop-blur-md`). It is the one element on the page that doesn't speak the blueprint language of hairlines, dashed rules, and cells — it reads as generic glassmorphism floating over the hero. The per-button `border-b-2` underlines read as static decoration, not tabs.

## Design (approved by Ash)

Direction chosen over two alternatives (bento cell strip; loop circuit with arrows): **naked rail + sliding underline**, closest to the DOSS reference and purest blueprint. **Click-only** — no auto-advance (explicitly decided against).

- **Remove the card.** Drop the rounded/blur/ring/padding chrome; the four columns sit directly on the hero canvas.
- **Legibility via feather, not chrome.** Behind the row, an `aria-hidden` white radial feather (same recipe as `Halo` in `LoopVignettes.tsx`: `radial-gradient(closest-side, white 45%, transparent 100%)`, generously overscanned) so text stays readable over the lavender shapes with no visible edges. May need `closest-side` swapped for explicit ellipse sizing at row aspect ratio — match the Halo look, not necessarily its exact CSS.
- **One shared track.** The page-wide dashed rule at `bottom-8` of the fold already runs through the underlines; align the tab baselines to it so it reads as the track all four tabs ride. Per-button `border-b-2` is removed.
- **Sliding indicator.** A single solid ink bar (2px, the width of the active column) rendered with a motion `layoutId`, so it physically slides along the track on stage change. Reduced motion: it jumps (no transition). On the mobile 2-col grid it still uses `layoutId`; the brief cross-row move is acceptable.
- **States.** Active: ink bar + violet mono number (`text-accent`) + full-ink text — as today. Inactive: dashed track only, number at 35%. Hover: text darkens (as today) and a faint solid segment appears over that column's track.

## Result

The strip stops being a floating panel and becomes part of the page's rule system — the tabs literally ride the same dashed line that structures the fold.

## Testing

Visual verification in a real browser (real-wall-clock CDP screenshots — `--virtual-time-budget` freezes motion/react animations). Check: desktop + mobile widths, tab switching (indicator slides), keyboard arrows still work, reduced-motion, text contrast over the lavender shapes.
