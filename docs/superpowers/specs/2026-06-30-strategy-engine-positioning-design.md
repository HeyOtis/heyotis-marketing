# Strategy Engine Positioning — Design Spec

**Date:** 2026-06-30
**Status:** Approved direction (pending spec review)
**Author:** Ash + Claude (brainstorming)

## Goal

Re-center the HeyOtis marketing site on the **Strategy Engine** — the campaign-led, self-improving feedback loop with real attribution — as the product's primary (and most defensible) differentiator. Fold in the cofounder's website-copy voice and real content (Halenstein proof, campaign-led narrative, "misunderstood by AI" hook, recommendation-share vocabulary). Present the full engine — including not-yet-shipped predictive and autonomous capability — as **current capability, present tense** (a deliberate business decision, justified by a 3–4 month sales cycle).

## Source material this reconciles

1. **`heyotis-platform-api` north-star** (`docs/strategy-engine-overview.md`, `docs/2026-04-11-roadmap-strategy-meeting.md`): the engine as `Scrape → Analyze → Recommend → Detect → Report`; the recommendation lifecycle `Proposed → Accepted → In progress → Implemented → Observed → Validated`; "real attribution" via the `RecommendationOutcome` model (pre/post metric deltas + immutable evidence); the honesty architecture (capabilities check, maturity gating, validator-gated reports).
2. **Cofounder website copy v2** (`HeyOtis_Website_Copy_v2`): campaign-led framing; tool **+** service ("the platform gives you the intelligence, the team gives you the strategy"); brand-perception vs traffic dual motivation; "dashboards without direction don't drive results"; real proof (Halenstein); recommendation-share vocabulary; 6 engines.
3. **`heyotis-platform-ui` as-built**: real product vocabulary the mocks must mirror — "Strategy Engine", "Your action plan", opportunity cards (rank, impact × effort, status), the drawer sections **Why this / What to do / What you'll see / Measured by {metric}**, "Based on N signals", and the footer line *"Composed by the strategy engine from deterministic signals above. The wording is generated; the evidence is not."*

## Positioning throughline

> Your brand might be misunderstood by AI — and you wouldn't know it. HeyOtis shows you how assistants interpret, present and recommend you, then runs the **campaign-led Strategy Engine** that diagnoses the gaps, prioritizes the fix, and **proves whether your recommendation share actually moved.**

- **Campaigns** = how the engine is scoped (brand, market, competitors, personas, buying journeys).
- **The Strategy Engine** = the closed loop that turns intelligence into prioritized action and proves it worked.
- **Anti-positioning line** (recurring): *"Dashboards tell you where you stand. The Strategy Engine changes it."* / *"Not a dashboard for dashboard's sake."*

## The canonical loop (the artifact every loop visual/section uses)

A 6-stage, self-improving cycle. Stages 1–4 merge the cofounder's campaign loop; stages 5–6 are the engine's differentiating depth. Stage 6 feeds back into stage 2.

1. **Define** — scope a campaign: brand, market, competitors, personas, buying journeys.
2. **Measure** — how AI assistants interpret, compare and recommend you across the prompts that shape decisions.
3. **Diagnose** — the weak or missing signals behind absent/poor recommendations (insights + deterministic detectors).
4. **Prioritise** — turn findings into a ranked action plan (impact × effort), each backed by evidence.
5. **Verify** — confirm the move actually shipped; detectors watch your surfaces and mark it done.
6. **Prove** — measure whether recommendation share (and rank) actually moved, on the real metric, with an evidence trail. → loops back to **Measure**.

> Spelling: site is **US English** (per the audit pass). The cofounder's doc is British ("optimise/prioritise/programmes"); convert to US ("optimize/prioritize/programs"). The stage label "Prioritise" above is illustrative — render as **"Prioritize"** in shipped copy.

## The four levels the engine operates at (present tense, from the maturity ladder)

