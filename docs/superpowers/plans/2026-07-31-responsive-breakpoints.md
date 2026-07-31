# Responsive Breakpoint System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the site one documented breakpoint ladder, enforced by shared primitives, and make 1280px+ displays use their width without degrading reading columns.

**Architecture:** `Container` owns shell width and gains a `reading` variant so long-form pages never widen. `Section` owns vertical rhythm. A `--container-shell` theme token supplies the 1440px cap. Existing components are conformed only where they are actually wrong — this is not a full sweep.

**Tech Stack:** Next.js 16.2.6 (App Router, RSC), Tailwind CSS v4 (CSS-first `@theme` config, no `tailwind.config.js`), React 19.2.4, `tailwind-merge` via `cn()` in `lib/utils.ts`.

## Global Constraints

- Tailwind v4 default breakpoint pixel values do not change: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.
- **The ladder:** base = phone/single column; `sm` = inline runs and 2-up compact items; `md` = 1→2 col for anything containing prose, first padding step, 3-up starts here; `lg` = nav switches, 2→3 col; `xl` = shell widens 1152→1280, 3→4 col where earned; `2xl` = shell caps at 1440, final type/space step, nothing structural.
- **The `sm` carve-out:** 2-up is allowed at `sm` for compact items. 3-up is not, ever. A "compact item" is a card, tile, or link whose content is a heading plus at most a short supporting line.
- **The "content earns it" test:** a grid may go 4-up at `xl` only if its item count is divisible by 4, or the list is genuinely open-ended. A 3-item grid never becomes 4.
- Base (mobile) styles are not to be changed by this work. Any diff that alters rendering below 640px is a regression unless the task explicitly calls for it.
- **This repo has no test framework.** Verification is `pnpm lint`, `pnpm typecheck`, grep-based structural assertions per task, and a batched visual pass on Vercel preview (Task 8).
- **`pnpm dev` and `pnpm build` must NOT be run on this machine.** The 8GB M1 Air kernel-panicked three times under that load on 2026-07-30. `pnpm lint` and `pnpm typecheck` are safe.
- All work happens on a branch off `main`. Do not commit to `main`.

---

## File Structure

| File | Responsibility | Change |
| --- | --- | --- |
| `app/globals.css` | Theme tokens, type scale utilities | Modify — add `--container-shell`, add `2xl:` steps to `.display-xl` / `.display-lg` |
| `components/marketing/Container.tsx` | Shell width + horizontal gutters. Sole owner of page-level `max-w-*`. | Modify — add `width` prop |
| `components/marketing/primitives/Section.tsx` | Section vertical rhythm; forwards `width` to `Container` | Modify |
| `components/marketing/Nav.tsx` | Nav bar; its guide rail must track `Container` | Modify — align rail |
| `app/(marketing)/blog/[slug]/page.tsx` | Blog post | Modify — `width="reading"` |
| `app/(marketing)/case-studies/[slug]/page.tsx` | Case study | Modify — `width="reading"` |
| `app/(marketing)/privacy/page.tsx` | Legal | Modify — `width="reading"`, padding |
| `app/(marketing)/terms/page.tsx` | Legal | Modify — `width="reading"`, padding |
| `app/(marketing)/blog/page.tsx` | Post index | Modify — 4-up at `xl` |
| `app/(marketing)/case-studies/page.tsx` | Study index | Modify — 4-up at `xl` |
| `app/(marketing)/guides/page.tsx` | Guide index | Modify — 4-up at `xl` |
| `app/(marketing)/report/page.tsx` | Report page | Modify — 3-up `sm`→`md` |
| `app/(marketing)/pricing/page.tsx` | Pricing | Modify — padding |
| `components/marketing/sections/EvidenceLadder.tsx` | Evidence stat row | Modify — 3-up `sm`→`md` |
| `components/marketing/visuals/LoopVignettes.tsx` | Loop panel visuals | Modify — 3-up `sm`→`md` ×8 |
| `components/marketing/sections/CompoundingBand.tsx` | Section | Modify — inherit rhythm |
| `components/marketing/sections/ReportBand.tsx` | Thin band | Modify — `2xl:` step |
| `components/marketing/sections/ClientLogos.tsx` | Thin band | Modify — `2xl:` step |
| `AGENTS.md` | Project conventions | Modify — record the doctrine |

**Not created:** a `Prose` primitive. The spec called for one, but prose is already capped everywhere — `SectionHeading` caps its `sub` at `max-w-2xl`, `.prose-like` sets `max-width: 68ch`, and every apparently-uncapped `<p>` sits inside an `mx-auto max-w-2xl` wrapper. A primitive with zero call sites is dead code. Its intended job — stopping a wider shell from stretching reading columns — is done by `Container`'s `reading` variant in Task 1.

