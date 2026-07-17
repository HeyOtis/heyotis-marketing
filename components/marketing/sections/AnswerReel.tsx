"use client";

import * as React from "react";
import {
  OpenAI,
  Claude,
  Gemini,
  Perplexity,
  MetaAI,
  Mistral,
} from "@lobehub/icons";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { Stage, Chip } from "@/components/marketing/primitives/stage";
import { cn } from "@/lib/utils";

type Tone = "lime" | "salmon" | "neutral";
type Metric = { v: string; d: string; up: boolean };

type Assistant = {
  name: string;
  Icon: React.ComponentType<{ size?: number }>;
  verdict: { tone: Tone; label: string };
  query: string;
  metrics: { visibility: Metric; sentiment: Metric; citations: Metric; fanout: Metric };
  source: string;
};

/* One believable 30-day record per assistant (sample data, mixed movement). */
const ASSISTANTS: Assistant[] = [
  {
    name: "ChatGPT", Icon: OpenAI,
    verdict: { tone: "lime", label: "↗ Recommended · #2" },
    query: "best everyday skincare nz",
    metrics: {
      visibility: { v: "31.2%", d: "▲ 9.1", up: true },
      sentiment: { v: "+0.62", d: "▲ 0.08", up: true },
      citations: { v: "14", d: "▼ 2", up: false },
      fanout: { v: "18/24", d: "▲ 3", up: true },
    },
    source: "your pricing page",
  },
  {
    name: "Claude", Icon: Claude,
    verdict: { tone: "lime", label: "↗ Recommended · #3" },
    query: "gentle moisturiser for sensitive skin",
    metrics: {
      visibility: { v: "27.4%", d: "▲ 4.2", up: true },
      sentiment: { v: "+0.55", d: "▲ 0.11", up: true },
      citations: { v: "11", d: "▲ 3", up: true },
      fanout: { v: "15/24", d: "▲ 2", up: true },
    },
    source: "your ingredients guide",
  },
  {
    name: "Gemini", Icon: Gemini,
    verdict: { tone: "neutral", label: "Mentioned, not recommended" },
    query: "top skincare brands nz",
    metrics: {
      visibility: { v: "12.1%", d: "▲ 1.9", up: true },
      sentiment: { v: "+0.31", d: "▼ 0.04", up: false },
      citations: { v: "6", d: "▼ 1", up: false },
      fanout: { v: "9/24", d: "▲ 1", up: true },
    },
    source: "retailer listicle",
  },
  {
    name: "Perplexity", Icon: Perplexity,
    verdict: { tone: "lime", label: "↗ Recommended · #1" },
    query: "best value retinal serum",
    metrics: {
      visibility: { v: "38.6%", d: "▲ 6.8", up: true },
      sentiment: { v: "+0.71", d: "▲ 0.05", up: true },
      citations: { v: "22", d: "▲ 5", up: true },
      fanout: { v: "21/24", d: "▲ 2", up: true },
    },
    source: "your comparison page",
  },
  {
    name: "Meta AI", Icon: MetaAI,
    verdict: { tone: "salmon", label: "Missing from the answer" },
    query: "everyday face cream under $50",
    metrics: {
      visibility: { v: "3.2%", d: "▼ 0.8", up: false },
      sentiment: { v: "+0.08", d: "▼ 0.12", up: false },
      citations: { v: "1", d: "▼ 1", up: false },
      fanout: { v: "4/24", d: "— 0", up: false },
    },
    source: "competitor blog",
  },
  {
    name: "Mistral", Icon: Mistral,
    verdict: { tone: "neutral", label: "Mentioned, not recommended" },
    query: "clean beauty brands oceania",
    metrics: {
      visibility: { v: "9.8%", d: "▲ 2.2", up: true },
      sentiment: { v: "+0.24", d: "▲ 0.02", up: true },
      citations: { v: "4", d: "▲ 1", up: true },
      fanout: { v: "7/24", d: "▲ 1", up: true },
    },
    source: "press coverage",
  },
];

const TICK_MS = 3000;
const METRIC_LABELS: [keyof Assistant["metrics"], string][] = [
  ["visibility", "Visibility"],
  ["sentiment", "Sentiment"],
  ["citations", "Citations"],
  ["fanout", "Fan-out coverage"],
];

/**
 * Nory's location reel, reinterpreted: the periwinkle banner cycles the six
 * assistants; the tile below shows each one's 30-day AEO record — verdict,
 * the fan-out query behind it, and the four metrics with movement. Decorative
 * (aria-hidden); the adjacent SectionHeading carries the semantics. Reduced
 * motion: static ChatGPT frame, no timers.
 */
export function AnswerReel({ className }: { className?: string }) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const playing = !reduced && inView;

  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % ASSISTANTS.length), TICK_MS);
    return () => clearInterval(id);
  }, [playing]);

  const a = ASSISTANTS[reduced ? 0 : idx];
  const Icon = a.Icon;

  return (
    <div ref={ref} aria-hidden className={className}>
      <Stage>
        <div className="relative overflow-hidden rounded-xl">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={a.name}
              layout
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex items-center gap-2.5 rounded-xl bg-periwinkle px-4 py-2.5"
            >
              <span className="flex size-6 items-center justify-center rounded-lg bg-card/80">
                <Icon size={15} />
              </span>
              <span className="text-sm font-bold tracking-tight text-foreground">
                {a.name}
              </span>
              <span className="ml-auto text-xs font-semibold tabular-nums text-foreground/60">
                {(reduced ? 0 : idx) + 1} / {ASSISTANTS.length}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative mt-3 min-h-[224px]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={a.name}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="rounded-xl bg-card p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Chip tone={a.verdict.tone}>{a.verdict.label}</Chip>
                <span className="text-[0.7rem] italic text-muted-foreground">
                  &ldquo;{a.query}&rdquo;
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {METRIC_LABELS.map(([k, label]) => {
                  const m = a.metrics[k];
                  return (
                    <div key={k} className="rounded-lg bg-stage/70 px-3 py-2">
                      <p className="label-mono text-[0.55rem] text-muted-foreground">
                        {label}
                      </p>
                      <p className="mt-0.5 flex items-baseline gap-1.5 text-base font-bold tabular-nums tracking-tight text-foreground">
                        {m.v}
                        <motion.span
                          initial={reduced ? false : { opacity: 0, scale: 0.75 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.35, ease: EASE }}
                        >
                          <Chip tone={m.up ? "lime" : "salmon"} className="px-1.5 text-[0.6rem]">
                            {m.d}
                          </Chip>
                        </motion.span>
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-[0.65rem] text-muted-foreground">
                <span>Top source: {a.source}</span>
                <span>30-day window · sample</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-3.5 flex justify-center gap-1.5">
          {ASSISTANTS.map((x, i) => (
            <span
              key={x.name}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === (reduced ? 0 : idx) ? "w-4 bg-brand" : "w-1 bg-border",
              )}
            />
          ))}
        </div>
      </Stage>
    </div>
  );
}