Presented as four things the engine does today (per the framing decision):

- **Diagnostic** — *Here's what's happening.* Where you stand and why.
- **Prescriptive** — *Here's what to do about it.* The ranked, evidence-backed action plan.
- **Predictive** — *Here's what's about to happen.* Emerging prompts, drift and risk before they cost you.
- **Autonomous** — *We've already done it for you.* The engine ships and verifies the fix.

## Real attribution (the "Prove" proof point)

Mirror the product's `RecommendationOutcome`: for each shipped move, show **before → after** on the *actual* metric over a window, with evidence strength. Friendly metric names: "ChatGPT recommendation share (30-day)", "Average position", "Queries you appear in". Marketing line: *"Measured by {metric} — the wording is generated, the evidence is not."*

## Honesty architecture (what makes the bold claims credible)

A dedicated section. Three real mechanisms:

1. **Capabilities check** — it only recommends a move it can verify got done; if a signal source isn't connected, it surfaces the gap instead of guessing.
2. **Maturity gating** — new signals ship "experimental", get measured, and only graduate to client-visible when the data says they're trustworthy.
3. **Validator-gated reporting** — every number traces to source; the engine refuses to invent stats.

Headline: **"It won't recommend what it can't prove."** This section is what licenses the present-tense ambition elsewhere without making the site feel like vaporware.

## Real proof