---

### Task 1: Shell widening + reading variant

The foundation. Everything else depends on `Container`'s new API.

**Files:**
- Modify: `app/globals.css` (add `@theme` block after the `:root` block ending line 95)
- Modify: `components/marketing/Container.tsx` (whole file)
- Modify: `components/marketing/primitives/Section.tsx:4-43`

**Interfaces:**
- Consumes: nothing.
- Produces: `Container` accepts `width?: "default" | "reading"`, defaulting to `"default"`. `Section` accepts the same `width` prop and forwards it to `Container`. Later tasks call `<Container width="reading">` and `<Section width="reading">`.

- [ ] **Step 1: Add the shell token**

In `app/globals.css`, immediately after the `:root { … }` block that ends at line 95 (the line after `--radius: 0.375rem;`), and before the existing `@theme inline {` on line 97, insert:

```css
/* 90rem = 1440px. The widest the marketing shell ever goes; only
   reached at 2xl. Tailwind's --container-* namespace generates
   max-w-shell from this. */
@theme {
  --container-shell: 90rem;
}
```

This is a plain `@theme`, not `@theme inline` — the value is a literal, not a reference to another custom property.

- [ ] **Step 2: Verify the token generates the utility**

Run:

```bash
grep -n "container-shell" app/globals.css
```

Expected: one hit showing `--container-shell: 90rem;`.

Tailwind v4 generates `max-w-shell` from the `--container-*` namespace — the same mechanism that produces `max-w-6xl` from `--container-6xl: 72rem` in `node_modules/tailwindcss/theme.css:344`. No config file change is needed.

- [ ] **Step 3: Rewrite Container with the width variant**

Replace the entire contents of `components/marketing/Container.tsx`:

```tsx
import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * `default` widens on large displays: 1152 -> 1280 at xl -> 1440 at 2xl.
   * `reading` stays at 768 and never widens. Long-form pages use it so a
   * 68ch prose column is not stranded as a ribbon in a wide shell.
   */
  width?: "default" | "reading";
};

/* Container is the sole owner of page-level max-width. Components should
   not set their own shell width - pass `width` or wrap in a Section. */
const widthClass = {
  default: "max-w-6xl xl:max-w-7xl 2xl:max-w-shell",
  reading: "max-w-3xl",
} as const;

export function Container({
  className,
  width = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12",
        widthClass[width],
        className,
      )}
      {...props}
    />
  );
}
```

Two things to understand here:

`xl:px-12` is new. Without it, content sits 32px from the viewport edge on a 1920px display, which looks unfinished once the shell is wide.

`reading` is `max-w-3xl` (48rem / 768px), matching what `blog/[slug]` and `case-studies/[slug]` already hand-roll. It deliberately has **no** `xl:`/`2xl:` variant. This matters: `twMerge` resolves `max-w-3xl` against `max-w-6xl` because both are base-variant, but it will **not** override `xl:max-w-7xl` — different variant, no conflict detected. So a `className="max-w-3xl"` override cannot stop the widening. Only the variant can.

- [ ] **Step 4: Forward `width` through Section**

In `components/marketing/primitives/Section.tsx`, add `width` to the props type and forward it. Change the `SectionProps` type (lines 4-12) to:

```tsx
type SectionProps = {
  surface?: "cream" | "card" | "dark";
  className?: string;
  containerClassName?: string;
  id?: string;
  /** Skip the centered Container wrapper (for full-bleed content). */
  bleed?: boolean;
  /** Forwarded to Container. `reading` keeps long-form pages narrow. */
  width?: "default" | "reading";
  children: React.ReactNode;
};
```

Change the function signature and the `Container` call (lines 23-43) to:

```tsx
export function Section({
  surface = "cream",
  className,
  containerClassName,
  id,
  bleed = false,
  width = "default",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-28", surfaceClass[surface], className)}
    >
      {bleed ? (
        children
      ) : (
        <Container width={width} className={containerClassName}>
          {children}
        </Container>
      )}
    </section>
  );
}
```

Leave the `py-20 md:py-28` alone for now — Task 3 owns vertical rhythm.

- [ ] **Step 5: Verify structure and types**

Run:

```bash
grep -n "max-w-shell\|xl:px-12\|reading" components/marketing/Container.tsx
grep -n "width" components/marketing/primitives/Section.tsx
pnpm typecheck
pnpm lint
```

