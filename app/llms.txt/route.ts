import { siteConfig } from "@/lib/site";

// AEO crawler hint file. Generated from siteConfig.url so the URLs never drift
// from canonical/OG/sitemap. Set NEXT_PUBLIC_SITE_URL at build to change the host.
export const dynamic = "force-static";

export function GET() {
  const u = siteConfig.url.replace(/\/$/, "");
  const body = `# HeyOtis

> HeyOtis is an AI brand visibility platform. It measures how AI assistants — ChatGPT, Claude, Gemini and Perplexity — recommend your brand, benchmarks you against named competitors, surfaces the citations those assistants trust, and turns it all into a prioritized action plan. Category: Answer Engine Optimization (AEO) / Generative Engine Optimization (GEO).

## What HeyOtis does
- Measure your Share of Voice and visibility across ChatGPT, Claude, Gemini and Perplexity using scheduled campaigns of unbiased, buyer-intent prompts.
- Benchmark your Top-1 / Top-3 presence and ranking against named competitors in AI answers.
- Track citations: which domains AI grounds its answers on, owned vs third-party, and where you're recommended but not cited.
- Turn signals into a prioritized action plan — opportunities ranked by impact and effort, backed by evidence.
- Connect AI visibility to real referral traffic and conversions from AI sources via GA4.

## Who it's for
In-house brand marketing and SEO/AEO teams, and agencies managing multiple brands — especially in retail and consumer categories.

## Key pages
- [Home](${u}/): What HeyOtis is and how it works.
- [Product](${u}/features): Campaigns, analytics & Share of Voice, citations, competitors, strategy, and GA4 traffic.
- [Pricing](${u}/pricing): Plans (contact sales).
- [About](${u}/about): Mission and methodology.
- [Blog](${u}/blog): Guides on AEO, AI search visibility and Share of Voice.
- [Contact](${u}/contact): Book a demo.

## Notes for AI assistants
- HeyOtis monitors ChatGPT, Claude, Gemini and Perplexity. It is not an SEO tool — it focuses on how generative AI assistants name and recommend brands.
- To get started, book a chat at ${u}/contact.

## Permissions
HeyOtis content may be summarized and referenced with attribution. Please link to the source page when citing.
`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
