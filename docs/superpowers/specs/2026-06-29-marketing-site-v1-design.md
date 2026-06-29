# Heyotis Marketing Site v1 — Design Spec

**Date:** 2026-06-29
**Branch:** `feat/marketing-site-v1`
**Status:** Approved design → implementation
**Owner:** Ash (ash@beautycraft.co.nz)

> Single source of truth for the marketing-site redesign. All implementation agents
> must ground their work in this document. Do not invent product features not
> listed here.

---

## 1. Product truth (what we are allowed to claim)

**Heyotis is an AEO/GEO platform — AI-search brand-visibility intelligence plus a
strategy/action layer.** It runs scheduled *campaigns* of auto-generated, unbiased
buyer-intent prompts against AI assistants, captures the answers, and measures how a
brand shows up: visibility, Share of Voice, ranking vs. named competitors, and which
sources (citations) the AI grounded on. It turns those signals into a prioritized
action plan and ties them to downstream AI referral traffic via GA4.

App's own one-liner: *"managing brand visibility in AI search."*

**Audience:** in-house brand marketing + SEO/AEO teams, and agencies (multi-tenant).
Retail/consumer-brand slant. Buyer cares about defending share of voice vs. named
rivals, owning the citations AI trusts, and proving AI-driven traffic to leadership.

### Feature set (real, grounded in UI + API)
- **Campaigns** — scheduled prompt sets; 3-step wizard (Configuration → Review Queries
  → Scheduling). Config: name, region, customer voice (Generic/Affordable/Premium),
  specializations, seasonal context, prompt count, LLM selection. Auto-generates
  "unbiased queries" the user reviews/edits/approves.
- **Runs / Executions** — manual or scheduled passes; live progress; CSV export.
- **Analytics** — Share of Voice ("Avg Visibility"), visibility×positioning quadrant,
  podium/racing-bar, query-performance heatmap; Top-1/Top-3/Top-5 presence; per-query
  rankings; sentiment + recommendation strength + drivers.
- **Citations** — domains/URLs the AI cited; "Mentioned in response" vs "Cited only",
  owned vs third-party, top-cited domains, citation share over time.
- **Competitors** — explicit competitor set; ranked rivals with owned flag.
- **Strategy Engine** — prioritized action plan; opportunities ranked by Impact ×
  Effort; categories Onsite/Rankings/Citations; evidence drawer; methodology
  ("the wording is generated, the evidence is not").
- **Insights** — detector-generated findings by severity (Critical/Warning/Info) with
  confidence. Detectors: source suppression, citation displacement, declining
  visibility, top-1 position loss, authority gap, missing structured data, stale content.
- **Traffic (GA4)** — AI referral traffic, AI Traffic Share, sessions/conversions by AI
  source.
- **Content Builder** — node-based pipeline builder (AI/Transform/Web Research/Data).
- Multi-tenant: Organization → Brand → Campaign; subscription tiers Basic/Plus/Premium/
  Enterprise with usage metering.

### Claim guardrails (DO NOT violate)
1. **Monitored AI engines = ChatGPT, Claude, Gemini, Perplexity.** (UPDATED 2026-06-29:
   the product owner confirmed Claude IS a tracked engine, overriding the original
   code-audit finding that Claude was internal-only. The site markets all four.)
   **Do not** show Meta/Mistral/Grok/Cohere as
   monitored. (Marketing may mention "and more coming" but must not list unshipped
   engines as live.)
2. **Lead with provably-live capabilities:** Campaigns, Share of Voice, competitive
   analytics, Citations, GA4 Traffic. Present Strategy Engine / Insights / Content
   Builder as core capabilities but **without** hard "live action plan" guarantees
   (they currently render on seeded/demo data in the UI).
3. **Proof is illustrative.** All metrics/customers shown ("Halenstein +300%", any logos)
   are designed/illustrative for v1 unless the user later confirms real, quotable assets.
   Do not fabricate named-customer testimonials presented as real. Use neutral framing
   ("illustrative", or unnamed) where a claim isn't confirmed.