Expected: Container shows `max-w-6xl xl:max-w-7xl 2xl:max-w-shell`, `max-w-3xl`, and `xl:px-12`. Section shows the `width` prop declared, defaulted, and passed to `Container`. `typecheck` and `lint` both exit 0.

Do **not** run `pnpm build` or `pnpm dev` — see Global Constraints.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css components/marketing/Container.tsx components/marketing/primitives/Section.tsx
git commit -m "feat(layout): widen the shell at xl/2xl, add a reading width

Container gains a width variant. `default` grows 1152 -> 1280 -> 1440
so large displays stop wasting 384px of margin each side. `reading`
stays at 768 for long-form pages.

The variant is load-bearing rather than cosmetic: twMerge cannot
resolve a base-variant max-w-3xl override against xl:max-w-7xl, so a
className override would not have stopped article pages from widening.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Opt long-form pages into the reading width

Without this, Task 1 is a regression on four pages: blog posts, case studies, privacy and terms would all widen at `xl` while their prose stays at 68ch.

**Files:**
- Modify: `app/(marketing)/blog/[slug]/page.tsx:91`
- Modify: `app/(marketing)/case-studies/[slug]/page.tsx:91`
- Modify: `app/(marketing)/privacy/page.tsx:44` and `:66`
- Modify: `app/(marketing)/terms/page.tsx:44` and `:66`

**Interfaces:**
- Consumes: `Container`'s `width` prop from Task 1.
- Produces: nothing later tasks depend on.

- [ ] **Step 1: Confirm the problem exists before fixing it**

Run:

```bash
grep -rn 'Container className="max-w-3xl"' "app/(marketing)/blog/[slug]/page.tsx" "app/(marketing)/case-studies/[slug]/page.tsx"
grep -n "<Container>" "app/(marketing)/privacy/page.tsx" "app/(marketing)/terms/page.tsx"
```

Expected: two hits for the hand-rolled `max-w-3xl` override, four hits for the bare `<Container>` on the legal pages. All six would widen at `xl` after Task 1.

- [ ] **Step 2: Convert the article pages**

In `app/(marketing)/blog/[slug]/page.tsx` line 91, replace:

```tsx
      <Container className="max-w-3xl">
```

with:

```tsx
      <Container width="reading">
```

In `app/(marketing)/case-studies/[slug]/page.tsx` line 91, replace:

```tsx
        <Container className="max-w-3xl">
```

with:

```tsx
        <Container width="reading">
```

The `className` goes away entirely — `reading` already resolves to `max-w-3xl`, so keeping both would be duplicated intent that drifts apart later.

- [ ] **Step 3: Convert the legal pages**

In both `app/(marketing)/privacy/page.tsx` and `app/(marketing)/terms/page.tsx`, replace **both** occurrences of:

```tsx
        <Container>
```

with:

```tsx
        <Container width="reading">
```

There are two per file: the header section (line 44) and the body section (line 66). Both must change — a 768px body under a 1152px header would look misaligned.

This narrows the legal pages' shell from 1152px to 768px at all widths, which is a deliberate improvement: their content is a single `.prose-like` column capped at 68ch, so the extra 384px was never doing anything.

- [ ] **Step 4: Verify no long-form page can widen**

Run:

```bash
grep -rn 'width="reading"' "app/(marketing)/blog/[slug]/page.tsx" "app/(marketing)/case-studies/[slug]/page.tsx" "app/(marketing)/privacy/page.tsx" "app/(marketing)/terms/page.tsx"
grep -rn 'max-w-3xl' "app/(marketing)/blog/[slug]/page.tsx" "app/(marketing)/case-studies/[slug]/page.tsx"
pnpm typecheck && pnpm lint
```

Expected: six `width="reading"` hits (1 + 1 + 2 + 2). The second grep must return **no** `<Container className="max-w-3xl">` — a remaining `max-w-3xl` on an inner `<h1>` or `<p>` is fine and expected. `typecheck` and `lint` exit 0.

- [ ] **Step 5: Commit**

