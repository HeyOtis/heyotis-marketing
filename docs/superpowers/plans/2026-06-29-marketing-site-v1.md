# Heyotis Marketing Site v1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This repo has NO unit-test framework; the verification cycle for every task is `pnpm typecheck` → `pnpm lint` → `pnpm build` plus the per-task render/behavior checklist.

**Goal:** Ship a deployable, professionally-polished marketing site for Heyotis (AI brand-visibility / AEO platform) with motion polish, built on the existing Next.js 16 + Tailwind v4 + shadcn foundation.

**Architecture:** RSC-first marketing pages with small `"use client"` animation islands. Shared design tokens in `globals.css`; site config in `lib/site.ts`; animated primitives sourced from Magic UI + Aceternity shadcn registries (we own the code) + Lenis smooth scroll mounted only in the marketing route-group layout. All pages use the existing `buildMetadata()` + JSON-LD scaffolding.

**Tech Stack:** Next.js 16.2.6 (App Router), React 19.2.4, Tailwind v4 (CSS-first), shadcn (new-york/zinc, lucide), motion ^12.40 (`motion/react`), Magic UI + Aceternity (via shadcn CLI), Lenis, MDX (next-mdx-remote-client).

**Companion spec:** `docs/superpowers/specs/2026-06-29-marketing-site-v1-design.md` (READ FIRST — product-truth, claim guardrails, palette tokens, per-page section plan all live there and are binding).

## Global Constraints

- **Claim guardrail:** monitored AI engines = **ChatGPT, Gemini, Perplexity ONLY**. Never show Meta/Mistral/Grok/Cohere as monitored. Claude is internal-only, not monitored.
- **Claim guardrail:** lead with provably-live features (Campaigns, Share of Voice, competitive analytics, Citations, GA4 Traffic). Strategy Engine / Insights / Content Builder = "core capability" framing, no hard "live action plan" guarantee.
- **Claim guardrail:** all metrics/customers/logos are illustrative for v1. No fabricated named testimonials presented as fact.
- **Never call it "SEO."** Category = AI brand visibility / AEO/GEO.
- **Brand:** cream canvas `oklch(0.97 0.003 80)`, white cards, ONE charcoal dark surface `oklch(0.21 0.02 280)`, platform purple primary `oklch(0.68 0.1 280)` / accent `oklch(0.62 0.12 280)`. Bricolage display + Geist body + Geist Mono labels.
- **Every page** calls `buildMetadata({ title, description, path })`, renders `<JsonLd data={breadcrumbSchema([...])} />`; FAQ sections render `faqPageSchema`; the lede paragraph carries `data-speakable`.
- **Performance:** RSC by default; `"use client"` only on motion leaves; hero LCP heading NOT gated at opacity:0; below-fold heavy effects `dynamic(..., { ssr:false })`; animate only transform/opacity; reserve min-heights (no CLS).
- **A11y:** root `<MotionConfig reducedMotion="user">`; Lenis gated on reduced-motion; `data-lenis-prevent` on nested scrollers; keyboard + visible focus on tabs/accordions.
- **Next 16:** `params`/`searchParams` are `Promise<…>` — always `await`.
- **CTA:** every "Book a chat" → `siteConfig.bookingUrl`. "Log in" → `siteConfig.appUrl`.
- **Commit cadence:** commit after each task. Branch: `feat/marketing-site-v1`. Co-author trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

## File Structure

**Foundation / config**
- `app/globals.css` — MODIFY: rewrite token layer (palette, one dark surface, type scale, radius, `.prose-like`, `cta-nudge` keyframes, helper utilities).
- `lib/site.ts` — MODIFY: rewrite nav (real links only), add `bookingUrl`, `appUrl`, `footerNav`, keep socials/description.
- `components.json` — MODIFY: add `@magicui` + `@aceternity` registries.
- `app/layout.tsx` — MODIFY: single themeColor; ensure fonts/JSON-LD intact.
- `app/manifest.ts` — MODIFY: theme_color → charcoal; real icon paths.
- `package.json` — MODIFY: `dev` → `next dev --turbopack`; add `lenis`.

