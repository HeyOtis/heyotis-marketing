"use client";

import * as React from "react";
import { CircleCheck, TriangleAlert, TrendingUp } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { Eyebrow } from "@/components/marketing/primitives/Eyebrow";
import { Stage, Chip } from "@/components/marketing/primitives/stage";
import { LogoGlyph } from "@/components/marketing/Logo";
import { SIGNAL_STREAMS } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/* ── Card A: findings pills ─────────────────────────────────────────────── */

const PILLS = [
  { icon: TriangleAlert, tone: "salmon" as const, text: "Schema missing on /products" },
  { icon: CircleCheck, tone: "lime" as const, text: "Move verified live · 14:02" },
  { icon: TrendingUp, tone: "lime" as const, text: "Citations +3 this week" },
  { icon: TriangleAlert, tone: "salmon" as const, text: "Pricing page 90 days stale" },
  { icon: CircleCheck, tone: "lime" as const, text: "Prove: attribution lift +250%" },
];

const PILL_TICK_MS = 2200;
const PILL_WINDOW = 3;

/**
 * Findings-as-notifications: a beige stage that fills with pills sliding in
 * as the engine surfaces evidence. Self-contained (own `useInView` + reduced
 * motion check) so it can be mounted standalone — e.g. beside the honesty
 * claims on the homepage. Reduced motion / off-screen: the first three
 * pills, static, no timers.
 */
export function FindingsPills({ className }: { className?: string }) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const playing = !reduced && inView;

  const [count, setCount] = React.useState(PILL_WINDOW);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setCount((c) => c + 1), PILL_TICK_MS);
    return () => clearInterval(id);
  }, [playing]);

  const pills = [];
  for (let i = Math.max(0, count - PILL_WINDOW); i < count; i++) {
    pills.push({ ...PILLS[i % PILLS.length], key: i });
  }

  return (
    <div ref={ref} className={className}>
      <div aria-hidden>
        <Stage className="flex h-[190px] flex-col justify-end gap-2.5 overflow-hidden">
          <AnimatePresence initial={false}>
            {pills.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.key}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex w-fit items-center gap-2 rounded-full bg-card py-1.5 pl-2 pr-3.5"
                >
                  <Chip tone={p.tone} className="rounded-full px-1.5 py-1">
                    <Icon className="size-3.5" strokeWidth={2.25} />
                  </Chip>
                  <span className="text-sm font-medium text-foreground">{p.text}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Stage>
      </div>
      <p className="label-mono mt-3 text-[0.6rem] text-muted-foreground">
        Illustrative — mirrors the engine&apos;s findings feed
      </p>
    </div>
  );
}

/* ── Card B: signal cluster ─────────────────────────────────────────────── */

/* Five sources arranged around the center glyph (percent coordinates). */
const CLUSTER_POS = [
  { left: "18%", top: "16%" },
  { left: "82%", top: "20%" },
  { left: "14%", top: "78%" },
  { left: "84%", top: "76%" },
  { left: "50%", top: "8%" },
] as const;

const HIGHLIGHT_MS = 2000;

function SignalCluster({ playing, reduced }: { playing: boolean; reduced: boolean }) {
  const [hot, setHot] = React.useState(0);
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(
      () => setHot((h) => (h + 1) % SIGNAL_STREAMS.length),
      HIGHLIGHT_MS,
    );
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div aria-hidden>
      <Stage className="relative h-[190px]">
        <svg className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
          {CLUSTER_POS.map((p, i) => (
            <line
              key={i}
              x1={p.left}
              y1={p.top}
              x2="50%"
              y2="52%"
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}
        </svg>
        <span className="absolute left-1/2 top-[52%] flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-surface-dark">
          <LogoGlyph className="h-6 w-6" />
        </span>
        {SIGNAL_STREAMS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.span
              key={s.id}
              initial={reduced ? false : { opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.09, ease: EASE }}
              style={{ left: CLUSTER_POS[i].left, top: CLUSTER_POS[i].top }}
              className={cn(
                "absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 ring-periwinkle transition-shadow duration-300",
                !reduced && hot === i && "ring-2",
              )}
            >
              <Icon className="size-3.5 text-accent" strokeWidth={2} />
              <span className="text-xs font-semibold text-foreground">{s.short}</span>
            </motion.span>
          );
        })}
      </Stage>
    </div>
  );
}

/* ── Standalone card ────────────────────────────────────────────────────── */

/**
 * The five signal streams clustered around the engine glyph, in the same
 * flat `bg-card` shell as the rest of the card system. Self-contained (own
 * `useInView` + reduced-motion check) so it can be mounted on its own —
 * e.g. on `/strategy-engine`. The stage is decorative; the heading and
 * blurb carry the meaning.
 */
export function SignalClusterCard({ className }: { className?: string }) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const playing = !reduced && inView;

  return (
    <div ref={ref} className={cn("rounded-lg bg-card p-6 sm:p-8", className)}>
      <Eyebrow>Every signal, one model</Eyebrow>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
        Answers, bot logs, analytics and your own pages — together
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        The engine is only as good as its evidence, so all five signal
        streams flow into one model of the gap.
      </p>
      <div className="mt-6">
        <SignalCluster playing={playing} reduced={reduced} />
      </div>
    </div>
  );
}
