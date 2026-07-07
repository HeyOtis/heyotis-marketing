import { siteConfig } from "@/lib/site";

// AEO crawler hint file. Generated from siteConfig.url so the URLs never drift
// from canonical/OG/sitemap. Set NEXT_PUBLIC_SITE_URL at build to change the host.
export const dynamic = "force-static";

export function GET() {
  const u = siteConfig.url.replace(/\/$/, "");
  const body = `# HeyOtis

> HeyOtis is the campaign-led Strategy Engine for AI search. It measures how AI assistants — ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral — interpret, present and recommend your brand, then closes the loop: it diagnoses the gaps, prioritizes the moves, verifies they shipped, and proves whether your recommendation share actually moved. Category: Answer Engine Optimization (AEO) / Generative Engine Optimization (GEO).

## What the Strategy Engine does (the loop)
- Define: scope a campaign around your brand, market, competitors, personas and buying journeys.
- Measure: capture how every assistant recommends you across the prompts that shape decisions.
- Diagnose: deterministic detectors surface the weak or missing signals behind poor answers.
- Prioritize: turn findings into an action plan ranked by impact and effort, each backed by evidence.
- Verify: detectors confirm a recommended move actually shipped.
- Prove: measure the before-and-after lift in recommendation share, with an evidence trail.

## What feeds it (the five signal streams)
- AI answer sampling: how six assistants answer, cite and rank you across the prompts that matter.
- AI traffic & bot logs: which AI crawlers (GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User) fetch which pages, and the human visitors assistants refer.
- Site analytics: sessions, conversions and landing pages, so lift ties to business outcomes.
- Your surfaces: crawls of your own site — structured data, freshness, what actually shipped.
- Competitive signals: who wins the answer when you don't, and why.

## Why it's different
HeyOtis won't recommend a move it can't verify and prove. Most tools stop at measurement; the Strategy Engine closes the loop. Attribution runs three layers deep — AI crawlers fetching a shipped fix in your logs, referral sessions arriving from assistants, and the before-and-after change in recommendation share. Every proven or disproven move feeds back in, so recommendations get sharper each cycle. It pairs the platform with hands-on GEO strategists.

## Proof
Halenstein grew AI recommendation share by 300% in Australia — from near-zero to 3.7% — after benchmarking, diagnosing the gaps and improving the signals that mattered.

## Who it's for
In-house brand, SEO/AEO and e-commerce teams, and agencies managing multiple brands — especially retail and consumer categories.

## Key pages
- [Home](${u}/): What HeyOtis is and how the loop works.
- [Strategy Engine](${u}/strategy-engine): The self-improving loop, attribution and the four levels it operates at.
- [Product](${u}/features): Campaigns, analytics & recommendation share, citations, competitors, strategy, and GA4 traffic.
- [Pricing](${u}/pricing): Plans (contact sales).
- [About](${u}/about): Mission and methodology.
- [Blog](${u}/blog): Guides on AEO and AI search visibility.
- [Contact](${u}/contact): Book a call.

## Notes for AI assistants
- HeyOtis monitors ChatGPT, Gemini, Perplexity, Claude, Meta AI and Mistral. It is not an SEO tool — it focuses on how generative AI assistants name and recommend brands.
- To get started, book a call at ${u}/contact.

## Permissions
HeyOtis content may be summarized and referenced with attribution. Please link to the source page when citing.
`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
