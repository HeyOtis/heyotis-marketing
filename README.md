# heyotis-marketing

Marketing site for Heyotis. Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · MDX.

## Quick start

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## What's in the skeleton

**Routes**

- `/`, `/about`, `/features`, `/pricing`, `/contact` — placeholder marketing pages.
- `/blog`, `/blog/[slug]` — MDX-driven blog with frontmatter, reading time, OG, structured data.
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` — auto-generated.
- `/api/og?title=…` — dynamic OG image generator.

**SEO**

- Per-page `buildMetadata()` (canonical, OG, Twitter, robots).
- `Organization` + `WebSite` JSON-LD on every page.
- Breadcrumb JSON-LD per route.
- Sitemap auto-includes static routes + MDX blog posts.

**AEO/GEO** (Answer/Generative Engine Optimization)

- `public/llms.txt` and `public/llms-full.txt` for AI crawlers.
- `FAQPage` schema on FAQ sections.
- `Article` schema with `speakable` blocks on blog posts.
- Robots allowlist for ChatGPT, Claude, Perplexity, Google-Extended, etc.
- `data-speakable` markers on lede paragraphs.

## Where to edit

| Want to change… | Edit… |
|---|---|
| Site name, URL, socials, nav | `lib/site.ts` |
| Default metadata behavior | `lib/seo.ts` |
| Structured data shape | `lib/schema.ts` |
| Header / Footer | `components/marketing/Nav.tsx` / `Footer.tsx` |
| Theme colors | `app/globals.css` |
| AI crawler guidance | `public/llms.txt`, `public/llms-full.txt`, `app/robots.ts` |
| Add a blog post | New `.mdx` file in `content/blog/` |

## Environment

- `NEXT_PUBLIC_SITE_URL` — production URL. Defaults to `https://heyotis.com`. Set on Vercel.

## Deploy

Vercel. Connect the repo, set `NEXT_PUBLIC_SITE_URL`, deploy.

## Next steps

This is a skeleton — design and real page content are next.
