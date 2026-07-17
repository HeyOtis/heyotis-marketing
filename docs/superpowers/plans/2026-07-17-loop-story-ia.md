# Loop-Story IA + Homepage Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the approved loop-story: nav reorganised around Measure → Diagnose → Act → Prove with dropdowns, three stub pages, and the homepage rewritten to the eight-section narrative with the existing card-system animations mapped into it.

**Architecture:** Nav becomes data-driven dropdown groups in `lib/site.ts` rendered by a rebuilt `Nav.tsx` (Radix `NavigationMenu` from the unified `radix-ui` package, matching `accordion.tsx`'s import style). Homepage sections are small server components in `app/(marketing)/page.tsx` + two new client visuals moves. Copy comes VERBATIM from the approved deck — every task that touches copy must read `docs/superpowers/specs/2026-07-17-loop-story-copy-deck.md` and use its exact lines (reconstructions were approved; do not re-word).

**Tech Stack:** Next.js 16 App Router, React 19, Motion 12, Tailwind 4, radix-ui (NavigationMenu), existing card primitives (Stage/BannerTile/Chip, EASE).

**Copy deck (single source of truth for all words):** `docs/superpowers/specs/2026-07-17-loop-story-copy-deck.md`

## Global Constraints

- No new dependencies (radix-ui already installed).
- Copy exactly from the deck; en-NZ spelling — sweep `Prioritize`→`Prioritise` and `Halenstein`→`Hallensteins` site-wide (code identifiers like `HALENSTEIN`/`ProofHalenstein` may keep their names OR be renamed — if renamed, rename completely, no aliases).
- NEVER fabricate the Hallensteins quote or a person's name. The Proof section ships stat-only with a code comment marking the quote slot.
- Every new page: `buildMetadata({ title, description, path })` + `<JsonLd data={breadcrumbSchema([...])} />` per AGENTS.md; `params`/`searchParams` are Promises in Next 16.
- Motion discipline unchanged: transform/opacity, `EASE` from `@/lib/ease`, `useIsomorphicReducedMotion` static frames, `useInView`-gated timers, flat `rounded-xl` card system (no borders, no shadows).
- Existing components reused, not rebuilt: `PlatformCard`, `LoopBento` (extended), `AnswerReel`, `FindingsPills` (extracted), `StatBand`, `FeatureCards`, `CtaBand`.
- Stub pages: honest scaffolds — real copy, no lorem, no fake testimonials/logos; each ends in the booking CTA.
- Verification: `pnpm typecheck && pnpm lint && pnpm build`; real-wall-clock CDP screenshots for anything animated (never `--virtual-time-budget`); 500px overflow scan on every touched route.
- Commits `feat(ia): …` / `feat(home): …` / `fix(...)` + `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Nav data model + dropdown navigation

**Files:**
- Modify: `lib/site.ts` (replace `nav` array; keep `footerNav` shape working — Footer may consume `nav`; check and adjust Footer if needed)
- Rewrite: `components/marketing/Nav.tsx`
- Modify (only if it consumes `siteConfig.nav`): `components/marketing/Footer.tsx`

**Interfaces:**
- Produces in `lib/site.ts`:

```ts
export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { heading: string; links: NavLink[] };
export type NavEntry =
  | { label: string; href: string }                                  // plain link
  | { label: string; groups: NavGroup[]; footerLink?: NavLink };     // dropdown

export const NAV: NavEntry[] = [
  {
    label: "Platform",
    groups: [
      {
        heading: "Measure",
        links: [
          { label: "AI Visibility & Share of Voice", href: "/features#visibility" },
          { label: "Answer Sentiment", href: "/features#sentiment" },
          { label: "Citations & Sources", href: "/features#citations" },
          { label: "Competitor Head-to-Head", href: "/features#competitors" },
        ],
      },
      {
        heading: "Diagnose",
        links: [
          { label: "The Strategy Engine", href: "/strategy-engine" },
          { label: "Evidence & Findings", href: "/strategy-engine#evidence" },
        ],
      },
      {
        heading: "Act",
        links: [
          { label: "Prioritised Recommendations", href: "/strategy-engine#plan" },
          { label: "Campaigns", href: "/features#campaigns" },
        ],
      },
      {
        heading: "Prove",
        links: [
          { label: "Implementation Tracking", href: "/strategy-engine#verify" },
          { label: "AI Traffic & Attribution", href: "/features#traffic" },
        ],
      },
    ],
    footerLink: { label: "How the loop works →", href: "/#loop" },
  },
  {
    label: "Resources",
    groups: [
      {
        heading: "Resources",
        links: [
          { label: "Free AI Visibility Report", href: "/report" },
          { label: "Case Studies", href: "/case-studies" },
          { label: "Blog", href: "/blog" },
          { label: "Guides & AEO Playbook", href: "/guides" },
          { label: "About HeyOtis", href: "/about" },
        ],
      },
    ],
  },
  {
    label: "Pricing",
    groups: [
      {
        heading: "Pricing",
        links: [
          { label: "Plans", href: "/pricing#plans", description: "Self-serve tiers" },
          { label: "Managed", href: "/pricing#managed", description: "Strategist-led" },
          { label: "For Agencies", href: "/pricing#agencies", description: "White-label & multi-brand" },
        ],
      },
    ],
  },
];
```

Keep the old `nav` export temporarily removed — grep all consumers of `siteConfig.nav` (`Nav.tsx`, `Footer.tsx` possibly, mobile menu) and migrate them in this task. Anchor targets that don't exist yet (`#visibility` etc.) are added in Tasks 2–5; a dead anchor scrolls to top harmlessly in the interim — acceptable within this branch since later tasks add the ids.

- [ ] **Step 1:** Update `lib/site.ts` with the `NAV` structure above (exact labels/hrefs). Keep `siteConfig` object export intact; put `NAV` beside it.
- [ ] **Step 2:** Rewrite `components/marketing/Nav.tsx` desktop nav using Radix: `import { NavigationMenu } from "radix-ui"`. Requirements:
  - Plain-link entries render as today's text links.
  - Dropdown entries: trigger = label + chevron (lucide `ChevronDown`, rotates 180° on open via `group-data-[state=open]:rotate-180` transition); content = white `rounded-xl bg-card p-6` panel (flat, no shadow — match the card system; a 1px `ring-1 ring-border/60` is allowed for separation from the cream backdrop), Platform panel is a 4-column grid of groups (`label-mono` heading per group, links `text-sm` with hover `text-accent`), plus the `footerLink` row bottom-spanning with a top border. Resources/Pricing panels are single columns; Pricing links show their `description` as muted small text.
  - Viewport/positioning: use `NavigationMenu.Viewport` centered under the bar; respect reduced motion (no scale/slide animations when reduced — plain show/hide).
  - Keyboard/a11a: Radix handles roving focus; ensure `Link` components from `next/link` are wrapped in `NavigationMenu.Link asChild`.
  - Mobile (`lg:hidden` sheet): grouped accordion-style — each dropdown entry renders its label as a non-interactive `label-mono` heading followed by its links (flatten groups, keep Platform's group headings as sub-headings), then Log in + BookCta as today.
  - Keep scrolled-state styling, Escape handling, resize-close behavior from the current file.
- [ ] **Step 3:** `pnpm typecheck && pnpm lint` → 0.
- [ ] **Step 4:** Visual check (real-time CDP): desktop 1440 — open state of each dropdown (use Runtime.evaluate to `document.querySelector('button...').click()` or capture hover via CDP Input events; if flaky, verify open state by temporarily... no — verify by clicking via `Runtime.evaluate` `.click()` then screenshot after 400ms). Mobile 500: hamburger open shows grouped menu. Confirm no layout shift of the bar itself.
- [ ] **Step 5:** Commit `feat(ia): loop-ordered platform nav with dropdowns`.

---

### Task 2: Stub pages — /report, /case-studies (+ Hallensteins), /guides

**Files:**
- Create: `app/(marketing)/report/page.tsx`, `app/(marketing)/case-studies/page.tsx`, `app/(marketing)/case-studies/hallensteins/page.tsx`, `app/(marketing)/guides/page.tsx`
- Modify: `app/sitemap.ts` (add the four routes to `STATIC_ROUTES`; `/report` priority 0.85 weekly, others 0.6 monthly)

**Interfaces:**
- Consumes: `buildMetadata` (`@/lib/seo`), `breadcrumbSchema` (`@/lib/schema`), `JsonLd`, `Section`, `SectionHeading`, `BookCta`, `Container`, `AiSourceLogos`, `HALENSTEIN` data (`@/lib/strategy-content`), `Chip`/`Stage` primitives.
- Produces: routes `/report`, `/case-studies`, `/case-studies/hallensteins`, `/guides`.

Content requirements (write real copy in the site's voice; the deck's Final CTA copy is the model):
- **/report** — "Free AI Visibility Report". Lede: we run your brand against the six assistants and send a report showing where you're recommended, mentioned and missing. What's in it (bullet list: share of voice snapshot, per-assistant verdicts, top citations won/lost, three prioritised moves). How it works (3 numbered steps: tell us your brand → we run the campaign → 20-minute walkthrough). CTA = BookCta labeled normally (booking IS the delivery mechanism today — say so honestly: "delivered in a 20-minute walkthrough"). `data-speakable` on the lede. FAQ not required.
- **/case-studies** — index with one entry card (Hallensteins · Apparel · +300% recommendation share, near-zero → 3.7% in Australia) linking to the detail page, plus an honest line that more studies are being written. No fake logos/testimonials.
- **/case-studies/hallensteins** — the existing `HALENSTEIN` story expanded from `ProofHalenstein`'s content: situation → what the loop did (measure/diagnose/prioritise/verify/prove framing) → results (stat block reusing `StatBand` tone="ink" or simple dl). Include an HTML comment `{/* QUOTE SLOT: awaiting named Hallensteins quote — do not fabricate */}`. `articleSchema` NOT required (it's not a blog post); breadcrumb schema with three levels.
- **/guides** — "Guides & AEO Playbook". Intro para + list linking the three existing blog posts (pull via `getAllPosts()` from `@/lib/mdx`) framed as the start of the playbook, plus an honest "The full AEO Playbook is in progress — get the report while you wait" cross-link to /report.

- [ ] **Step 1:** Build the four pages per above (each: buildMetadata, breadcrumb JsonLd, Nav/Footer come from the route-group layout automatically).
- [ ] **Step 2:** Add routes to `app/sitemap.ts` `STATIC_ROUTES` and bump `STATIC_LAST_MODIFIED` to "2026-07-17".
- [ ] **Step 3:** `pnpm typecheck && pnpm lint`; `pnpm build` → all new routes prerender.
- [ ] **Step 4:** CDP screenshot each new page at 1440 + overflow-scan at 500.
- [ ] **Step 5:** Commit `feat(ia): report, case-studies and guides pages`.

---

### Task 3: Copy groundwork — loop steps data, spelling sweeps, pricing anchors

**Files:**
- Modify: `lib/strategy-content.ts` (LOOP_STAGES → 5 steps with deck copy), all `Halenstein`/`Prioritize` occurrences repo-wide (`grep -rln "Halenstein\|Prioritize\|prioritize" app components lib public docs/…` — sweep code + copy; MDX posts too if they contain either), `app/(marketing)/pricing/page.tsx` (add `id="plans"` on the tiers section; add two new slim sections `id="managed"` and `id="agencies"`)
- Modify: `components/marketing/sections/ProofHalenstein.tsx` → rename file/export `ProofHallensteins` and update copy/spelling + import site in `page.tsx`

**Interfaces:**
- Produces: `LOOP_STAGES` becomes exactly five entries (ids `measure`, `diagnose`, `prioritise`, `verify`, `prove`; `n` 1–5), `verb`/`title`/`blurb` VERBATIM from deck §4 (verb = the bolded word, title = the phrase after the em-dash in the heading, blurb = the body line). Icons: keep `Gauge`, `ScanSearch`, `ListChecks`, `CircleCheck`, `TrendingUp`; drop `Crosshair`/define. `differentiator: true` stays on verify + prove.
- `LoopBento` consumes the new shape in Task 4 — this task must keep the site COMPILING: update `LoopBento`'s `CARDS` mapping minimally in this task (stageById keys: replace `define`+`measure` pairing with single `measure`; chips become "01"–"05"; keep 2×2 grid temporarily with prove+verify still paired) — the full 5-card layout lands in Task 4.
- Pricing sections: `#managed` — heading "Managed", one para (strategist-led: we run the loop with you — campaigns, priorities and reviews handled by a HeyOtis strategist) + BookCta; `#agencies` — heading "For Agencies", one para (multi-brand workspaces, white-label reporting, per-client campaigns) + "Talk to us" BookCta. Honest scaffolds; no fake pricing numbers.
- strategy-engine page: verify it still renders with 5 stages (its legend maps LOOP_STAGES); add `id="evidence"`, `id="plan"`, `id="verify"` anchors to the matching existing sections (evidence ladder, action plan/opportunities, verify/loop sections — find by heading text).
- features page: add `id="visibility"`, `id="sentiment"`, `id="citations"`, `id="competitors"`, `id="campaigns"`, `id="traffic"` to the matching existing sections/cards (FeatureTabs tabs & detector sections — attach to nearest section wrapper).

- [ ] **Step 1:** LOOP_STAGES rewrite (deck-verbatim) + minimal LoopBento compile fix + strategy-engine sanity.
- [ ] **Step 2:** Spelling sweeps (Hallensteins, Prioritise) — includes STATS label, HALENSTEIN const contents, ProofHallensteins rename, llms txt files, any MDX.
- [ ] **Step 3:** Pricing anchors + Managed/Agencies sections; features + strategy-engine anchor ids.
- [ ] **Step 4:** `pnpm typecheck && pnpm lint && pnpm build`; grep proves zero remaining `Halenstein`(single-l)/`Prioritize` strings.
- [ ] **Step 5:** Commit `feat(ia): five-step loop copy, en-NZ sweep, pricing + anchor targets`.

---

### Task 4: Homepage rewrite — the eight-section story

**Files:**
- Modify: `app/(marketing)/page.tsx` (section order + all copy), `components/marketing/sections/Hero.tsx` (headline/sub/CTAs/logo-row caption), `components/marketing/visuals/LoopBento.tsx` (5 cards + compact removal if unused), `components/marketing/sections/EvidenceCards.tsx` (split: `FindingsPills` exported standalone; cluster card removed from home)
- Create: `components/marketing/sections/CompoundingBand.tsx` (slim full-width band: deck's "And then it compounds" copy + a compact reuse of the existing `CompoundingChart` visual — import it; if its default size fights the band, wrap with a max-height container rather than editing the chart)
- Create: `components/marketing/sections/ReportBand.tsx` (mid-page lead-magnet band: one line — "See where you stand first — get the free AI Visibility Report." + link to /report styled as secondary CTA; flat card, stage-beige background)

**New homepage order (all copy deck-verbatim; keep JsonLd/FAQ machinery):**
1. `Hero` — H1 "See how AI recommends you. Fix what doesn't. Prove it moved." (replaces RotatingWord headline — keep the component file but stop using RotatingWord if the new H1 has no rotating slot); sub per deck; CTAs Book a chat + "See how the loop works" → `#loop`; logo caption "Monitored across:".
2. `PlatformCard` (unchanged).
3. **Stakes** — plain `Section surface="card"`, centered, deck §2. No visual.
4. **Wound** — `Section surface="cream"`, two-column editorial (heading left, body right), deck §3. No visual.
5. **Loop** — `Section id="loop"`: heading "A loop that closes itself."; `LoopBento` extended to FIVE cards (grid `sm:grid-cols-2 lg:grid-cols-3`, five cards + the 6th cell is the "And then it compounds" mini-card linking to `#compounds` OR leave 5 cards on a 3+2 grid — implementer picks the cleaner read at 1440 and screenshots both if unsure); scenes: reuse existing four scenes, ADD a `VerifyScene` (split from the current combined Verify&Prove card: Verify = the monitoring→live flip pattern from the old vignette — status row "Add product schema" with "monitoring…" → lime "✓ live"; Prove keeps bars+pill). Chips "01 · Measure" … "05 · Prove".
6. `CompoundingBand` (`id="compounds"`) — deck's compounding copy.
7. **Coverage** — existing AnswerReel section, retitle "Measure, live — across every assistant that matters" keeping current sub.
8. **Honesty** — `Section surface="card"`: heading + intro deck §5; two-column: left = the four claims as a styled list (each: bold lead sentence + body, small `Check` icon); right = `FindingsPills` (standalone) with its Illustrative caption. Claims are real semantic text.
9. `ReportBand`.
10. **Feature grid** — existing `FeatureCards`, new SectionHeading title "Everything you'd expect. Wired to something that acts." + existing card copy updated to deck §6 bullet fragments (edit `FeatureCards` data only if its current copy differs).
11. **Proof** — heading; `ProofHallensteins` restyled: stat row via `StatBand` (3 stats: +300% share lift · near-zero → 3.7% AU · the window IF stated in HALENSTEIN data, else omit third stat) + quote-slot comment + "Read the full story →" link to `/case-studies/hallensteins`.
12. FAQ (existing) + `CtaBand` with deck §8 copy.
- REMOVED from home: StatBand's old "Why it matters" section (stats fold into Proof), EvidenceCards cluster (moves to strategy-engine in Task 5), old stakes/loop headings.

- [ ] **Step 1:** Hero + page restructure + new bands per above.
- [ ] **Step 2:** LoopBento 5-card extension + VerifyScene; keep reduced-motion static frames for all five.
- [ ] **Step 3:** `pnpm typecheck && pnpm lint`.
- [ ] **Step 4:** Real-time CDP sweep of every section (anchors `#loop`, `#compounds` work; bento plays; reel cycles; pills tick; reduced-motion pass) + 500px overflow scan.
- [ ] **Step 5:** Commit `feat(home): the loop story — stakes, wound, five-step loop, honesty wedge`.

---

### Task 5: strategy-engine adopts the cluster card + anchor reconciliation

**Files:**
- Modify: `app/(marketing)/strategy-engine/page.tsx` (insert the signal-cluster card — moved from home — into the "what flows in" area beside/replacing part of `SignalIntake`'s section; keep SignalIntake itself unless it now duplicates the cluster outright, in which case swap it for the cluster card and delete `SignalIntake` + its `animated-beam` import IF nothing else uses animated-beam afterward — verify with grep and report), `components/marketing/sections/EvidenceCards.tsx` (export `SignalClusterCard` standalone)

- [ ] **Step 1:** Extract `SignalClusterCard` (heading/blurb + cluster stage, same flat card shell) from EvidenceCards; mount on strategy-engine; decide SignalIntake's fate per above rule and report the decision.
- [ ] **Step 2:** `pnpm typecheck && pnpm lint`; CDP screenshot of the section; 500px scan.
- [ ] **Step 3:** Commit `feat(strategy): signal cluster card on the engine page`.

---

### Task 6: llms.txt, verification pass, PR update

**Files:**
- Modify: `public/llms.txt` + `public/llms-full.txt` OR `app/llms*/route.ts` (wherever the content lives — Task 6 of the previous project edited `app/llms.txt/route.ts`): new IA (nav groups), new pages, five-step loop wording, honesty-wedge claims, Hallensteins spelling.
- Modify (only if checks fail): anything from Tasks 1–5.

- [ ] **Step 1:** llms content update.
- [ ] **Step 2:** `pnpm build` (all routes incl. 4 new prerender); 500px overflow scan on /, /features, /strategy-engine, /pricing, /report, /case-studies, /case-studies/hallensteins, /guides.
- [ ] **Step 3:** Real-time CDP: homepage full story top-to-bottom at two timestamps; nav dropdowns open-state; reduced-motion home pass. Read everything; fix jank; re-run failed checks.
- [ ] **Step 4:** Commit fixes if any; `git push`; `gh pr comment 6 --body "Loop-story IA: nav reorganised Measure→Diagnose→Act→Prove with dropdowns; homepage rewritten to the eight-section narrative (deck: docs/superpowers/specs/2026-07-17-loop-story-copy-deck.md); /report, /case-studies, /guides added."`

---

## Self-Review Notes

- **Deck coverage:** nav ✓ (T1), stubs incl. lead magnet ✓ (T2), five-step loop + compounding ✓ (T3 data + T4 UI), stakes/wound/honesty ✓ (T4), feature-grid reframe ✓ (T4), proof fixes ✓ (T3 spelling + T4 restyle, quote slot guarded), final CTA ✓ (T4), mid-page report band ✓ (T4 ReportBand), animation placement per approved map ✓ (T4/T5; stakes+wound deliberately none).
- **Compile-safety between tasks:** T3 keeps LoopBento compiling with a minimal mapping fix before T4's full 5-card layout; NAV replaces `siteConfig.nav` with all consumers migrated inside T1.
- **Honesty guards:** quote slot comment (T2/T4), no fabricated pricing (T3), no fake case studies (T2), report page describes actual delivery mechanism (T2).
- **Type consistency:** `NavEntry`/`NavGroup`/`NavLink` defined T1, consumed only in Nav; `LOOP_STAGES` 5-entry shape defined T3, consumed T4; `FindingsPills`/`SignalClusterCard` exports defined T4/T5 where consumed.