```bash
git add "app/(marketing)/blog/[slug]/page.tsx" "app/(marketing)/case-studies/[slug]/page.tsx" "app/(marketing)/privacy/page.tsx" "app/(marketing)/terms/page.tsx"
git commit -m "fix(layout): keep long-form pages at reading width

Blog posts, case studies, privacy and terms opt into Container's
reading variant. Without this they inherit the xl/2xl widening while
their prose stays capped at 68ch, stranding a narrow ribbon in a
1440px shell.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Align the nav guide rail

**Files:**
- Modify: `components/marketing/Nav.tsx:332-336`

**Interfaces:**
- Consumes: `Container`'s width classes from Task 1 (duplicated as literals here, not imported — see Step 2).
- Produces: nothing.

- [ ] **Step 1: See the current misalignment**

Run:

```bash
sed -n '332,337p' components/marketing/Nav.tsx
```

Expected: a dashed rail at `max-w-7xl` and, directly below, the nav bar at `max-w-6xl`. The rail is 1280px wide against 1152px of content — 64px adrift on each side today.

- [ ] **Step 2: Match both to the Container ladder**

Replace lines 332-336 with:

```tsx
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-full max-w-6xl -translate-x-1/2 border-x border-dashed border-border/50 xl:block xl:max-w-7xl 2xl:max-w-shell"
        />
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 xl:max-w-7xl xl:border-x xl:border-border/70 xl:px-12 2xl:max-w-shell">
```

Both elements now carry the same width ladder as `Container` — `max-w-6xl xl:max-w-7xl 2xl:max-w-shell` — and the bar picks up the matching `xl:px-12` gutter.

These are literal classes rather than a `Container` import on purpose: the nav bar is a flex row with a fixed `h-16` and its own border treatment, so wrapping it in `Container` would mean threading several unrelated props through. Duplicating three classes is the smaller cost. The doctrine in Task 7 records that `Nav` is the one sanctioned exception to "Container owns width".

- [ ] **Step 3: Verify the rail and bar agree**

Run:

```bash
grep -n "max-w-6xl xl:max-w-7xl 2xl:max-w-shell\|xl:max-w-7xl" components/marketing/Nav.tsx
pnpm typecheck && pnpm lint
```

Expected: both the rail and the bar carry `xl:max-w-7xl` and `2xl:max-w-shell`. No `max-w-7xl` remains as a base-variant class. `typecheck` and `lint` exit 0.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/Nav.tsx
git commit -m "fix(nav): track the container ladder with the guide rail

The dashed rail was max-w-7xl against a max-w-6xl bar, sitting 64px
adrift each side. Both now carry the same width ladder as Container.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Section vertical rhythm

**Files:**
- Modify: `components/marketing/primitives/Section.tsx:34`
- Modify: `app/(marketing)/privacy/page.tsx:110`
- Modify: `app/(marketing)/terms/page.tsx:65`
- Modify: `app/(marketing)/pricing/page.tsx:207` and `:220`
- Modify: `components/marketing/sections/CompoundingBand.tsx:12`
- Modify: `components/marketing/sections/ReportBand.tsx:12`
- Modify: `components/marketing/sections/ClientLogos.tsx:30`

**Interfaces:**
- Consumes: `Section` from Task 1.
- Produces: `Section`'s default rhythm becomes `py-20 md:py-28 2xl:py-36`.

- [ ] **Step 1: Add the 2xl step to the primitive**

In `components/marketing/primitives/Section.tsx` line 34, replace:

```tsx
      className={cn("relative py-20 md:py-28", surfaceClass[surface], className)}
```

with:

```tsx
      className={cn(
        "relative py-20 md:py-28 2xl:py-36",
        surfaceClass[surface],
        className,
      )}
```

Base stays `py-20` deliberately. Changing it would churn mobile, which this work is not for.

- [ ] **Step 2: Drop the overrides on full sections**

These four sections override the rhythm for no reason. Delete the padding classes so they inherit.

`app/(marketing)/pricing/page.tsx:207` — replace:

```tsx
      <Section surface="cream" id="managed" className="py-14 md:py-20">
```

with:

```tsx
      <Section surface="cream" id="managed">
```

`app/(marketing)/pricing/page.tsx:220` — replace:

```tsx
      <Section surface="card" id="agencies" className="py-14 md:py-20">
```

with:

```tsx
      <Section surface="card" id="agencies">
```

`components/marketing/sections/CompoundingBand.tsx:12` — replace:

```tsx
    <Section id="compounds" surface="cream" className="py-14 md:py-16">
```

with:

```tsx
    <Section id="compounds" surface="cream">
```

The legal pages use raw `<section>` rather than the primitive, so they get the ladder written out. `app/(marketing)/privacy/page.tsx:110` and `app/(marketing)/terms/page.tsx:65` — replace, in both files:

```tsx
      <section className="surface-cream border-t border-border py-16 md:py-20">
```

with:

```tsx
      <section className="surface-cream border-t border-border py-20 md:py-28 2xl:py-36">