**Providers / shell**
- `components/providers/SmoothScroll.tsx` — CREATE: `"use client"` Lenis wrapper (reduced-motion gated).
- `components/providers/MotionProvider.tsx` — CREATE: `"use client"` `<MotionConfig reducedMotion="user">`.
- `app/(marketing)/layout.tsx` — MODIFY: wrap children in providers; Nav/Footer.
- `components/marketing/Nav.tsx` — MODIFY: rebuild from new config; scroll state.
- `components/marketing/Footer.tsx` — MODIFY: rebuild; on-brand strapline; real links.
- `components/marketing/AnnouncementBar.tsx` — DELETE (or keep dormant; default DELETE).
- `components/marketing/Hero.tsx` — DELETE (orphaned generic hero; home uses `sections/Hero.tsx`).

**Registry primitives (sourced via shadcn CLI into these paths; we own them)**
- `components/ui/marquee.tsx`, `bento-grid.tsx`, `number-ticker.tsx`, `animated-beam.tsx`, `grid-pattern.tsx`, `flickering-grid.tsx` (Magic UI)
- `components/ui/spotlight.tsx`, `background-beams.tsx`, `card-spotlight.tsx`, `container-scroll-animation.tsx`, `animated-testimonials.tsx`, `text-generate-effect.tsx` (Aceternity)
- `components/ui/accordion.tsx`, `tabs.tsx`, `table.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx` (shadcn)

**Shared marketing building blocks (CREATE)**
- `components/marketing/primitives/Section.tsx` — surface/padding wrapper.
- `components/marketing/primitives/Eyebrow.tsx` — Geist Mono label.
- `components/marketing/primitives/SectionHeading.tsx` — Bricolage heading + optional sub.
- `components/marketing/primitives/BookCta.tsx` — primary/secondary CTA buttons (booking link).
- `components/marketing/primitives/Reveal.tsx` — `whileInView` fade/translate (reduced-motion safe).
- `components/marketing/visuals/MockDashboard.tsx` — designed product visual (SoV chart + scorecard).
- `components/marketing/visuals/AiSourceBeam.tsx` — brand ↔ ChatGPT/Gemini/Perplexity beam.
- `components/marketing/visuals/AiSourceLogos.tsx` — the 3 real engine logos (lobehub icons).
- `components/marketing/sections/CtaBand.tsx` — charcoal final CTA band.
- `components/marketing/sections/Faq.tsx` — accordion + `faqPageSchema` data, reusable.
- `components/marketing/sections/StatBand.tsx` — number-ticker stat+customer cards.
- `components/marketing/sections/FeatureTabs.tsx` — auto-rotating tabbed feature tour.
- `components/marketing/sections/PillarBento.tsx` — 5-pillar bento grid.

**Home sections (MODIFY existing + add)**
- `components/marketing/sections/Hero.tsx` — rebuild (rotating engine word, spotlight, grid, CTA).
- `components/marketing/sections/LogoStrip.tsx` — reconcile to 3 engines (or marquee).
- `components/marketing/sections/ProductReveal.tsx` — CREATE (container-scroll + MockDashboard).
- `components/marketing/sections/FeatureCards.tsx` — CREATE (card-spotlight deep-dives).
- `components/marketing/sections/Testimonial.tsx` — CREATE (animated-testimonials).
- DELETE/replace `ValueStatement.tsx`, `PlatformShowcase.tsx`, `FeatureTwoCol.tsx` content as folded into new sections (keep names only if reused).

**Pages (MODIFY)**
- `app/(marketing)/page.tsx` (home), `features/page.tsx`, `pricing/page.tsx`, `about/page.tsx`, `contact/page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`.

**SEO / assets**
- `lib/schema.ts` — MODIFY: remove `/search` SearchAction.
- `app/api/og/route.tsx` — MODIFY: brand to new palette + Bricolage.
- `app/sitemap.ts` — MODIFY: only built routes.
- `public/logo.png`, `public/opengraph-image.png`, `public/icon.png`, `public/icon-512.png` — CREATE (from purple rising-bars glyph).
- `public/llms.txt`, `public/llms-full.txt` — REWRITE (real product copy).
- `content/blog/*.mdx` — CREATE 2–3 real posts; remove `hello-world.mdx`.