### Vocabulary (match the product)
AI search, AI visibility, Share of Voice, prompts/queries, unbiased queries, AI
responses, campaigns, runs, citations (mentioned vs cited-only, owned vs third-party),
customer voice, region, position/rankings/Top-1, Strategy Engine, opportunities,
impact/effort, action plan, insights, detectors, severity, confidence, AI referral
traffic, AI conversions, recommendations, ChatGPT/Gemini/Perplexity. The "Otis" persona
("How Otis calculates impact") is usable brand texture.

---

## 2. Positioning & messaging

**Primary value prop (hero):**
> **See how AI recommends your brand — and the plan to win the answer.**

Eyebrow (Geist Mono): `AI VISIBILITY · MEASURED` (or similar mono label).
Category to own: **AI brand visibility / AI search visibility & strategy** (AEO/GEO).
Never call it "SEO".

**Five pillars (each grounded in a real feature):**
1. **Measure** — visibility & Share of Voice across ChatGPT, Gemini, Perplexity; scheduled
   campaigns of unbiased queries.
2. **Benchmark** — rank vs. named competitors in AI answers; Top-1/Top-3 presence.
3. **Own your citations** — find where you're "recommended but not cited"; which domains
   feed the answers.
4. **Act** — prioritized action plan; opportunities ranked by Impact × Effort, backed by
   evidence.
5. **Prove ROI** — connect AI visibility to AI referral traffic & conversions via GA4.

**Tone:** confident, specific, editorial; name concrete platforms everywhere
(specificity = credibility). Witty metaphor-driven section headings welcome
("Be the answer, not the asterisk"). Avoid hype/unverifiable claims.

---

## 3. Decisions (locked this session)

| Decision | Choice |
|---|---|
| Conversion model | **Demo-led booking link.** Every CTA → `bookingUrl`. Contact page hosts the embed + email fallback. No self-serve trial language. |
| Product visuals | **Designed mock UI** built in code (no screenshots). On-brand mock dashboards/charts. |
| Customer proof | Illustrative for v1 (see guardrail 3). |
| Pricing | **Contact-sales.** Four tiers (Basic/Plus/Premium/Enterprise) with feature/limit differences; "Talk to us" per tier; no public numbers. |
| Brand look | **Premium marketing variant** — cream canvas + white cards + platform purple; Bricolage display + Geist body + Geist Mono labels. |
| AI engines shown as monitored | ChatGPT, Gemini, Perplexity only. |
| Competitor comparison page | Out of scope for v1. |

**Config constants (in `lib/site.ts`):**
- `bookingUrl` = `https://cal.com/heyotis` — **TODO placeholder**, user to confirm real Cal.com/Calendly link.
- `appUrl` = `https://heyotis.ai` — platform login/signup destination for "Log in".
- `url` (canonical) — currently `https://heyotis.com`; **platform uses `heyotis.ai`.** Flagged for user confirmation; overridable via `NEXT_PUBLIC_SITE_URL`. Default stays as-is unless user says otherwise.
- `contactEmail` = `hello@heyotis.com` (keep).

---

## 4. Visual system

### Canvas & surfaces
- **Page canvas:** warm cream `oklch(0.97 0.003 80)`.
- **Cards:** white `oklch(1 0 0)`.
- **Dark surface (ONE, consistent):** charcoal-ink `oklch(0.21 0.02 280)` for nav band,
  footer, and final CTA band. Text on it = cream `oklch(0.97 0.003 80)`.
- **Remove the conflicting darks:** delete the brown `.dark` block usage, reconcile
  `themeColor` (`#1a0b3c`) and manifest (`#0a0a0a`) to a single charcoal value.

### Brand color (platform purple, hue 280)
- **Primary:** `oklch(0.68 0.1 280)`
- **Accent (CTAs/emphasis, deeper):** `oklch(0.62 0.12 280)`; foreground white.
- **Hover lavender:** `oklch(0.93 0.03 280)`.
- **Warm pastel accent family (data-viz / section variety ONLY, sparingly):** salmon
  `oklch(0.84 0.1 60)`, peach `oklch(0.88 0.08 55)`, coral `oklch(0.82 0.12 30)`,
  soft-orange `oklch(0.85 0.1 70)`, sky `oklch(0.85 0.1 230)`.
