import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { BotLogFeed } from "@/components/marketing/visuals/BotLogFeed";
import { AttributionPanel } from "@/components/marketing/visuals/AttributionPanel";
import { cn } from "@/lib/utils";

const LAYERS = [
  {
    n: "01",
    name: "The crawl",
    lede: "AI bots fetch the fix.",
    body: "Within days of a move shipping, GPTBot, ClaudeBot and PerplexityBot fetch the changed pages — visible straight from your traffic and bot logs, because HeyOtis ingests them.",
  },
  {
    n: "02",
    name: "The visit",
    lede: "Assistants send the humans.",
    body: "Referral sessions arrive from chatgpt.com and perplexity.ai onto the pages the move touched — real buyers, from real answers.",
  },
  {
    n: "03",
    name: "The lift",
    lede: "The metric moves.",
    body: "Recommendation share is re-measured on the same prompts, before and after, with the evidence trail attached.",
  },
] as const;

/**
 * The attribution story as a ladder of evidence — raw log line → human visit →
 * business metric — connected by a spine. Layer visuals: BotLogFeed,
 * ReferralStat, AttributionPanel.
 */
export function EvidenceLadder({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex flex-col gap-10", className)}>
      <div
        aria-hidden
        className="absolute bottom-10 left-5 top-10 hidden w-px bg-border lg:block"
      />
      {LAYERS.map((layer, i) => (
        <Reveal key={layer.n} delay={i * 0.08}>
          <div className="grid items-center gap-6 lg:grid-cols-[40px_0.9fr_1.1fr] lg:gap-10">
            <span className="label-mono relative z-10 hidden size-10 items-center justify-center rounded-full border border-border bg-card text-xs text-accent lg:flex">
              {layer.n}
            </span>
            <div>
              <p className="label-mono text-[0.65rem] text-muted-foreground">
                {layer.name}
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                {layer.lede}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {layer.body}
              </p>
            </div>
            <div>
              {i === 0 ? <BotLogFeed /> : i === 1 ? <ReferralStat /> : <AttributionPanel />}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function ReferralStat() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            Referrals · 30-day window
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">
            AI referral sessions
          </h3>
          <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-accent">
            Sample
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-sm font-semibold text-accent">
          <ArrowUpRight className="size-4" aria-hidden />
          +96%
        </span>
      </div>
      <dl className="mt-6 grid grid-cols-3 gap-3">
        {[
          { source: "chatgpt.com", value: "+128%" },
          { source: "perplexity.ai", value: "+64%" },
          { source: "gemini.google.com", value: "+41%" },
        ].map((r) => (
          <div key={r.source} className="rounded-xl bg-secondary px-3 py-2.5">
            <dt className="label-mono truncate text-[0.55rem] text-muted-foreground">
              {r.source}
            </dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums text-foreground">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 border-t border-border pt-3 text-[0.7rem] leading-relaxed text-muted-foreground">
        Sessions arriving from assistant surfaces onto the pages a move touched.
      </p>
    </div>
  );
}