**Halenstein** — from near-zero presence to **3.7% AI recommendation share in Australia, a +300% increase.** Used as named, real proof (cleared: it appears as website copy in the cofounder's doc). Retroactively replaces the audit's "illustrative +300%" with attributed, real proof. Frame per cofounder: *"The result wasn't just more mentions — it was a clear view of where competitors were chosen instead, and what to do about it."*

## Engines

Claim **6**: ChatGPT, Gemini, Perplexity, Claude, Meta AI, Mistral (per cofounder doc + present-tense decision). NOTE: live product monitors 4 today; this is a conscious choice. Update everywhere the site currently lists 4 (Hero rotating word, AiSourceLogos, copy, llms.txt, schema). Requires adding Meta AI + Mistral icons/logos (lobehub icon set or inline SVG fallback).

## Vocabulary shifts (site-wide)

- **"Recommendation share"** as the primary term (keep "Share of Voice" as a secondary synonym where useful).
- Adopt: "AI Discovery Intelligence", "GEO strategy", "diagnose the gaps", "campaign-led".
- Keep the engine's product vocabulary in mocks verbatim (opportunity cards, "Your action plan", drawer headings).

## Scope

**In scope (this phase):**
- New flagship page `app/(marketing)/strategy-engine/page.tsx`.
- Home hero + "how it works" re-pointed to the campaign-led loop + engine.
- Features page: Strategy moves to the front of the tabs; tab CTA deep-links to `/strategy-engine`.
- New visuals: a **StrategyLoop** cyclical diagram; an **AttributionPanel** (before/after recommendation share); a **MaturityLevels** section; a strategy **OpportunityBoard** mock mirroring the product (or a new `MockDashboard` "strategy" variant).
- Halenstein proof component (logo + stat) used on flagship + home.
- `llms.txt` / `llms-full.txt` rewritten around the closed-loop engine (AEO).
- Nav: add "Strategy Engine".
- Vocabulary + engine-count (6) + US-spelling normalization site-wide.

**Out of scope (phase 2, noted not built):**
- Audience pages: Brand / Traffic / E-commerce / Agencies.
- Pricing re-model (response-volume tiers Growth/Scale/Enterprise).
- Any "scorecard" self-serve product or intake flow — **do not imply a scorecard offer**; primary CTA remains **"Book a call"** (HubSpot).

## Components — file-level map (to inform writing-plans)

**Create:**
- `app/(marketing)/strategy-engine/page.tsx` — flagship page (10 sections; see below).
- `components/marketing/visuals/StrategyLoop.tsx` — the 6-stage cyclical loop diagram (motion, reduced-motion safe, in-view gated).
- `components/marketing/visuals/AttributionPanel.tsx` — before/after recommendation-share proof tile (illustrative data labeled).
- `components/marketing/sections/MaturityLevels.tsx` — the four-level explainer.
- `components/marketing/visuals/OpportunityBoard.tsx` — mock action-plan board mirroring the product's opportunity cards + drawer vocabulary. (New component, not a `MockDashboard` variant — keeps `MockDashboard` focused on measurement panels.)
- `components/marketing/sections/ProofHalenstein.tsx` — named case-study stat block.

**Modify:**
- `components/marketing/sections/Hero.tsx` + `app/(marketing)/page.tsx` — new hero + re-pointed how-it-works (PillarBento → loop), Halenstein proof, brand/traffic dual-motivation as a lightweight selector.
- `app/(marketing)/features/page.tsx` — reorder TABS (Strategy first), Strategy tab deep-links to `/strategy-engine`, align STATS/DETECTORS copy.
- `lib/site.ts` — nav entry; engines list (6); recommendation-share copy.
- `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts` — rewrite around the loop.
- `components/marketing/visuals/AiSourceLogos.tsx` — add Meta AI + Mistral.
- `components/marketing/visuals/MockDashboard.tsx` — recommendation-share vocabulary updates only (measurement panels stay here; the action plan lives in `OpportunityBoard`).
- SEO: `buildMetadata` for the new page; confirm `app/sitemap.ts` picks up `/strategy-engine`.

**Flag, do not change without sign-off:**
- Pricing currently gates "Strategy Engine access" to Premium+. If the engine is the headline differentiator, gating undercuts it. Surface to Ash; no change this phase.

## Flagship page `/strategy-engine` — section-by-section copy direction

1. **Hero** — H1: *"Dashboards tell you where you stand. The Strategy Engine changes it."* Sub: the throughline proof line. CTA: Book a call. Secondary: "See the loop" (anchor).
2. **The shift** — adapt cofounder Screen 3: *"AI search created a new channel most teams can't manage."* Search → recommendation; strong-in-search-but-missing-in-AI.
3. **The loop** (centerpiece `StrategyLoop`) — the 6 stages, with Verify + Prove emphasized as what nobody else closes.
4. **Four levels** (`MaturityLevels`) — Diagnostic · Prescriptive · Predictive · Autonomous, present tense.
5. **The action plan** (`OpportunityBoard` mock) — real product vocabulary: ranked opportunities, impact × effort, "Why this / What to do / What you'll see / Measured by {metric}", "Based on N signals".
6. **Real attribution** (`AttributionPanel`) — before/after recommendation share on the real metric; evidence trail.
7. **The honesty architecture** — "It won't recommend what it can't prove" + the three mechanisms.
8. **Proof** (`ProofHalenstein`) — Halenstein +300% / 3.7% AU.
9. **Platform + strategists** — tool + service: *"the engine finds and proves the moves; our GEO strategists help you ship them."*
10. **Where this is heading** — light agent-native vision (forward-looking, clearly vision). CTA: Book a call.

## Success criteria

- The Strategy Engine is unmistakably the site's centerpiece (hero, nav, dedicated page, first feature tab).
- A reader can explain the closed loop and why Verify + Prove are the differentiator.
- Present-tense capability claims are balanced by a credible honesty section + real Halenstein proof, so it reads ambitious, not vaporware.
- Cofounder's voice and real content are evident throughout.
- `pnpm typecheck && pnpm lint && pnpm build` green; new page prerenders; reduced-motion + a11y patterns from the audit upheld.

## Open items / dependencies (for Ash)

- Meta AI + Mistral logos — confirm icon source.
- Pricing tier-gating of the engine — decision deferred to phase 2.
- Halenstein logo asset — need the file if we show the logo (text stat works without it).