```

- [ ] **Step 3: Give the thin bands a proportional 2xl step**

`ReportBand` and `ClientLogos` are deliberately tighter than full sections — they are thin bands, not content sections. Flattening them onto the default rhythm would be conformance for its own sake. They keep their scale and gain a proportional step.

`components/marketing/sections/ReportBand.tsx:12` — replace:

```tsx
    <Section surface="card" className="py-10 md:py-12">
```

with:

```tsx
    <Section surface="card" className="py-10 md:py-12 2xl:py-16">
```

`components/marketing/sections/ClientLogos.tsx:30` — replace:

```tsx
    <section className="surface-card border-y border-border py-10 md:py-12">
```

with:

```tsx
    <section className="surface-card border-y border-border py-10 md:py-12 2xl:py-16">
```

- [ ] **Step 4: Confirm card padding was left alone**

These six are card and panel padding, not section rhythm. They must be unchanged.

Run:

```bash
grep -n "py-10" components/marketing/Nav.tsx components/marketing/sections/HeroLoopTabs.tsx
grep -n "py-12\|py-10" components/marketing/sections/CaseStudyDaylyte.tsx components/marketing/sections/PillarSections.tsx
grep -n "py-32" app/not-found.tsx
```

Expected: `Nav.tsx:52`, `HeroLoopTabs.tsx:269`, `CaseStudyDaylyte.tsx:248` and `:265`, `PillarSections.tsx:519`, `not-found.tsx:35` all still present and untouched.

- [ ] **Step 5: Verify the rhythm**

Run:

```bash
grep -n "2xl:py-36" components/marketing/primitives/Section.tsx "app/(marketing)/privacy/page.tsx" "app/(marketing)/terms/page.tsx"
grep -rn 'className="py-14' "app/(marketing)/pricing/page.tsx" components/marketing/sections/CompoundingBand.tsx
pnpm typecheck && pnpm lint
```

Expected: three `2xl:py-36` hits from the first grep. The second grep returns **nothing** — all `py-14` section overrides are gone. `typecheck` and `lint` exit 0.

- [ ] **Step 6: Commit**

```bash
git add components/marketing/primitives/Section.tsx "app/(marketing)/privacy/page.tsx" "app/(marketing)/terms/page.tsx" "app/(marketing)/pricing/page.tsx" components/marketing/sections/CompoundingBand.tsx components/marketing/sections/ReportBand.tsx components/marketing/sections/ClientLogos.tsx
git commit -m "feat(layout): give sections a 2xl rhythm step

Section gains 2xl:py-36. Four sections that overrode the rhythm for
no reason now inherit it. Thin bands (ReportBand, ClientLogos) keep
their deliberately tighter scale and get a proportional step instead.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Type scale at 2xl

**Files:**
- Modify: `app/globals.css:260-261`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

- [ ] **Step 1: Add the 2xl steps**

In `app/globals.css`, replace lines 260-261:

```css
  .display-xl { @apply font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]; }
  .display-lg { @apply font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl; }
```

with:

```css
  .display-xl { @apply font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] 2xl:text-[6.5rem]; }
  .display-lg { @apply font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl; }
```

Only these two change. `.display-md` and `.display-sm` are section headings rather than page headings — scaling them would make body sections shout. `.display-hero` already uses `clamp(2.2rem, 4vw, 3.4rem)` and needs nothing.

- [ ] **Step 2: Verify**

Run:

```bash
grep -n "display-xl\|display-lg\|display-md\|display-sm" app/globals.css
pnpm lint
```

Expected: `.display-xl` ends `2xl:text-[6.5rem]`, `.display-lg` ends `2xl:text-8xl`, and `.display-md` / `.display-sm` are unchanged. `lint` exits 0.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(type): add a 2xl step to the page-heading scale

display-xl and display-lg would otherwise look undersized in a 1440px
shell. Section headings (display-md/sm) deliberately unchanged.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Fourth column at xl

**Files:**
- Modify: `app/(marketing)/blog/page.tsx:71`
- Modify: `app/(marketing)/case-studies/page.tsx:55`
- Modify: `app/(marketing)/guides/page.tsx:69`

**Interfaces:**
- Consumes: the widened shell from Task 1 (a 4th column needs 1280px to be worth having).
- Produces: nothing.

- [ ] **Step 1: Add the column to the three open-ended lists**

All three currently read `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`. In each, replace that with:

```
grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

`app/(marketing)/blog/page.tsx:71`:

```tsx
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

`app/(marketing)/case-studies/page.tsx:55`:

```tsx
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

`app/(marketing)/guides/page.tsx:69`:

```tsx
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
```

These qualify under the "content earns it" test because all three render from a directory walk — the item count is open-ended, so no fixed count can be orphaned.

- [ ] **Step 2: Confirm the excluded grids were not touched**

Four grids must NOT gain a fourth column. Run:

```bash
grep -n "grid-cols" "app/(marketing)/pricing/page.tsx" components/marketing/sections/MaturityLevels.tsx "app/(marketing)/about/page.tsx" components/marketing/visuals/LoopBento.tsx | grep "xl:grid-cols-4"
```

Expected: **no output.** Specifically:
- `pricing/page.tsx:153` has exactly 3 tiers — a 4th column orphans the row.
- `MaturityLevels.tsx:12` and `about/page.tsx:226` are already 4-up at `lg`.
- `LoopBento.tsx:283` is a bento layout whose `lg:grid-cols-3` is load-bearing for its span arithmetic; a 4th column breaks it rather than widening it.

- [ ] **Step 3: Verify**

Run:

```bash
grep -rn "xl:grid-cols-4" app components
pnpm typecheck && pnpm lint
```

Expected: exactly three hits — `blog/page.tsx`, `case-studies/page.tsx`, `guides/page.tsx`. `typecheck` and `lint` exit 0.

- [ ] **Step 4: Commit**

```bash
git add "app/(marketing)/blog/page.tsx" "app/(marketing)/case-studies/page.tsx" "app/(marketing)/guides/page.tsx"
git commit -m "feat(layout): fourth column at xl for open-ended card lists

Blog, case studies and guides render from a directory walk, so no
fixed item count can be orphaned. Pricing (exactly 3 tiers) and the
bento grid are deliberately excluded.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Move 3-up grids from sm to md

The `sm` carve-out, applied. 3-up at 640px is roughly 213px per column — below the useful minimum for anything containing prose.

**Files:**
- Modify: `components/marketing/visuals/LoopVignettes.tsx` lines 497, 533, 826, 862, 1234, 1270, 1662, 1698
- Modify: `app/(marketing)/report/page.tsx:160`
- Modify: `components/marketing/sections/EvidenceLadder.tsx:87-88`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

- [ ] **Step 1: Fix LoopVignettes — eight identical rewrites**

All eight lines carry the same pattern. Four of them (497, 826, 1234, 1662) read:

```tsx
        <div className="grid gap-6 pb-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
```

Replace each with:

```tsx
        <div className="grid gap-6 pb-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-dashed md:divide-border">
```

The other four (533, 862, 1270, 1698) read:

```tsx
        <div className="grid gap-6 border-t border-dashed border-border pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
```

Replace each with:

```tsx
        <div className="grid gap-6 border-t border-dashed border-border pt-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-dashed md:divide-border">
```

Every `sm:` in these classes moves to `md:` together. They are one coupled decision: `sm:gap-0` and `sm:divide-*` only make sense once the columns exist, so leaving any of them at `sm` produces a single-column list with zero gap and stray dividers between 640 and 767px.

- [ ] **Step 2: Fix the sibling padding in LoopVignettes**

The column padding is part of the same pattern and must move with it. Run:

```bash
grep -n "sm:pr-6\|sm:pl-6" components/marketing/visuals/LoopVignettes.tsx
```

For each hit, change `sm:pr-6` to `md:pr-6` and `sm:pl-6` to `md:pl-6`. These are the inner column paddings that pair with the `divide-x` rules — at 640-767px they would indent a single-column stack for no reason.

Leave every other `sm:` in the file alone. `sm:px-6`, `sm:px-8`, `sm:text-sm` and `sm:col-span-2` are independent of the 3-up decision.

- [ ] **Step 3: Fix report and EvidenceLadder**

`app/(marketing)/report/page.tsx:160` — replace:

```tsx
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
```

with:

```tsx
        <div className="mt-12 grid gap-5 md:grid-cols-3">
```

`components/marketing/sections/EvidenceLadder.tsx:87-88` — this one already carries a comment admitting the problem. Replace:

```tsx
      {/* Stack below sm - three columns truncate the longer source domains. */}
      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
```

with:

```tsx
      {/* Stack below md - three columns truncate the longer source domains. */}
      <dl className="mt-6 grid gap-3 md:grid-cols-3">
```

Update the comment as shown — a comment saying `sm` above an `md:` class is worse than no comment.

- [ ] **Step 4: Verify no 3-up remains at sm**

Run:

```bash
grep -rn "sm:grid-cols-3" app components
```

Expected: **no output.** This is the task's acceptance criterion.

Then confirm the coupled classes moved together:

