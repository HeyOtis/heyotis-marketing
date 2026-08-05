# Responsive breakpoint system

**Date:** 2026-07-31
**Status:** Approved, ready for planning

## Problem

The site has no breakpoint convention. Every component picks its own, and three
incompatible mental models are in play:

- `LoopVignettes` uses `sm:` 62 times and never `md:` or `lg:`
- `FeatureTabs` uses `lg:` 16 times and `sm:` once
- Most pages mix all three arbitrarily

Site-wide usage is `sm` 160, `md` 34, `lg` 105, `xl` 5, `2xl` 0. Two consequences:

1. **No shared rule.** Every new component is a fresh guess, and the guess is
   usually copied from whichever neighbour was opened last.
2. **Wide screens are wasted.** Nothing targets `xl`/`2xl`, so on a 1920px
   display the entire site sits in a 1152px column with 384px of dead margin
   each side.

Tailwind v4 defaults are in use; no custom `--breakpoint-*` tokens are defined.

## Goals

- One documented ladder that says which breakpoint does which job.
- Real large-screen treatment: the shell grows, reading columns do not.
- Enforcement through shared primitives, not through memory.

## Non-goals

- Rewriting all 66 component files to strict conformance. Components that
  already read well are left alone.
- Renaming breakpoints to semantic tokens (`tablet:`, `desktop:`). Rejected:
  diverges from Tailwind/shadcn docs, and every future snippet would need
  translating.
- Container queries. See "Known limitation" below.

## The doctrine

Tailwind's default pixel values stay. What is new is a rule for which
breakpoint does which job.

| BP     | px    | Job                | Rule                                                        |
| ------ | ----- | ------------------ | ----------------------------------------------------------- |
| base   | <640  | Phone              | Single column. The starting point, never a fallback.         |
| `sm`   | 640   | Inline runs        | Buttons side-by-side, meta rows, stat pairs. 2-up compact items. |
| `md`   | 768   | First layout shift | 1→2 col for anything containing prose. Padding step. 3-up starts here. |
| `lg`   | 1024  | Desktop            | Nav switches. 2→3 col. Split heroes, sidebars.                |
| `xl`   | 1280  | Shell widens       | 1152→1280. 3→4 col only where content earns it.               |
| `2xl`  | 1536  | Shell caps         | 1440. Final type and space step. Nothing structural.          |

### The `sm` carve-out

The original rule was "no column counts at `sm`". That would have forced 24
edits, and it is wrong for half of them: moving 2-up card grids from 640 to 768
makes large phones in landscape worse, not better.

The rule that actually holds:

> **2-up is allowed at `sm` for compact items. 3-up is not, ever.**

3-up at 640px gives roughly 213px per column, which is below the useful minimum
for anything containing prose.

"Compact item" means a card, tile, or link whose content is a heading plus at
most a short line of supporting text — roughly 300px is enough for it. Anything
with a paragraph, an image, or a metadata row waits for `md`.

### The "content earns it" test for a 4th column at `xl`

A grid may go to 4 columns at `xl` only if its item count is divisible by 4, or
the list is genuinely open-ended (blog posts, case studies, guides). A grid with
exactly 3 items never becomes 4 — that orphans a row.

## Architecture

Three primitives carry the ladder so components stop hand-rolling it. Each has
one job, a stable interface, and can be reasoned about without reading its
callers.

### `Container` — the shell

`components/marketing/Container.tsx`. Owns shell width and horizontal gutters.
Nothing else in the codebase should set a page-level `max-w-*`.

Today:

```
mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8
```

Becomes:

```
mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 xl:max-w-7xl xl:px-12 2xl:max-w-shell
```

`max-w-shell` comes from a new theme token:

```css
@theme {
  --container-shell: 90rem; /* 1440px */
}
```

The `xl:px-12` step exists so content does not kiss the viewport edge once the
shell is wide.

### `Prose` — the reading column

New primitive, `components/marketing/primitives/Prose.tsx`. Caps reading columns
at `max-w-2xl` (672px, roughly 68 characters).

This is the piece that makes widening the shell safe. Without it, a 1440px shell
drags body copy to unreadable line lengths. The value is already proven: **40
files hand-roll `max-w-2xl` for exactly this purpose today.** The primitive makes
it explicit and non-negotiable rather than a convention people remember.

Interface: a `div` accepting `className` and children, same shape as `Container`.

Adoption is scoped — see "Change list" item 3.

### `Section` — vertical rhythm

`components/marketing/primitives/Section.tsx`. Owns section padding.

Today `py-20 md:py-28`. Becomes `py-20 md:py-28 2xl:py-36`.

Base stays at `py-20` deliberately: changing it would churn mobile, which is not
what this work is for.

## Change list

1. **`app/globals.css`** — add `--container-shell: 90rem` to `@theme`.

2. **`Container.tsx`** — width and gutter ladder above.

3. **`Prose.tsx`** — new primitive. Adopted only where the shell now widens
   (pages whose lede or body copy sits directly in a `Container` that will grow
   past 1152px). The other hand-rolled `max-w-2xl` sites keep working unchanged
   and are converted opportunistically later.

