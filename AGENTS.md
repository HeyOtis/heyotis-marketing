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

## Commands

- `pnpm dev` — start dev server (Turbopack).
- `pnpm build` — production build.
- `pnpm lint` — ESLint.