```bash
grep -c "md:grid-cols-3" components/marketing/visuals/LoopVignettes.tsx
grep -n "sm:gap-0\|sm:divide-\|sm:pr-6\|sm:pl-6" components/marketing/visuals/LoopVignettes.tsx
```

Expected: `8` from the first command, **no output** from the second.

- [ ] **Step 5: Confirm the deliberate exclusions**

Run:

```bash
grep -n "grid-cols-2" components/marketing/sections/AnswerReel.tsx
grep -n "sm:grid-cols-4" components/marketing/visuals/MockDashboard.tsx
```

Expected: `AnswerReel.tsx:168` still `grid-cols-2` — that is base-variant 2-up on short chips inside a card, which is correct and out of scope. `MockDashboard.tsx:127` and `:309` still `sm:grid-cols-4` — see the note in Task 9.

- [ ] **Step 6: Verify and commit**

```bash
pnpm typecheck && pnpm lint
git add components/marketing/visuals/LoopVignettes.tsx "app/(marketing)/report/page.tsx" components/marketing/sections/EvidenceLadder.tsx
git commit -m "fix(layout): move 3-up grids from sm to md

Three columns at 640px is ~213px each, below the useful minimum for
anything containing prose. The coupled gap/divide/padding classes move
with the column count so the 640-767px band does not get stray
dividers on a single-column stack.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Record the doctrine in AGENTS.md

Without this the convention lives only in a spec nobody reads, and the next component is a fresh guess again.

**Files:**
- Modify: `AGENTS.md` (Conventions section)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing.

- [ ] **Step 1: Append to the Conventions section**

In `AGENTS.md`, add the following at the end of the `## Conventions` bullet list, before the `## Commands` heading:

```markdown
### Responsive breakpoints

Tailwind v4 defaults; no custom pixel values. Each breakpoint has one job:

| BP | px | Job |
| --- | --- | --- |
| base | <640 | Phone. Single column. The starting point, never a fallback. |
| `sm` | 640 | Inline runs — buttons side-by-side, meta rows, stat pairs. 2-up compact items. |
| `md` | 768 | First layout shift. 1→2 col for anything containing prose. First padding step. 3-up starts here. |
| `lg` | 1024 | Desktop. Nav switches. 2→3 col. Split heroes, sidebars. |
| `xl` | 1280 | Shell widens 1152→1280. 3→4 col where content earns it. |
| `2xl` | 1536 | Shell caps at 1440. Final type/space step. Nothing structural. |

- **2-up is allowed at `sm`. 3-up is not, ever.** A "compact item" is a card,
  tile or link that is a heading plus at most a short supporting line. Anything
  with a paragraph, image or metadata row waits for `md`.
- **4-up at `xl` needs earning:** item count divisible by 4, or a genuinely
  open-ended list. A 3-item grid never becomes 4 — it orphans a row.
- **`Container` is the sole owner of page-level `max-width`.** Never set a shell
  width on a section or page. Use `width="reading"` (768px, never widens) for
  long-form pages. `Nav.tsx` is the one sanctioned exception — its bar is a
  fixed-height flex row with its own borders, so it repeats the width ladder
  literally.
- **`Section` owns vertical rhythm** (`py-20 md:py-28 2xl:py-36`). Override only
  for thin bands, and keep the override proportional across all three steps.
- Prose is capped by `SectionHeading`'s `sub` (`max-w-2xl`) and `.prose-like`
  (`68ch`). Keep new reading columns at one of those two.
- Breakpoint variants respond to **viewport** width, not container width. For a
  component nested inside a narrow wrapper, reach for `@container` queries
  instead.
```

- [ ] **Step 2: Verify**

Run:

```bash
grep -n "Responsive breakpoints\|2-up is allowed" AGENTS.md
pnpm lint
```

Expected: both strings present, `lint` exits 0.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: record the breakpoint doctrine in AGENTS.md

Puts the ladder, the sm carve-out and the Container ownership rule
where future work will actually read them.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Visual verification on Vercel preview

The only task that can catch what grep cannot: overflow, orphaned rows, broken rhythm.

**Files:** none — this is a verification pass. Any defect found becomes a fix commit on the same branch.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: a pass/fail report.

- [ ] **Step 1: Push the branch**

```bash
git push -u origin HEAD
```

Wait for the Vercel preview deployment. Do **not** run `pnpm build` locally — see Global Constraints.

- [ ] **Step 2: Capture each width**

Open the preview URL in Chrome and capture at these widths: **640, 768, 1024, 1280, 1440, 1920**.

Pages: `/`, `/pricing`, `/blog`, `/case-studies`, `/strategy`, and one blog post.

Two capture constraints, both previously established the hard way:

- **Do not attempt 375px.** Chrome clamps around 500px, and sub-500 captures manufacture overflow bugs that do not exist on real devices. Phone width needs a real device or DevTools emulation.
- **Use real wall-clock captures.** This site uses `motion`; a `--virtual-time-budget` capture freezes animations and returns blank `AnimatePresence` children, which reads as a layout bug when it is a capture artifact. Also confirm the tab is foregrounded — a background tab gets zero `rAF` and animations stall at their initial frame.

- [ ] **Step 3: Check each capture against this list**

For every width and page:

1. No horizontal scrollbar. `document.documentElement.scrollWidth <= window.innerWidth`.
2. No orphaned grid rows — a final row with one item in a 3- or 4-col grid.
3. Reading columns still capped: body copy never exceeds roughly 70 characters per line at 1440 or 1920.
4. Section rhythm consistent — adjacent sections have visually equal vertical padding, except the deliberately tighter `ReportBand` and `ClientLogos`.
5. At 1280 and above, the nav's dashed guide rail lines up exactly with the content edges.
6. Blog posts, case studies, privacy and terms stay narrow at 1440 and 1920 — they must **not** widen.
7. `LoopVignettes` panels at 640-767px are a clean single-column stack with normal gaps and no stray vertical dividers.

- [ ] **Step 4: Report**

State plainly which widths and pages were checked, which passed, and what failed. If 375px was not verified, say so explicitly rather than implying full coverage.

Fix any defect on this branch and re-verify the affected width before claiming the task complete.

- [ ] **Step 5: Open the PR**

The GitHub remote needs a specific account — the default is not a collaborator:

```bash
gh auth switch --user ashcochrane-otis
gh pr create --title "Responsive breakpoint system" --body "$(cat <<'EOF'
## Summary

Gives the site one documented breakpoint ladder and makes 1280px+ displays
use their width. Implements `docs/superpowers/specs/2026-07-31-responsive-breakpoints-design.md`.

- `Container` gains a `width` variant: `default` grows 1152 → 1280 @xl → 1440 @2xl, `reading` stays at 768
- Long-form pages (blog, case studies, privacy, terms) opt into `reading`
- Nav guide rail now tracks the container ladder instead of sitting 64px adrift
- `Section` gains a `2xl:py-36` step; four gratuitous padding overrides removed
- `display-xl` / `display-lg` gain a `2xl:` step
- Blog, case-study and guide indexes go 4-up at `xl`
- 3-up grids move from `sm` to `md` (213px columns at 640px)
- Doctrine recorded in `AGENTS.md`

## Deviations from the spec

The spec's `Prose` primitive was dropped. Prose is already capped everywhere
(`SectionHeading` sub at `max-w-2xl`, `.prose-like` at 68ch), so it would have
had zero call sites. Its intended job is done by `Container`'s `reading`
variant, which also fixes a problem the spec missed: `twMerge` cannot resolve a
base-variant `max-w-3xl` override against `xl:max-w-7xl`, so article pages
would have widened silently.

## Verification

Vercel preview at 640 / 768 / 1024 / 1280 / 1440 / 1920. `pnpm lint` and
`pnpm typecheck` pass. 375px not covered — Chrome clamps around 500px and
sub-500 captures fake overflow bugs; needs a real device.

## Known limitation, not fixed

`MockDashboard.tsx:127` and `:309` use `sm:grid-cols-4` inside a `Stage`
wrapper. Breakpoint variants respond to viewport width, not container width, so
those tiles can go 4-up while their container is narrow. Container queries are
the right fix; out of scope here.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-Review

**Spec coverage.** Every spec change-list item maps to a task: token → 1, Container → 1, Section → 4, Nav rail → 3, type scale → 5, 4th column → 6, 3-up conformance → 7, doctrine → 8, verification → 9. The spec's `Prose` primitive (item 3) is deliberately **not** implemented; the File Structure table and the PR body both record why, and `Container`'s `reading` variant covers its purpose.

**Spec gap found and closed.** The spec did not account for `twMerge` failing to resolve base-variant `max-w-*` overrides against variant-prefixed ones. Task 2 exists because of it; without that task, Task 1 is a regression on four pages.

**Type consistency.** `width?: "default" | "reading"` is declared identically in `ContainerProps` (Task 1 Step 3) and `SectionProps` (Task 1 Step 4), and used as `width="reading"` in Task 2. `widthClass` and `surfaceClass` follow the same `as const` lookup-object pattern already in `Section.tsx`. The `--container-shell` token name matches the `max-w-shell` utility used in Tasks 1 and 3.