---

## Shared Contracts (define once; all agents consume these exact signatures)

### Design tokens (added/normalized in `app/globals.css` `@theme inline` + `:root`)
```css
/* surfaces */
--background: oklch(0.97 0.003 80);   /* cream canvas */
--foreground: oklch(0.22 0.02 285);   /* ink */
--card: oklch(1 0 0);                  /* white */
--surface-dark: oklch(0.21 0.02 280);  /* the ONE charcoal */
--surface-dark-foreground: oklch(0.97 0.003 80);
/* brand */
--primary: oklch(0.68 0.1 280);
--primary-foreground: oklch(1 0 0);
--accent: oklch(0.62 0.12 280);        /* CTA/emphasis */
--accent-foreground: oklch(1 0 0);
--lavender-hover: oklch(0.93 0.03 280);
--ring: oklch(0.62 0.12 280);          /* was orange — fix to purple */
/* pastel data-viz accents (sparingly) */
--salmon: oklch(0.84 0.1 60); --peach: oklch(0.88 0.08 55);
--coral: oklch(0.82 0.12 30); --soft-orange: oklch(0.85 0.1 70);
--sky: oklch(0.85 0.1 230);
/* chart tokens */
--chart-1: oklch(0.68 0.1 280); --chart-2: oklch(0.65 0.18 230);
--chart-3: oklch(0.7 0.16 55);  --chart-4: oklch(0.6 0.18 300);
--chart-5: oklch(0.65 0.16 175);
/* ai sources */
--ai-chatgpt: oklch(0.68 0.1 280); --ai-gemini: oklch(0.68 0.15 30);
--ai-perplexity: oklch(0.65 0.14 230);
--radius: 0.875rem;
```
Utilities to (re)define: `.surface-dark`, `.surface-cream`, `.surface-card`, the
`.display-xl/-lg/-md/-sm` scale (and USE it), `.prose-like` (blog body wrapper),
`.font-display`, and a `cta-nudge` keyframe (single hop, not pulse).

### `lib/site.ts` shape (Produces — consumed by Nav, Footer, every CTA)
```ts
export const siteConfig = {
  name: "Heyotis", shortName: "Heyotis",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://heyotis.com", // domain TBD (see spec §10)
  appUrl: "https://heyotis.ai",            // "Log in" destination
  bookingUrl: "https://cal.com/heyotis",   // TODO: real Cal.com/Calendly link
  description: "Heyotis measures how AI assistants recommend your brand — Share of Voice, citations and competitive rank across ChatGPT, Gemini and Perplexity — and turns it into a prioritized action plan.",
  locale: "en-US", defaultOgImage: "/opengraph-image.png",
  twitterHandle: "@heyotis", contactEmail: "hello@heyotis.com",
  socials: { twitter: "...", linkedin: "...", github: "..." },
  nav: [
    { href: "/features", label: "Product" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Resources" },
    { href: "/about", label: "About" },
  ],
  footerNav: [ /* groups of real links only: Product(/features,/pricing), Company(/about,/blog,/contact) */ ],
} as const;
```