- **Chart tokens (reuse from platform for mock visuals):** owned-purple
  `oklch(0.68 0.1 280)`, sky `oklch(0.65 0.18 230)`, peach `oklch(0.7 0.16 55)`,
  purple `oklch(0.6 0.18 300)`, teal `oklch(0.65 0.16 175)`, coral `oklch(0.68 0.14 30)`.
- **AI-source colors:** chatgpt `oklch(0.68 0.1 280)`, gemini `oklch(0.68 0.15 30)`,
  perplexity `oklch(0.65 0.14 230)`.
- **Fix `--ring`** to a purple (hue 280), not the current mismatched orange.

### Typography
- **Display (headlines):** Bricolage Grotesque (already loaded), weight 800, condensed
  width, tight tracking.
- **Body/UI:** Geist.
- **Eyebrows / labels / metrics / stat numerals:** Geist Mono — used deliberately as the
  "engineered/measured" signal (currently underused).
- **Adopt one type scale:** wire the existing `.display-xl/-lg/-md/-sm` utilities and use
  them; stop hand-rolling sizes per section.

### Radius & rhythm
- Single radius token `~0.875rem`; reserve `2rem` for hero/feature cards only.
- Consistent section vertical rhythm (e.g. `py-20 md:py-28`), applied uniformly.

### Brand mark & assets (must produce)
- **Mark:** adopt the platform's purple rising-bars (3-bar ascending) glyph + "heyotis"
  wordmark (Bricolage, condensed, weight 800).
- **Generate (currently 404):** `/logo.png`, `/opengraph-image.png`, `/icon.png`,
  `/icon-512.png`. Source from the purple glyph.
- **Brand the `/api/og` generator** to the new palette + Bricolage.

---

## 5. Tech plan

### Keep
Next.js 16.2.6 (App Router — `params`/`searchParams` are Promises), React 19.2.4,
Tailwind v4 (CSS-first `@theme inline`, no config file), shadcn (new-york/zinc, lucide),
`motion ^12.40` (`motion/react`), embla + auto-scroll, MDX pipeline, the full SEO/schema
stack (`lib/seo.ts`, `lib/schema.ts`, `JsonLd.tsx`, sitemap/robots/manifest, `/api/og`).

### Add (via shadcn registry — source into repo, we own the code)
Register namespaces in `components.json`:
```json
"registries": {
  "@magicui": "https://magicui.design/r/{name}.json",
  "@aceternity": "https://ui.aceternity.com/registry/{name}.json"
}
```
- **Magic UI:** marquee, bento-grid, number-ticker, animated-beam, grid-pattern,
  flickering-grid.
- **Aceternity:** spotlight(-new), background-beams, card-spotlight,
  container-scroll-animation, animated-testimonials, text-generate-effect.
- **Lenis:** `pnpm add lenis`; mount `<ReactLenis root>` in a thin `"use client"`
  `<SmoothScroll>` wrapping `{children}` in `app/(marketing)/layout.tsx` (NOT the RSC
  root). Gate on reduced-motion.
- **shadcn primitives still needed:** accordion, tabs, table, input/form/textarea
  (contact), dialog.
- **Motion import hygiene:** registry components emit `from "framer-motion"`; we use
  `motion`. Normalize imports to `motion/react` (single source of truth) OR keep both —
  prefer rewriting to `motion/react`.

### Performance guardrails
- **RSC by default**, small `"use client"` islands for motion only.
- **Hero LCP text renders server-side** — never gate the LCP heading at `opacity:0`;
  animate a wrapper/decoration instead. `priority` on any hero image.
- **Lazy-load below-the-fold heavy effects** via `dynamic(() => import(...), { ssr:false })`
  (beams/grids/container-scroll). Keep them out of the LCP path.
- Animate only `transform`/`opacity`. Reserve min-heights on animated sections (no CLS).
- `useInView({ once:true })` / `whileInView` so RAF doesn't run off-screen.
- `LazyMotion` + `m` (domAnimation) to shrink the motion bundle where practical.
- **Cap to ~8 high-ROI effects.** Restraint > out-rainbowing competitors.

### Accessibility guardrails
- Root `<MotionConfig reducedMotion="user">` + `useReducedMotion()` to swap
  parallax/auto-rotate/aura for static states.
- **Gate Lenis on reduced-motion** (skip init → native scroll).
- `data-lenis-prevent` on nested scrollers (mega-menu, modals, calendar embed, code
  blocks). Call `lenis.resize()` after lazy sections / route changes.
