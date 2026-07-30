# Pricing: replace fixed tiers with scope levers

**Date:** 2026-07-30
**Route:** `/pricing`

## Problem

The pricing page sells four fixed packages — Basic, Plus, Premium, Enterprise —
at $150 / $625 / $2,200 / "let's talk". Every engagement is actually bespoke, and
the real price model isn't settled yet. The page therefore advertises numbers and
package boundaries that don't survive a sales call.

Worse, the tier names are load-bearing in two places at once: the four tier cards
*and* a 14-row comparison table keyed to the same four columns. Both say the same
thing twice, and the names leak into page metadata, the hero lede, three FAQ
answers, the nav, and both AI-crawler files.

## Goal

Communicate **what we restrict by** without quoting any price. A visitor should
finish the page understanding which dimensions drive cost, so the scoping call
starts from shared vocabulary.

## Decisions

1. **No dollar figures anywhere.** Not in the hero, metadata, FAQ, or crawler
   files. Pricing is scoped on a call, full stop.
2. **Restrictions are volume, not capability.** Every plan gets the whole
   product. What varies is how much of it. GA4 AI referral traffic and Strategy
   Engine access — currently tier-gated — move to "in every plan".
3. **One section replaces two.** The tier-card grid and the comparison table
   collapse into a single three-column table of levers.
4. **No relative bands.** No "entry / mid / large" columns. Introducing bands
   would recreate tiers under a new name.

## Page structure

Hero keeps its layout. The lede changes premise to: pricing is scoped per brand,
no fixed packages, here's what moves it. `Talk to us` CTA unchanged.

One section, anchored `#plans` so existing nav links keep working:

- Eyebrow: `How pricing works`
- Title: `What we scope by`
- Sub: every plan gets the whole product; what varies is how much of it, so we
  price on volume, not features.

### The schedule: metered by scope

Three zones per row — **Lever**, **What it means**, **What moves it** — with five rows:

| Lever | What it means | What moves it |
|---|---|---|
| Tracked brands | Each brand is its own workspace, with its own campaigns and competitor set | How many brands, or distinct markets, you need watched separately |
| Campaigns | A themed set of prompts run on a schedule | Product lines, markets or buying questions you want tracked apart |
| AI responses per month | One prompt sent to one engine, answer captured and analysed | Prompt count × engines × how often campaigns run |
| Competitors benchmarked | Rivals scored beside you on Share of Voice, rank and citations | How crowded your category is |
| Team seats | People with access to the workspace | Team size, and whether clients or stakeholders need views |

"Active prompts per campaign" was cut after review — prompts still drive the
AI-response count, so they appear as a *driver* in the third column rather than
as a metered lever of their own.

### Presentation

Not a `<table>`. `components/ui/table.tsx` hard-codes `whitespace-nowrap` on
`TableCell`, which suits the short cells the old comparison table held and
breaks prose: nothing wraps, the table exceeds the viewport and the third
column clips off-screen.

Rows are a CSS grid, hairline-ruled (`divide-y divide-border`) directly on the
cream canvas — no card chrome, matching the blueprint theme's "hairline rules
instead of alternating bands". Column headings appear only at `lg`; below that
each row stacks and "what moves it" gets a periwinkle left rule plus its own
mono label, reading as a margin annotation rather than a third value.

No `01 / 02` numbering: the levers are a set, not a sequence, so numbering
would be decoration rather than structure.

### Block: in every plan

Below the schedule, as a check list inside a solid bordered card — the visual
inverse of the open ruled rows above. What varies is open, what's fixed is
enclosed. Deliberately *not* another column, which would imply a second axis to
compare:

ChatGPT · Claude · Gemini · Perplexity · Google AI Overviews · Share of Voice &
rankings · Citations analysis · Competitive benchmarking · GA4 AI referral
traffic · Strategy Engine

### Unchanged

Managed, For Agencies, FAQ and CtaBand sections stay as they are, in order.

## Implementation notes

Plain grid markup plus the existing `Reveal` primitive for the site's standard
scroll entrance. No new components, and no `components/ui/table.tsx` — see
Presentation above for why that primitive is unusable here.

Delete: the `Tier` type, `TIERS`, `TierCard`, `Cell`, `CompareRow`,
`COMPARE_GROUPS`, `TIER_COLUMNS`, `CompareCell`. Check whether `CardSpotlight`,
`Card`, `Minus` and the `Table*` imports are still used after the cut.

## Copy ripple

| Location | Current | Change |
|---|---|---|
| `app/(marketing)/pricing/page.tsx` metadata | "scales across four tiers, from $150/mo" | Scoped per brand; metered by brands, campaigns, prompts, responses, competitors, seats. No price. |
| Hero lede (`data-speakable`) | "Plans start at $150/mo and scale by…" | No fixed packages; every plan scoped to your brand; here's what we meter |
| FAQ 1 — "How is HeyOtis pricing structured?" | Names four tiers, quotes $150 | Rewrite around the six levers plus demo-led scoping |
| FAQ 4 — "Can agencies manage multiple brands?" | "Plus and Premium cover small portfolios… Enterprise scales to 25 brands, 100 seats" | Multi-tenant Org → Brand → Campaign, scoped to portfolio size; point at the Agencies track |
| FAQ 5 — "Can I change plans as I grow?" | "move between tiers" | "adjust your scope" — same levers, no tier language |
| `lib/site.ts:131` | Nav: Plans — "Self-serve tiers" | "Scoped to your brand". Also resolves a contradiction: the page states there is no self-serve sign-up. |
| `app/llms.txt/route.ts:45,55` | "Four tiers from $150/mo (Basic, Plus, Premium, Enterprise)"; "self-serve tiers" | Bespoke framing, so crawlers stop repeating retired prices |
| `app/llms-full.txt/route.ts:62,71` | Same, at length | Same |

### Fixed in passing

Both sit inside copy being rewritten anyway:

- The comparison table's `All 6` engines cell. There are five: ChatGPT, Claude,
  Gemini, Perplexity, Google AI Overviews. `app/api/og/route.tsx:42` is the
  canonical list.
- FAQ 3's "counts as five AI responses" — correct today only because there
  happen to be five engines. Phrase it so it can't drift when an engine is added.

## Accepted tradeoff

With no numbers, the page can't self-qualify visitors: someone with a $200/mo
budget can't tell they're out of range, so those calls still get booked. This is
accepted while the price model is unsettled. When numbers land, the natural place
is a floor line in the hero — a one-line change.

## Verification

Per project constraint (8GB machine, no local dev server or build): verify on the
Vercel preview deploy, not locally. Check:

- `/pricing` renders the new section; `#plans` anchor still resolves from nav
- No "$150", "Basic", "Plus", "Premium", "Enterprise" or "tier" strings remain on
  the route or in `llms.txt` / `llms-full.txt`
- FAQ JSON-LD still validates (`faqPageSchema` unchanged, only item copy)
- Table scrolls horizontally on mobile without the page scrolling sideways
- `pnpm lint` passes