4. **`Section.tsx`** — add the `2xl:` step, then reconcile drifted section-level
   padding. Full sections drop their override and inherit the primitive; thin
   bands keep a deliberately tighter scale but gain a proportional `2xl:` step
   so they do not fall out of rhythm on wide screens.

   Drop the override, inherit `py-20 md:py-28 2xl:py-36`:
   - `app/(marketing)/privacy/page.tsx:110` — `py-16 md:py-20`
   - `app/(marketing)/terms/page.tsx:65` — `py-16 md:py-20`
   - `app/(marketing)/pricing/page.tsx:207` — `py-14 md:py-20`
   - `app/(marketing)/pricing/page.tsx:220` — `py-14 md:py-20`
   - `components/marketing/sections/CompoundingBand.tsx:12` — `py-14 md:py-16`

   Keep the tighter scale, add a `2xl:` step (thin bands, not full sections):
   - `components/marketing/sections/ReportBand.tsx:12` — `py-10 md:py-12`
   - `components/marketing/sections/ClientLogos.tsx:30` — `py-10 md:py-12`

   Explicitly **not** touched, because these are card and panel padding rather
   than section rhythm: `Nav.tsx:52`, `HeroLoopTabs.tsx:269`,
   `CaseStudyDaylyte.tsx:248`, `CaseStudyDaylyte.tsx:265`,
   `PillarSections.tsx:519`, `app/not-found.tsx:35`.

5. **`Nav.tsx:334`** — the dashed guide rail is `max-w-7xl` at `xl:block`
   against a `max-w-6xl` container, so it sits 128px wide of the content today.
   Give it Container's width classes so it tracks at every breakpoint.

6. **`app/globals.css`** — add a `2xl:` step to `.display-xl` and `.display-lg`
   so headings are not undersized in a 1440px shell. `.display-hero` already
   uses `clamp(2.2rem, 4vw, 3.4rem)` and needs no change. `.display-md` and
   `.display-sm` are section headings, not page headings, and stay as-is.

7. **4th column at `xl`** — add `xl:grid-cols-4` to the open-ended card lists:
   - `app/(marketing)/blog/page.tsx:71`
   - `app/(marketing)/case-studies/page.tsx:55`
   - `app/(marketing)/guides/page.tsx:69`

   Explicitly **not**:
   - `app/(marketing)/pricing/page.tsx:153` — exactly 3 tiers, a 4th column
     orphans the row
   - `MaturityLevels.tsx:12` and `app/(marketing)/about/page.tsx:226` — already
     4-up at `lg`
   - `LoopBento.tsx:283` — bento layout, the 3-col grid is load-bearing for the
     span arithmetic

8. **3-up moves `sm` → `md`** (the carve-out):
   - `components/marketing/visuals/LoopVignettes.tsx` lines 497, 533, 826, 862,
     1234, 1270, 1662, 1698. Eight repeats of one pattern
     (`sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border`,
     plus the matching `sm:pr-6` / `sm:pl-6` padding). One decision applied
     eight times, not 62 decisions.
   - `app/(marketing)/report/page.tsx:160`
   - `components/marketing/sections/EvidenceLadder.tsx:88`

   Not `AnswerReel.tsx:168` — that is `grid-cols-2` at base on short chips
   inside a card, which is correct.

## Known limitation

`MockDashboard.tsx:127` and `:309` use `sm:grid-cols-4` inside a `Stage`
wrapper. Breakpoint variants respond to **viewport** width, not container width,
so these tiles can go 4-up while their actual container is narrow. Container
queries (`@container`) are the correct fix. Out of scope here; recorded so it is
not mistaken for an oversight.

## Verification

`pnpm dev` and `pnpm build` cannot run on this machine — the 8GB M1 Air
kernel-panicked three times under that load on 2026-07-30. Verification is
therefore: branch → push → Vercel preview → Chrome screenshots.

Widths: 640, 768, 1024, 1280, 1440, 1920.
Pages: home, pricing, blog, case-studies, strategy.

Each width must be checked for: no horizontal overflow, no orphaned grid rows,
reading columns still capped, section rhythm consistent between adjacent
sections.

Two constraints that shape how the screenshots are taken:

- **375px cannot be captured this way.** Chrome clamps around 500px and sub-500
  captures fake overflow bugs that do not exist on real devices. Phone width
  needs manual review or DevTools device emulation.
- **Captures must use real wall-clock timing.** The site uses `motion`;
  `--virtual-time-budget` freezes animations and returns blank `AnimatePresence`
  children, which reads as a layout bug when it is a capture artifact.

`pnpm lint` and `pnpm typecheck` are cheap and run locally.

## Documentation

The doctrine table and the `sm` carve-out go into `AGENTS.md` under
Conventions, so the rule survives context resets and applies to future work
without being rediscovered.

## Scope decision

Approved approach: land the primitives, the wide-screen treatment, and the
targeted conformance fixes above in one pass. Do not sweep all 66 files. A large
diff makes real regressions easy to miss during review, and the components not
listed here already read correctly.