- Keyboard nav + visible focus on all tabs/accordions; content readable without effects.

---

## 6. Sitemap & navigation

**Ship only real routes:** `/` · `/features` · `/pricing` · `/about` · `/contact` ·
`/blog` · `/blog/[slug]`.

**Kill the ~21 dead links** currently in `lib/site.ts` nav + `Footer.tsx`
(`/platform`, `/campaigns`, `/brand`, `/traffic`, `/e-commerce`, `/agencies`,
`/case-studies`, `/product/*`, `/solutions/*`, `/success-stories`, etc.).

**Nav:** Product/Features · Pricing · Resources (Blog) · About + **Book a chat** (solid).
"Log in" → `appUrl`. Mega-menu only if it points to real anchors/sections; otherwise
simple links.

**Footer:** rebuild with real links only. New on-brand strapline (delete the hospitality
"agentic operating system for ambitious operators" leftover and the Workforce/Inventory/
Restaurants/Coffee taxonomy). Add `/privacy` + `/terms` only if those pages will exist;
otherwise omit. (v1: omit legal pages unless user requests; do not link to 404s.)

---

## 7. Per-page section plan

Component keys: **[A]** Aceternity · **[M]** Magic UI · **[Mo]** Motion primitive.

### HOME (`/`)
1. **Sticky nav** — slim, cream→charcoal on scroll; wordmark + glyph; solid "Book a chat".
2. **Hero** — Bricolage headline (em-dash structure) + Geist Mono eyebrow; rotating AI
   assistant word ("…in **ChatGPT** / **Gemini** / **Perplexity**") via Word Rotate /
   Text Generate [A]; ambient Spotlight / Background Beams [A] behind; faded grid texture
   [M]; primary CTA with `cta-nudge` micro-interaction [Mo]; secondary "See a sample
   report" (scrolls to product reveal). LCP heading server-rendered.
3. **Logo trust marquee** — Marquee [M], edge-faded. Row = the three AI assistants
   ("Benchmarked across ChatGPT, Gemini, Perplexity") and/or illustrative brand logos.
4. **Product reveal** — Container Scroll Animation [A] revealing a mock dashboard
   (visibility/Share-of-Voice chart). Replaces the gradient placeholder.
5. **Stats band** — Number Ticker [M] count-ups, each paired with a (illustrative) named
   customer card.
6. **Pillars / how-it-works** — the five pillars (Measure · Benchmark · Citations · Act ·
   Prove) as a Bento Grid [M] or auto-rotating feature tabs w/ progress bar [A].
7. **"Across every major AI assistant"** — Animated Beam [M] connecting a brand node ↔
   ChatGPT/Gemini/Perplexity nodes. (Reserve any rainbow conic aura to here only.)
8. **Feature deep-dive cards** — Card Spotlight / 3D Card [A]: Share of Voice & rankings;
   Citations (mentioned vs cited-only); Strategy Engine; GA4 AI traffic.
9. **Testimonial / case study** — Animated Testimonials [A] + stat+logo card (illustrative).
10. **FAQ** — shadcn accordion; feeds the existing `faqPageSchema`. H2s written as AEO
    answer targets ("How does Heyotis track AI search visibility?").
11. **Final CTA band** — charcoal surface; "Book a chat" + secondary "See a sample report".
12. **Footer** — rebuilt, real links, on-brand strapline.

### FEATURES (`/features`)
1. Page hero (mono eyebrow + Bricolage headline, lighter than home).
2. **Auto-rotating feature tabs [A]** over the real modules: Campaigns → Analytics/SoV →
   Citations → Competitors → Strategy Engine → Insights → GA4 Traffic → Content Builder.
   Each tab = mock visual + one-line value prop + 3 Geist-Mono bullets.
3. **Bento Grid [M]** of detector/insight capabilities.
4. **Animated Beam [M]** integrations row (GA4; AI assistants).
5. Stat band (Number Ticker [M]) + FAQ + CTA band.