### Shared component prop interfaces (Produces — these signatures are binding)
```ts
// Section.tsx
type SectionProps = { surface?: "cream" | "card" | "dark"; className?: string; id?: string; children: React.ReactNode };
// Eyebrow.tsx
type EyebrowProps = { children: React.ReactNode; className?: string };       // renders mono uppercase label
// SectionHeading.tsx
type SectionHeadingProps = { eyebrow?: string; title: React.ReactNode; sub?: React.ReactNode; align?: "left"|"center"; as?: "h1"|"h2"; className?: string };
// BookCta.tsx
type BookCtaProps = { variant?: "primary"|"secondary"|"inverse"; label?: string; href?: string; className?: string; nudge?: boolean };
// Reveal.tsx (client)
type RevealProps = { children: React.ReactNode; delay?: number; y?: number; className?: string };
// MockDashboard.tsx
type MockDashboardProps = { variant?: "overview"|"citations"|"competitors"; className?: string };
// AiSourceBeam.tsx — no required props
// Faq.tsx
type FaqItem = { q: string; a: string };
type FaqProps = { items: FaqItem[]; heading?: string; eyebrow?: string };    // also export faqItemsToSchema(items) for faqPageSchema
// StatBand.tsx
type Stat = { value: number; suffix?: string; prefix?: string; label: string; customer?: string };
type StatBandProps = { stats: Stat[]; className?: string };
// FeatureTabs.tsx
type FeatureTab = { id: string; label: string; title: string; blurb: string; bullets: string[]; visual?: React.ReactNode };
type FeatureTabsProps = { tabs: FeatureTab[]; autoRotateMs?: number };
// CtaBand.tsx
type CtaBandProps = { title?: React.ReactNode; sub?: string; className?: string };
```

---

## WAVE 0 — Foundation (serial; everything depends on this)

### Task 0.1: Branch + deps + registries
**Files:** Modify `package.json`, `components.json`.
- [ ] **Step 1:** Confirm on branch `feat/marketing-site-v1` (`git branch --show-current`).
- [ ] **Step 2:** `pnpm add lenis`.
- [ ] **Step 3:** In `package.json` set `"dev": "next dev --turbopack"`.
- [ ] **Step 4:** In `components.json` add:
  ```json
  "registries": { "@magicui": "https://magicui.design/r/{name}.json", "@aceternity": "https://ui.aceternity.com/registry/{name}.json" }
  ```
- [ ] **Step 5:** Verify: `pnpm typecheck` (no change expected) → PASS. Commit `chore: deps + shadcn registries + turbopack dev`.

### Task 0.2: Pull registry + shadcn primitives
**Files:** Create `components/ui/*` (listed in File Structure).
- [ ] **Step 1:** shadcn primitives: `npx shadcn@latest add accordion tabs table input textarea label` (non-interactive; accept overwrites = no).
- [ ] **Step 2:** Magic UI: `npx shadcn@latest add @magicui/marquee @magicui/bento-grid @magicui/number-ticker @magicui/animated-beam @magicui/grid-pattern @magicui/flickering-grid`.
- [ ] **Step 3:** Aceternity: `npx shadcn@latest add @aceternity/spotlight-new @aceternity/background-beams @aceternity/card-spotlight @aceternity/container-scroll-animation @aceternity/animated-testimonials @aceternity/text-generate-effect`.
- [ ] **Step 4:** Import hygiene — rewrite any `from "framer-motion"` to `from "motion/react"` in the pulled files: `grep -rl 'framer-motion' components/ui | xargs sed -i '' 's#framer-motion#motion/react#g'` (verify each still typechecks; some APIs differ — fix imports like `useAnimationFrame`, `AnimatePresence` which exist in `motion/react`).
- [ ] **Step 5:** If a registry add fails (network/registry shape), implement the component by hand from the Magic UI / Aceternity source pattern (they are MIT, plain Motion + `cn()`); do NOT leave a missing file. Note any hand-built ones in the commit body.
- [ ] **Step 6:** Verify `pnpm typecheck` → PASS. Commit `feat: add magicui/aceternity/shadcn primitives`.

### Task 0.3: Design tokens in `globals.css`
**Files:** Modify `app/globals.css`.
**Produces:** all tokens/utilities in Shared Contracts.
- [ ] **Step 1:** Replace the `:root` palette with the token block above; delete the brown `.dark` block (no theme toggle exists); keep `@theme inline` mappings and add the new tokens (chart/ai/pastel/surface-dark).
- [ ] **Step 2:** Define `.surface-dark` (bg `--surface-dark`, color `--surface-dark-foreground`), `.surface-cream`, `.surface-card`; wire `.display-xl/-lg/-md/-sm`; add `.prose-like` (max-width measure, heading/paragraph/list/link/code/blockquote rhythm in tokens, NOT zinc); add `@keyframes cta-nudge` + `.cta-nudge` (one ~6px hop every ~3s, disabled under `prefers-reduced-motion`).
- [ ] **Step 3:** Set `--ring` to purple.
- [ ] **Step 4:** Verify `pnpm build` → PASS (CSS compiles); spot-check home still renders (`pnpm dev`, load `/`). Commit `feat: unified design tokens + type scale + prose-like`.

