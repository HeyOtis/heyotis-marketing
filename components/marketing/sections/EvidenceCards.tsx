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
 * motion check) so it can be mounted standalone - e.g. beside the honesty
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
    </div>
  );
}

/* ── Card B: signal cluster ─────────────────────────────────────────────── */

/* Five sources in a balanced ring around the hub (percent coordinates,
   indexed to SIGNAL_STREAMS order: answers, logs, analytics, surfaces,
   competitive). The primary stream sits on top. */
const CLUSTER_POS = [
  { left: "50%", top: "13%" }, // AI answers
  { left: "83%", top: "34%" }, // Bot logs
  { left: "20%", top: "84%" }, // Analytics
  { left: "80%", top: "84%" }, // Your site
  { left: "17%", top: "34%" }, // Competitors
] as const;

const HUB = { x: "50%", y: "56%" } as const;
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
      <Stage className="relative h-[200px] overflow-hidden">
        {/* dotted-grid ground, same language as the loop vignettes */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.24 0.02 285 / 0.08) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <svg className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
          {/* dashed spokes; the live one warms to periwinkle */}
          {CLUSTER_POS.map((p, i) => (
            <line
              key={i}
              x1={p.left}
              y1={p.top}
              x2={HUB.x}
              y2={HUB.y}
              stroke={
                !reduced && hot === i ? "var(--periwinkle)" : "var(--border)"
              }
              strokeWidth={!reduced && hot === i ? 1.5 : 1}
              strokeDasharray="4 4"
              style={{ transition: "stroke 0.4s, stroke-width 0.4s" }}
            />
          ))}
          {/* the live signal travels its spoke into the hub */}
          {playing ? (
            <motion.circle
              key={hot}
              r="3"
              fill="var(--periwinkle)"
              initial={{
                cx: CLUSTER_POS[hot].left,
                cy: CLUSTER_POS[hot].top,
                opacity: 0,
              }}
              animate={{ cx: HUB.x, cy: HUB.y, opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 1.5,
                ease: EASE,
                times: [0, 0.2, 0.85, 1],
              }}
            />
          ) : null}
        </svg>
        {/* the hub takes a quiet beat as each signal lands */}
        <motion.span
          key={playing ? `hub-${hot}` : "hub"}
          style={{ left: HUB.x, top: HUB.y, x: "-50%", y: "-50%" }}
          animate={playing ? { scale: [1, 1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 1.5, times: [0, 0.85, 0.92, 1], ease: EASE }}
          className="absolute flex size-14 items-center justify-center rounded-lg bg-surface-dark shadow-[0_2px_10px_rgba(40,30,70,0.18)]"
        >
          <LogoGlyph className="h-6 w-6" />
        </motion.span>
        {SIGNAL_STREAMS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.span
              key={s.id}
              initial={reduced ? false : { opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.09, ease: EASE }}
              style={{
                left: CLUSTER_POS[i].left,
                top: CLUSTER_POS[i].top,
                x: "-50%",
                y: "-50%",
              }}
              className={cn(
                "absolute flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-border/60 bg-card px-2.5 py-1.5 shadow-[0_1px_3px_rgba(40,30,70,0.08)] ring-periwinkle/70 transition-shadow duration-300",
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
 * `useInView` + reduced-motion check) so it can be mounted on its own -
 * e.g. on `/strategy`. The stage is decorative; the heading and
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
      <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground">
        Answers, AI traffic, analytics and your own pages - together
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
