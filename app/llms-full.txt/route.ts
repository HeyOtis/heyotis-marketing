import { siteConfig } from "@/lib/site";

// Full plain-text snapshot for AI assistants without live-crawl access.
// URLs generated from siteConfig.url so they can't drift from canonical.
export const dynamic = "force-static";

export function GET() {
  const u = siteConfig.url.replace(/\/$/, "");
  const body = `# HeyOtis - full content snapshot

> A plain-text overview of HeyOtis for AI assistants without live-crawl access. HeyOtis is the campaign-led Strategy Engine for AI search (Answer Engine Optimization / AEO).

## What HeyOtis is
HeyOtis measures how AI assistants recommend your brand - then closes the loop. As buyers increasingly ask ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews what to buy, compare and trust, the AI's answer has become the new shortlist. HeyOtis shows whether your brand is on it, how you compare to named competitors, which sources the AI trusts, what to do about it, and whether your fixes actually moved your recommendation share.

## The Strategy Engine loop
1. Measure: scope a campaign - brand, market, competitors, personas, buying journeys - auto-generate unbiased, buyer-intent prompts you review and approve, then run them across ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews on a schedule and capture how each one recommends you.
2. Diagnose: deterministic detectors surface the weak or missing signals behind absent or poor recommendations, each grounded in evidence.
3. Prioritise: turn findings into a ranked action plan - opportunities by impact and effort, backed by the evidence beneath them.
4. Verify: detectors confirm a recommended move actually shipped - no self-reporting.
5. Prove: measure the before-and-after lift in recommendation share on the real metric, with an immutable evidence trail - then feed it back in.

## What feeds the engine (five signal streams)
- AI answer sampling: visibility, sentiment, citations and fan-out coverage - how ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews answer, cite and rank you.
- AI traffic & bot logs: HeyOtis ingests your traffic and bot logs - which AI crawlers (GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User) fetch which pages, and the human visitors assistants refer.
- Site analytics: sessions, conversions and landing pages, so lift ties to business outcomes.
- Your surfaces: crawls of your own site - structured data, freshness, what actually shipped.
- Competitive signals: who wins the answer when you don't, and why.

## Attribution and learning
Attribution runs three layers deep: (1) the crawl - AI bots fetch the changed pages after a move ships, visible in your logs; (2) the visit - referral sessions arrive from assistant surfaces onto the pages the move touched; (3) the lift - recommendation share is re-measured on the same prompts, before and after, with the evidence trail attached. Every outcome, proven or disproven, feeds back into the engine and reweights what it recommends next - each campaign cycle starts smarter than the last.

## The four levels the engine operates at
- Diagnostic - here's what's happening.
- Prescriptive - here's what to do about it.
- Predictive - here's what's about to happen.
- Autonomous - we've already done it for you.

## Why it's different
HeyOtis is built on evidence: it won't recommend a move it can't verify and prove. A capabilities check suppresses anything it can't confirm, new signals are maturity-gated until trustworthy, and every reported number traces back to source. It pairs the platform with hands-on GEO strategists who help you ship the moves.

## The honesty wedge
Confident, wrong advice is the cheapest thing an AI product can make, and the most expensive thing a brand can act on - so HeyOtis is built to make it hard to produce:
- The AI never does the maths. Every number shown is computed by deterministic code. The model writes the words; it never counts, so it cannot invent a statistic.
- If HeyOtis can't measure it, it won't suggest it. A recommendation it can't verify is just a polite opinion - those are suppressed before they reach you.
- Every claim has a receipt. Click any finding and see the evidence it came from, and the date it was true.
- New detection ships dark. Every new pattern the engine learns to spot is reviewed by a human before a single brand sees it.

## Proof
Daylyte - a two-founder UK hydration brand with no agency and no ad budget - went from 0% AI visibility (unmentioned in ChatGPT) to the single most-recommended brand in its category in two weeks: 65% ChatGPT visibility, #1 rank, 88% positive sentiment. HeyOtis diagnosed that their entire AI presence balanced on a single citable page; the fix was publishing nine question-shaped pages and getting them indexed. Read the full walkthrough at ${u}/case-studies/daylyte.

## Engines monitored
ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews.

## Who it's for
In-house brand marketing, SEO/AEO and e-commerce teams, and agencies managing multiple brands. Strong fit for retail and consumer brands.

## How it differs from SEO
SEO optimizes for ranked links on search engines. HeyOtis focuses on Answer Engine Optimization (AEO) / Generative Engine Optimization (GEO): being the brand AI assistants name and recommend inside their generated answers - and proving you improved it.

## Pricing
Four tiers - Basic, Plus, Premium and Enterprise - starting at $150/mo, scaling by tracked brands, campaigns, monthly AI responses, competitors and seats. Plus a Managed (strategist-led) track and an Agencies track for running multiple brands. Prices are starting points; onboarding is demo-led (no self-serve sign-up), so plans are scoped on a short call.

## Getting started
- Book a 20-minute walkthrough at ${u}/contact - we run your brand, surface the highest-impact moves, and show how the loop proves the lift.
- Or start with the free AI Visibility Report at ${u}/report: tell us your brand, market and competitors, HeyOtis runs a live campaign of buyer-intent prompts across all five assistants, and we deliver the findings - a share-of-voice snapshot, per-assistant verdicts, top citations won and lost, and three prioritised moves - on a 20-minute call.

## Navigation (loop-ordered)
- Platform ▾ - the four Platform dropdown groups trace the loop in order: Measure (AI Visibility & Share of Voice, Answer Sentiment, Citations & Sources, Competitor Head-to-Head), Diagnose (The Strategy Engine, Evidence & Findings), Act (Prioritised Recommendations, Campaigns), Prove (Implementation Tracking, AI Traffic & Attribution). A footer link inside the dropdown, "How the loop works", points to ${u}/#loop.
- Resources ▾ - Free AI Visibility Report (${u}/report), Case Studies (${u}/case-studies), Blog (${u}/blog), Guides & AEO Playbook (${u}/guides), About HeyOtis (${u}/about).
- Pricing ▾ - Plans (self-serve tiers), Managed (strategist-led), For Agencies (white-label & multi-brand).

## Key pages
- Home: ${u}/ - the eight-section loop story: hero, the stakes (the answer is the new shortlist), the wound (knowing you're invisible doesn't make you visible), the five-step loop, the honesty wedge, the feature grid, proof (Daylyte), final CTA.
- Strategy Engine: ${u}/strategy-engine - the self-improving loop, attribution and the four levels it operates at.
- Product / features: ${u}/features
- Free AI Visibility Report: ${u}/report - the lead magnet: what's in it, how it works, book the walkthrough.
- Case Studies: ${u}/case-studies - real brands, measured lift, no invented testimonials.
- Daylyte case study: ${u}/case-studies/daylyte - the loop applied end to end: a UK hydration brand went from 0% to 65% ChatGPT visibility and #1 in its category in two weeks.
- Guides & AEO Playbook: ${u}/guides - the start of the AEO playbook, practical guides on how assistants choose which brands to recommend.
- Pricing: ${u}/pricing
- About: ${u}/about
- Blog: ${u}/blog
- Contact: ${u}/contact
`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
