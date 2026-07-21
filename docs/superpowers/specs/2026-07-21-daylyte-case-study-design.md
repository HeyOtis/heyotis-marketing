# Daylyte case study section — design

**Date:** 2026-07-21
**Branch:** feat/blueprint-reskin

## Goal

Replace the home page "The Platform" card (`PlatformCard`) with a Daylyte
customer case study section. Borrow the structure of a conventional case-study
layout (eyebrow → outcome headline → blurb → CTA) but keep it native to the
DOSS blueprint reskin by reusing the existing beige metric stage on the right,
now telling Daylyte's story instead of the generic "Everyday range · NZ" sample.

Daylyte is a real, cleared customer. Real numbers are coming; until then the
section ships with clearly-marked **dummy** placeholders.

## Placement

Home page (`app/(marketing)/page.tsx`), the slot at line 96 currently occupied
by `<PlatformCard />`, immediately after the "The stakes" section.

## Component

New component: `components/marketing/sections/CaseStudyDaylyte.tsx`.

- `PlatformCard.tsx` is fully replaced and will be **deleted** (recoverable via
  git). Its page import is removed.
- Reuses existing primitives: `Section`, `Eyebrow`, `Stage`, `BannerTile`,
  `Chip`, `MetricTile`, `NumberTicker`, and the animated reel logic. Same
  two-column card shell (`grid ... lg:grid-cols-[1fr_1.1fr]`), same `surface="cream"`,
  same `id="product"` anchor is dropped in favour of no anchor / `id` unchanged
  is not required (no nav link currently targets `#product`; keep `id="product"`
  to avoid breaking any anchor).

## Layout

**Left column** (case-study framing):

- Eyebrow: `Case study`
- Outcome headline (dummy): *"How Daylyte doubled its share of AI answers in a
  single quarter"*
- Blurb (dummy, ~35 words): what Daylyte did + the result.
- CTA: `Read the Daylyte story →` → `/blog/daylyte` (placeholder; MDX post not
  yet created — leave a `TODO` comment).

**Right column** (Daylyte's metric stage — reused reel):

- `BannerTile` label: `Daylyte · NZ`, crosshair icon, right-slot tag reads
  `Case study` (replacing "Sample").
- Same 4-tile animated reel, reskinned with Daylyte's dummy result numbers
  (visibility, citations won, AI referral sessions, answer sentiment), framed as
  a before→after result.
- Reduced-motion / off-screen: two static tiles, no timers — unchanged from
  current behaviour.

## Dummy data

All placeholder numbers/copy live in a single clearly-labelled constant block at
the top of the file:

```
/* DUMMY — replace with Daylyte's real cleared numbers. */
```

so they can be swapped in seconds when the real figures arrive.

## Honesty

- Numbers are dummy but styled with believable deltas, matching the current
  card's visual language.
- Every placeholder is marked with a code comment.
- Nothing claims precision beyond what the real case study will show.

## Out of scope

- The real `/blog/daylyte` MDX post.
- Real numbers, quotes, logo assets.
- A multi-case carousel (reference shows dots; we have one customer — YAGNI).
```
