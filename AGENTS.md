<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project layout (skeleton)

- `app/(marketing)/` — public marketing routes (home, about, features, pricing, contact, blog). All share `Nav` + `Footer` via the route-group layout.
- `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts` — auto-generated SEO files. The sitemap walks `content/blog/` for posts.
- `app/api/og/route.tsx` — dynamic OG image generator. Pass `?title=…&subtitle=…`.
- `app/layout.tsx` — root layout. Injects `Organization` + `WebSite` JSON-LD on every page.
- `content/blog/*.mdx` — blog posts. Frontmatter drives metadata, sitemap, and `Article` schema.
- `lib/site.ts` — canonical site config (name, url, socials, nav). Edit this first when branding changes.
- `lib/seo.ts` — `buildMetadata()` helper. Use on every page.
- `lib/schema.ts` — JSON-LD builders (`articleSchema`, `faqPageSchema`, `breadcrumbSchema`, etc.).
- `lib/mdx.ts` — MDX loader (frontmatter, reading time).
- `components/seo/JsonLd.tsx` — typed JSON-LD renderer; wrap structured data in this.
- `components/marketing/` — `Nav`, `Footer`, `Hero`, `Container`. shadcn primitives in `components/ui/`.
- `public/llms.txt`, `public/llms-full.txt` — AI crawler hints for AEO. Update when content changes.
- `mdx-components.tsx` — global MDX component overrides. Export `mdxComponents` (object) for RSC usage; `useMDXComponents` is kept for Next.js convention.

## Conventions

- **Every page** calls `buildMetadata({ title, description, path })`. This handles canonical, OG, Twitter, robots.
- **Every page** renders a `<JsonLd data={breadcrumbSchema([...])} />` block. Blog posts also render `articleSchema(...)`. FAQ sections render `faqPageSchema(...)`.
- Add `data-speakable` to the main lede paragraph — `Article.speakable` schema picks it up for voice/AI answer surfaces.
- Static-first: avoid client components on marketing pages unless required.
- `params` and `searchParams` are `Promise<…>` in Next.js 16 — always `await` them.

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
- **Move coupled classes together.** A column count drags its `gap`, `divide-*`,
  `col-span-*` and inner padding with it. Leaving any of them a breakpoint
  behind produces stray dividers and indents on a single-column stack.
- **4-up at `xl` needs earning:** item count divisible by 4, or a genuinely
  open-ended list. A 3-item grid never becomes 4 — it orphans a row.
- **`Container` is the sole owner of page-level `max-width`.** Never set a shell
  width on a section or page. Use `width="reading"` (768px, never widens) for
  long-form pages.
- **The blueprint rules come in a pair, and both ladders must move together.**
  A solid hairline sits at the content edge and a dashed pair sits 64px
  outboard of it. Five elements carry these ladders and must stay in step:

  | Element | Ladder |
  | --- | --- |
  | `Container` (`default`) | `max-w-6xl xl:max-w-7xl 2xl:max-w-shell` |
  | `layout.tsx` solid rail | same |
  | `Nav.tsx` bar (`xl:border-x`) | same |
  | `layout.tsx` dashed rule | `max-w-7xl xl:max-w-rule 2xl:max-w-rule-wide` |
  | `Nav.tsx` dashed rail | same |

  Each rule token is its shell token plus `8rem` (64px per side). Widening the
  shell without widening the rules makes the dashed lines cut through content.
  `Nav.tsx` repeats the ladders literally rather than wrapping `Container` —
  its bar is a fixed-height flex row with its own borders.
- **A `className` override cannot stop the widening.** `twMerge` resolves
  `max-w-3xl` against base-variant `max-w-6xl`, but not against `xl:max-w-7xl` —
  different variant, no conflict detected. Use the `width` prop.
- **`Section` owns vertical rhythm** (`py-20 md:py-28 2xl:py-36`). Override only
  for thin bands, and keep the override proportional across all three steps.
- Prose is capped by `SectionHeading`'s `sub` (`max-w-2xl`) and `.prose-like`
  (`68ch`). Keep new reading columns at one of those two.
- Breakpoint variants respond to **viewport** width, not container width. For a
  component nested inside a narrow wrapper, reach for `@container` queries
  instead.

## Commands

- `pnpm dev` — start dev server (Turbopack).
- `pnpm build` — production build.
- `pnpm lint` — ESLint.