### Task 0.4: Single themeColor + manifest + sitemap + schema fixes
**Files:** Modify `app/layout.tsx`, `app/manifest.ts`, `app/sitemap.ts`, `lib/schema.ts`.
- [ ] **Step 1:** `app/layout.tsx` viewport `themeColor`: single charcoal `#2b2733` (≈ surface-dark) for both / or light cream + dark charcoal pair — pick ONE pair and keep consistent with manifest.
- [ ] **Step 2:** `app/manifest.ts`: `theme_color` charcoal, `background_color` cream; icon `src` → `/icon.png`, `/icon-512.png`.
- [ ] **Step 3:** `app/sitemap.ts`: static routes = `/`, `/features`, `/pricing`, `/about`, `/contact`, `/blog` + blog posts (keep — these will all be real after this plan).
- [ ] **Step 4:** `lib/schema.ts`: remove the `potentialAction`/`SearchAction` block from `websiteSchema` (no `/search` page).
- [ ] **Step 5:** Verify `pnpm typecheck` + `pnpm build` → PASS. Commit `fix: single theme color, manifest icons, sitemap, drop fake SearchAction`.

### Task 0.5: `lib/site.ts` rewrite
**Files:** Modify `lib/site.ts`.
**Produces:** `siteConfig` per Shared Contracts (nav, footerNav, bookingUrl, appUrl).
- [ ] **Step 1:** Replace nav with the 4 real items; remove all mega-menu objects pointing to dead routes (keep the `NavItem`/menu types but home nav uses simple links). Add `appUrl`, `bookingUrl`, `footerNav` groups (real links only). Update `description` to the AEO one.
- [ ] **Step 2:** Verify `pnpm typecheck` → PASS (Nav/Footer will be updated in Wave 1; if they reference removed fields, that's fixed there — but keep this compiling by leaving `NavItem` shape intact). Commit `feat: rewrite site config — real nav, bookingUrl, appUrl`.

### Task 0.6: Providers + brand assets
**Files:** Create `components/providers/SmoothScroll.tsx`, `MotionProvider.tsx`; create `public/logo.png`, `opengraph-image.png`, `icon.png`, `icon-512.png`.
**Produces:** `<SmoothScroll>`, `<MotionProvider>`.
- [ ] **Step 1:** `MotionProvider.tsx` (`"use client"`): wraps children in `<MotionConfig reducedMotion="user">`.
- [ ] **Step 2:** `SmoothScroll.tsx` (`"use client"`): mount `ReactLenis` from `lenis/react` with `root`; `useReducedMotion()` → if reduced, render `{children}` with no Lenis. Options: `lerp ~0.1`, `smoothWheel true`.
- [ ] **Step 3:** Brand assets: generate the purple rising-bars glyph as SVG, render to PNGs (`logo.png` ~512², `icon.png` 192², `icon-512.png` 512², `opengraph-image.png` 1200×630 with glyph + "heyotis" wordmark on cream). Use a small node/sharp or canvas script, OR an SVG→PNG via `@resvg/resvg-js` if available; otherwise commit crisp SVGs and reference `.svg`. Ensure `schema.ts` logo + `defaultOgImage` resolve (no 404).
- [ ] **Step 4:** Verify files exist + `pnpm build` → PASS. Commit `feat: motion/lenis providers + brand assets`.

---

## WAVE 1 — Shared shell + primitives (depends on Wave 0)

### Task 1.1: Marketing layout wiring
**Files:** Modify `app/(marketing)/layout.tsx`.
**Consumes:** `<SmoothScroll>`, `<MotionProvider>`, `Nav`, `Footer`.
- [ ] **Step 1:** Wrap: `<MotionProvider><SmoothScroll><Nav/><main>{children}</main><Footer/></SmoothScroll></MotionProvider>`. Remove the old `.surface-dark` div wrapper around Nav (Nav owns its own surface).
- [ ] **Step 2:** Verify `pnpm build`; `/` renders, smooth scroll active, reduced-motion disables it. Commit.

### Task 1.2: Primitives — Section, Eyebrow, SectionHeading, BookCta, Reveal
**Files:** Create the 5 files in `components/marketing/primitives/`.
**Produces:** the prop interfaces in Shared Contracts.
- [ ] **Step 1:** Implement each per its prop signature. `Section` maps `surface` → `.surface-*` class + standard `py-20 md:py-28` + `Container`. `Eyebrow` = Geist Mono, uppercase, tracking, accent color. `SectionHeading` = optional Eyebrow + Bricolage title (`.display-*`) + optional sub. `BookCta` = shadcn Button variants; primary links to `siteConfig.bookingUrl`, inverse for dark bands; `nudge` adds `.cta-nudge`. `Reveal` (`"use client"`) = `motion` `whileInView` opacity 0→1 + y, `viewport={{once:true}}`, respects reduced-motion.
- [ ] **Step 2:** Verify `pnpm typecheck` + `pnpm lint`. Commit `feat: marketing primitives`.

### Task 1.3: Nav rebuild
**Files:** Modify `components/marketing/Nav.tsx`.
**Consumes:** `siteConfig.nav`, `bookingUrl`, `appUrl`, `BookCta`.
- [ ] **Step 1:** Slim sticky nav: glyph+wordmark left; nav links center/right; "Log in" (→ appUrl) + solid "Book a chat" (→ bookingUrl). Scroll-state: transparent-on-cream at top → charcoal/blur after ~40px (`"use client"` scroll listener or `useScroll`). Mobile: sheet/disclosure menu (shadcn or simple). Keyboard accessible.
- [ ] **Step 2:** Verify render at top + scrolled, mobile menu opens, links resolve. Commit `feat: rebuild nav`.

### Task 1.4: Footer rebuild
**Files:** Modify `components/marketing/Footer.tsx`.
**Consumes:** `siteConfig.footerNav`, socials.
- [ ] **Step 1:** Charcoal `.surface-dark` footer; glyph+wordmark; on-brand strapline (e.g. "Brand visibility for the age of AI search."); real link columns only; socials; copyright. NO Workforce/Inventory/Restaurants. Legal links only if pages exist (v1: omit or link to `mailto`/`#`-free — omit).
- [ ] **Step 2:** Verify no dead links (every href is a real route, external URL, or mailto). Commit `feat: rebuild footer`.

### Task 1.5: Reusable sections — CtaBand, Faq, StatBand, FeatureTabs, PillarBento; visuals — MockDashboard, AiSourceBeam, AiSourceLogos
**Files:** Create the section + visual files.
**Produces:** their prop interfaces (Shared Contracts).
- [ ] **Step 1 (visuals):** `AiSourceLogos` = OpenAI/ChatGPT, Gemini, Perplexity via `@lobehub/icons` (ONLY these three). `MockDashboard` = pure-CSS/SVG designed dashboard (header chip "AI Visibility", a Share-of-Voice line/area chart using chart tokens, a Top-3 ranking list, a scorecard with ChatGPT=Recommended/Gemini=Mentioned/Perplexity=Missing). `AiSourceBeam` = brand node center, 3 engine nodes, `animated-beam` connectors.
- [ ] **Step 2 (sections):** `CtaBand` (charcoal, heading + BookCta inverse + secondary). `Faq` (shadcn accordion + exported `faqItemsToSchema`). `StatBand` (number-ticker per stat + optional customer label). `FeatureTabs` (`"use client"`: tab list + auto-rotate with progress bar, pause on hover, reduced-motion = no auto-rotate). `PillarBento` (bento-grid of the 5 pillars).
- [ ] **Step 3:** Verify `pnpm typecheck` + `pnpm lint` + render each in isolation on a scratch route or Storybook-free quick check via home draft. Commit `feat: reusable marketing sections + visuals`.

---

## WAVE 2 — Pages (parallelizable AFTER Wave 1; each page = its own task)

> Each page task: rebuild the page using primitives + sections; call `buildMetadata`; render `breadcrumbSchema`; FAQ → `faqPageSchema`; lede `data-speakable`; verify `pnpm build` + visual checklist; commit.

### Task 2.1: Home (`app/(marketing)/page.tsx` + `sections/Hero.tsx`, `ProductReveal.tsx`, `FeatureCards.tsx`, `Testimonial.tsx`, reconcile `LogoStrip.tsx`)
- [ ] **Step 1:** Rebuild `Hero.tsx`: charcoal or cream hero (choose cream-with-spotlight for the premium look) — Geist Mono eyebrow, Bricolage headline "See how AI recommends your brand —" with rotating engine word (`text-generate`/word-rotate cycling ChatGPT/Gemini/Perplexity), sub-headline, `BookCta primary nudge` + secondary "See a sample report" (anchors to `#product`). Spotlight + faded grid bg, `dynamic ssr:false` for heavy bg. LCP heading server-rendered (not opacity-0).
- [ ] **Step 2:** Compose page order per spec §7 HOME: Hero → LogoStrip(marquee, 3 engines) → ProductReveal(container-scroll + MockDashboard, `id="product"`) → StatBand → PillarBento (5 pillars) → AiSourceBeam section → FeatureCards (card-spotlight: SoV, Citations, Strategy Engine, GA4 traffic) → Testimonial → Faq → CtaBand.
- [ ] **Step 3:** FAQ items written as AEO answers; pass to `faqPageSchema`. Breadcrumb schema. Hero lede `data-speakable`.
- [ ] **Step 4:** Verify `pnpm build`; scroll the page; reduced-motion check. Commit `feat: home page`.

### Task 2.2: Features (`app/(marketing)/features/page.tsx`)
- [ ] **Step 1:** Hero (lighter). `FeatureTabs` over real modules (Campaigns, Analytics/SoV, Citations, Competitors, Strategy Engine, Insights, GA4 Traffic, Content Builder) each w/ MockDashboard variant or icon visual + 3 mono bullets. `PillarBento`/bento of detectors. `AiSourceBeam` integrations. `StatBand`. `Faq`. `CtaBand`.
- [ ] **Step 2:** `buildMetadata` (real description, not "placeholder"), breadcrumb, speakable lede. Strategy Engine/Insights use "capability" framing (guardrail).
- [ ] **Step 3:** Verify build + render. Commit `feat: features page`.

### Task 2.3: Pricing (`app/(marketing)/pricing/page.tsx`)
- [ ] **Step 1:** Hero. Four tier cards (Basic/Plus/Premium/Enterprise), card-spotlight on recommended (Premium), each with differentiators (active-prompt cap, monthly AI-response cap, seats, # engines/competitors, GA4) and "Talk to us" → bookingUrl. NO prices. Comparison table (shadcn). `Faq` (pricing FAQs → faqPageSchema). `CtaBand`.
- [ ] **Step 2:** `buildMetadata`, breadcrumb, speakable lede. Commit `feat: pricing page`.

### Task 2.4: About (`app/(marketing)/about/page.tsx`)
- [ ] **Step 1:** Mission hero + `data-speakable` lede. "How Otis works"/methodology section ("the wording is generated, the evidence is not"). Approach/values. Subtle grid. `CtaBand`.
- [ ] **Step 2:** `buildMetadata` real desc, breadcrumb. Commit `feat: about page`.

### Task 2.5: Contact (`app/(marketing)/contact/page.tsx`)
- [ ] **Step 1:** Two-column: copy + booking embed. Implement booking as a Cal.com/Calendly `<iframe>` to `bookingUrl` marked `data-lenis-prevent`, OR a request-a-demo form (name/email/company/message) that `mailto:`-composes or posts to a placeholder action (since no backend) — DEFAULT: booking iframe + email fallback line. Render `breadcrumbSchema` + `localBusinessSchema`.
- [ ] **Step 2:** `buildMetadata`. Verify embed scroll-isolated. Commit `feat: contact page`.

### Task 2.6: Blog polish + content (`blog/page.tsx`, `blog/[slug]/page.tsx`, `content/blog/*`)
- [ ] **Step 1:** Index: card grid + light hover reveals + empty state kept. Post: ensure `.prose-like` now styles body; keep breadcrumb + article schema + speakable lede.
- [ ] **Step 2:** Remove `hello-world.mdx`; add 2–3 real posts (frontmatter: title/description/date/author/tags): "What is Answer Engine Optimization (AEO)?", "How AI assistants decide which brands to recommend", "Share of Voice in AI search: a primer". Real, useful, on-vocabulary copy.
- [ ] **Step 3:** Verify `/blog` + a post render; sitemap picks up posts. Commit `feat: blog polish + seed posts`.

---

## WAVE 3 — Brand-output + AEO assets

### Task 3.1: `/api/og` brand + `llms.txt` rewrite
**Files:** Modify `app/api/og/route.tsx`, `public/llms.txt`, `public/llms-full.txt`.
- [ ] **Step 1:** Rebrand OG generator: cream bg, charcoal text, purple glyph, Bricolage-ish (load font or use system fallback), title/subtitle params.
- [ ] **Step 2:** Write real `llms.txt` (concise: what Heyotis is, key pages, contact) + `llms-full.txt` (full prose: positioning, the 5 pillars, features, engines, vocabulary) — dogfood the AEO stack, accurate to guardrails.
- [ ] **Step 3:** Verify `/api/og?title=Test` renders; commit `feat: brand OG generator + real llms.txt`.

---

## WAVE 4 — Verify & polish

### Task 4.1: Full verification sweep
- [ ] **Step 1:** `pnpm typecheck` → PASS (zero errors).
- [ ] **Step 2:** `pnpm lint` → PASS (fix all).
- [ ] **Step 3:** `pnpm build` → PASS (note any RSC/client boundary or dynamic-import warnings; fix).
- [ ] **Step 4:** Dead-link audit: grep all `href=` in components/pages; every internal href ∈ {/, /features, /pricing, /about, /contact, /blog, /blog/[slug]} or external/mailto. Zero 404s.
- [ ] **Step 5:** Asset audit: `/logo.png`, `/opengraph-image.png`, `/icon.png`, `/icon-512.png` exist; `schema.ts` + manifest references resolve.
- [ ] **Step 6:** Claim audit: grep for engine names — no Meta/Mistral/Grok/Cohere as monitored; only ChatGPT/Gemini/Perplexity. No "SEO" as our category.
- [ ] **Step 7:** A11y/motion: load with `prefers-reduced-motion: reduce` — Lenis off, no auto-rotate/parallax; tab through nav/tabs/accordion/forms; visible focus.
- [ ] **Step 8:** Commit any fixes `fix: verification sweep`.

### Task 4.2: Final review pass (adversarial)
- [ ] **Step 1:** Re-read spec §1–§8; confirm every punch-list item done; fix gaps.
- [ ] **Step 2:** Lighthouse-style sanity (LCP element is hero heading/image; no large CLS; bundle not bloated by eager heavy effects).
- [ ] **Step 3:** Commit; summarize what shipped + remaining user TODOs (bookingUrl, domain, real assets).

---

## Self-Review (author checklist — completed)

**Spec coverage:** every spec §7 page → a Wave-2 task; every §8 punch-list item → a task (tokens 0.3, site.ts 0.5, footer 1.4, LogoStrip 1.5/2.1, prose-like 0.3, SearchAction 0.4, assets 0.6, llms 3.1, sitemap 0.4, single dark 0.3/0.4, type scale 0.3, orphans deleted in File Structure, turbopack 0.1, schema/speakable in each page task). ✓
**Placeholders:** none — open product items (bookingUrl, domain, real proof) are explicitly flagged as user TODOs, not plan gaps. ✓
**Type consistency:** component prop names in Shared Contracts are the single definition consumed by Wave-2 tasks (BookCta, Section, Faq.faqItemsToSchema, StatBand.Stat, FeatureTabs.FeatureTab). ✓