### PRICING (`/pricing`)
1. Hero + (optional) monthly/annual toggle that just reframes copy (no numbers).
2. **Four contact-sales tier cards** — Basic / Plus / Premium / Enterprise; Card Spotlight
   [A] on the recommended tier; surface real limits (active-prompt cap, monthly
   AI-response cap, seats, engines) as differentiators; "Talk to us" CTA → `bookingUrl`.
3. Feature comparison table (shadcn) + FAQ (`faqPageSchema`) + CTA band.

### ABOUT (`/about`)
1. Hero / mission ("AI search is rewriting brand discovery…"), `data-speakable` lede.
2. The "Otis" persona / methodology section ("the wording is generated, the evidence is
   not").
3. Optional values/approach; subtle grid texture [M]; light reveals (`useInView` once).
4. CTA band.

### CONTACT (`/contact`)
1. Two-column: copy + **Cal.com/Calendly embed** (or request-a-demo form fallback);
   mark embed `data-lenis-prevent`.
2. Direct email fallback (`contactEmail`) + response-time line.
3. Render `breadcrumbSchema` + `localBusinessSchema` (currently defined but unused).

### BLOG (`/blog`, `/blog/[slug]`)
- Keep structure. **Define the missing `.prose-like`** typographic wrapper in globals.css.
- Index: card grid with light hover reveals.
- Post: keep breadcrumb + article schema + `data-speakable` lede.
- Seed 2–3 real AEO posts to replace `hello-world.mdx` (topics: "What is AEO/GEO", "How AI
  assistants pick which brands to recommend", "Share of Voice in AI search").

---

## 8. Cross-cutting fixes (punch list)

- [ ] Rebuild `lib/site.ts` nav (kill dead links; add `bookingUrl`, `appUrl`).
- [ ] Rebuild `Footer.tsx` (real links, on-brand strapline, delete hospitality taxonomy).
- [ ] Reconcile LogoStrip to 3 real engines.
- [ ] Define `.prose-like` in globals.css.
- [ ] Remove the fictitious `/search` SearchAction from `websiteSchema` (no search page).
- [ ] Generate brand assets: `/logo.png`, `/opengraph-image.png`, `/icon.png`,
      `/icon-512.png`; brand `/api/og`.
- [ ] Write real `public/llms.txt` + `public/llms-full.txt` (dogfood the AEO stack).
- [ ] Sitemap lists only built routes.
- [ ] Single charcoal dark surface + single themeColor across `globals.css` / viewport /
      manifest.
- [ ] Adopt one type scale (`.display-*`) and one radius token.
- [ ] Delete orphaned components or wire them: `AnnouncementBar.tsx`,
      `components/marketing/Hero.tsx` (generic, unused).
- [ ] `pnpm dev` → `next dev --turbopack` (match AGENTS.md).
- [ ] Every page calls `buildMetadata({...})`; renders `breadcrumbSchema`; FAQ sections
      render `faqPageSchema`; lede paragraphs carry `data-speakable`.

---

## 9. Build approach (waves)

1. **Foundation** — design tokens in `globals.css`, install libs + register shadcn
   namespaces, `lib/site.ts` rewrite, Lenis `SmoothScroll`, `MotionConfig`, brand assets,
   shared primitives pulled from registries.
2. **Shared components** — Nav, Footer, section primitives (mock dashboard, stat card,
   AI-beam, marquee, feature tabs, FAQ accordion, CTA band).
3. **Pages (parallel)** — Home, Features, Pricing, About, Contact, Blog.
4. **Polish & verify** — `pnpm build`, `pnpm lint`, `pnpm typecheck`; reduced-motion +
   keyboard pass; LCP/CLS sanity; dead-link check; OG/asset check.

Pages mutate shared files (`globals.css`, `lib/site.ts`) — foundation + shared waves run
before page wave to avoid conflicts; page agents that touch the same file run with
worktree isolation or are serialized.

---

## 10. Open items (non-blocking; user to confirm when convenient)

1. **Booking URL** — real Cal.com/Calendly link (placeholder `https://cal.com/heyotis`).
2. **Canonical domain** — `heyotis.com` (marketing config) vs `heyotis.ai` (platform).
3. **Real proof assets** — any real customer names/logos/quotes/metrics to swap in later.
4. **Pricing tier limits** — confirm the real per-tier limits to show as differentiators
   (we'll use the API-evidenced structure as a sensible default otherwise).
