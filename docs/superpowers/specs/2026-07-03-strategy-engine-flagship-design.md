# Strategy Engine Flagship Elevation — Design Spec

**Date:** 2026-07-03
**Status:** Awaiting user review
**Author:** Ash + Claude (brainstorming)
**Builds on:** `2026-06-30-strategy-engine-positioning-design.md` (copy/positioning layer, shipped in PR #4)

## Goal

Elevate `/strategy-engine` from a well-copied page into the site's flagship visual story, and close the two narrative gaps the positioning pass left open:

1. **The input side.** The site says what the engine *does* but not what it *eats*. Five signal streams feed it — AI answer sampling, **AI traffic & bot log ingestion**, site analytics, crawls of the customer's own surfaces, and competitive signals. The bot-log stream is the most defensible: it powers attribution competitors can't match.
2. **The learning side.** "Prove feeds back into Measure" is currently a one-line caption. The compounding story — every proven or disproven move updates what the engine recommends next — deserves its own section.

Approach chosen: **bespoke animated visual per section** (approach B of three considered; pinned scroll-story and click-through walkthrough rejected as higher-risk/lower-conversion). Each visual is an independent, reusable client component; pages stay server components. User confirmed all four bot-log capabilities (crawler visibility, AI referral attribution, lift-attribution input, learning signal) and all five input streams are claimable under the site's present-tense policy.

## New components

All in `components/marketing/visuals/`, all `"use client"`, all reduced-motion safe (static equivalent render), all `useInView`-gated so infinite animations stop off-screen, all inside fixed-aspect containers (no CLS). Animated SVG/DOM is `aria-hidden`; adjacent semantic text carries the content.

### 1. `SignalIntake` — "what flows in"

Five labeled input nodes converge via `AnimatedBeam` (existing component, same pattern as `AiSourceBeam`) into an engine-core node (dark surface + `LogoGlyph`), with a single output beam labeled "ranked moves". Desktop: inputs stacked left, core right. Mobile: two-column node grid above the core, straight connectors. Reduced motion: static lines.

Streams (data in `lib/strategy-content.ts` as `SIGNAL_STREAMS`):

| Stream | One-liner |
|---|---|
| AI answer sampling | How six assistants answer, cite and rank you across the prompts that matter |
| AI traffic & bot logs | GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User — which pages they fetch, and the humans assistants send you |
| Site analytics | Sessions, conversions and landing pages, so lift ties to business outcomes |
| Your surfaces | Crawls of your own site — structured data, freshness, what actually shipped |
| Competitive signals | Who wins the answer when you don't, and why |

### 2. `StrategyLoopOrbit` — the loop, actually a loop

Replaces the static `StrategyLoop` card grid (used only on home + `/strategy-engine`; delete the grid component after both swap).

- Circular SVG: six stage nodes on a ring, a flow pulse traveling the ring (stroke-dashoffset / motion path).
- Stages 5–6 (Verify, Prove) sit on a visually emphasized arc segment (brand fill) with the existing "what others skip" framing.
- The Prove→Measure **feedback return arc** is drawn as a distinct highlighted path, labeled "evidence feeds back".
- Center: `LogoGlyph` + "Strategy Engine".
- The six stage blurbs (existing `LOOP_STAGES` content, unchanged) render as a semantic legend list beside the orbit on desktop, stacked below on mobile.
- `compact` prop: smaller orbit + condensed legend for the home how-it-works echo.
- Reduced motion: static ring with chevron arrows, no pulse.

### 3. `BotLogFeed` — the attribution raw layer

Terminal-styled monospace panel; log lines enter with a staggered reveal while in view and cycle. Lines mirror real ingestion shape (data as `LOG_LINES`, labeled "Illustrative — mirrors the product's log ingestion" per the established honesty convention):

```
GPTBot            GET /compare/best-everyday        200
PerplexityBot     GET /compare/best-everyday        200
ClaudeBot         GET /products/everyday            200
referral          chatgpt.com → /compare/best-everyday
session           4 pages · 6m 12s · demo booked
```

Reduced motion: static list.

### 4. `CompoundingChart` — "it learns"

Stepped line/area chart: recommendation share climbing across loop cycles 1→4, each step annotated ("move proven → weighting updated → next plan sharper"). Data as `COMPOUNDING_POINTS`, illustrative-labeled. Build per the dataviz skill. Reduced motion: chart renders static (entrance animation only is dropped).

## Page assembly — `/strategy-engine`

Revised section order (unchanged sections keep their current content):

1. Hero — unchanged.
2. The shift (why now) — unchanged.
3. **NEW — "What flows in."** Eyebrow "The inputs". Heading direction: *"Five signal streams. One picture of how AI sees you."* Sub-copy makes the honesty tie-in: the engine is only as good as its evidence, so it ingests the evidence. `SignalIntake` visual.
4. The loop — swap card grid for `StrategyLoopOrbit` + legend. Section copy unchanged.
5. Four levels (`MaturityLevels`) — unchanged, keeps its current position right after the loop.
6. The action plan (`OpportunityBoard`) — unchanged.
7. **REBUILT — "Three layers of proof."** Replaces the single attribution block with a vertical evidence ladder, raw → behavior → outcome, connected by a spine line:
   - **The crawl** — `BotLogFeed`: watch AI bots fetch the fix after it ships.
   - **The visit** — assistant referrals arriving on the changed pages (compact stat row: referral sessions delta).
   - **The lift** — existing `AttributionPanel` (pre/post recommendation share) as the top of the ladder.
   Copy direction: *"'It worked' isn't a vibe. Because HeyOtis ingests your traffic and AI-bot logs, you can watch the crawlers fetch the fix, the assistants send the visitors, and the share move — with the evidence trail open."*
8. **NEW — "It learns."** Eyebrow "The feedback loop". Heading direction: *"Every campaign makes the next one sharper."* Copy: every outcome — proven **or disproven** — feeds back into the engine; it learns which moves actually change answers in your category; plan N+1 beats plan N. `CompoundingChart` visual. Placed directly before the honesty section, which then reads as the natural "and here's why you can trust that claim".
9. Honesty architecture — unchanged.
10. Proof (Halenstein) — unchanged.
11. Platform + strategists — unchanged.
12. Vision — unchanged.
13. CTA band — unchanged.

Metadata description updated to mention log-level attribution.

## Home echoes

- **How it works section:** `StrategyLoop` grid → `StrategyLoopOrbit` compact. Deep link to `/strategy-engine` stays.
- **FeatureCards:** sharpen the "Proven in real traffic" card body to name AI traffic & bot-log ingestion explicitly.
- **FAQ:** add one entry — *"How does HeyOtis prove AI actually drove the result?"* — answering with the three-layer evidence ladder (bot crawls, assistant referrals, recommendation-share delta). Flows into `faqPageSchema` automatically; strong AEO surface for the differentiator.

## Content & infra updates

- `lib/strategy-content.ts`: add `SIGNAL_STREAMS`, `LOG_LINES`, `COMPOUNDING_POINTS` (typed, illustrative-labeled where synthetic).
- `public/llms.txt` + `public/llms-full.txt`: add the ingestion/attribution/learning claims (convention: update when content changes).
- Delete `components/marketing/visuals/StrategyLoop.tsx` once both usages are swapped.
- No new dependencies — `motion`, `AnimatedBeam`, lucide, Tailwind cover everything.

## Guardrails

- **Static-first:** pages remain server components; only the four visuals are client components (existing pattern).
- **Honesty policy:** every synthetic number carries the "Illustrative" label, consistent with `OpportunityBoard`/`AttributionPanel`.
- **Accessibility:** visuals `aria-hidden` with real text alongside; legend lists are semantic; keyboard focus never lands inside decoration.
- **Performance:** `useInView` gating, transform/opacity-only animations, fixed-height media containers, no layout shift. Lighthouse budget unchanged (95+).
- **US English** throughout.

## Verification

`pnpm lint`, `pnpm typecheck`, `pnpm build`; manual pass at 360 / 768 / 1280 widths; `prefers-reduced-motion` emulation check on all four visuals; confirm llms.txt claims match page claims.

## Out of scope

- Features page and pricing redesign (site-wide pass deferred).
- Any hero redesign on either page.
- Interactive click-through walkthroughs.
