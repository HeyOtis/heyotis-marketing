"use client";

import * as React from "react";
import { Check, TriangleAlert } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { Stage, Chip } from "@/components/marketing/primitives/stage";
import { NumberTicker } from "@/components/ui/number-ticker";
import { LOOP_STAGES } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/* Decorative status colors on card surfaces (same pattern as BotLogFeed). */
const AMBER = "text-[oklch(0.72_0.13_75)]";
const GREEN = "text-[oklch(0.55_0.13_160)]";

const stageById = Object.fromEntries(LOOP_STAGES.map((s) => [s.id, s]));

const scene = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

function MeasureScene({ live }: { live: boolean }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="label-mono text-[0.6rem] text-muted-foreground">
        AI recommendation share
      </p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
          {live ? <NumberTicker value={34.8} startValue={18} decimalPlaces={1} /> : "34.8"}%
        </span>
        <Chip tone="lime">▲ 12.4 pts</Chip>
      </div>
      <div aria-hidden className="mt-2.5 flex h-10 items-end gap-1">
        {[26, 32, 37, 45, 55, 67, 84].map((h, i) => (
          <motion.span
            key={i}
            variants={item}
            style={{ height: `${h}%` }}
            className={cn(
              "w-3 origin-bottom rounded-t",
              i >= 5 ? "bg-brand" : "bg-periwinkle/60",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function DiagnoseScene(_props: { live: boolean }) {
  const rows = [
    { text: "Schema missing", warn: true, meta: "2 pages" },
    { text: "Pricing stale", warn: true, meta: "1 page" },
    { text: "Citations OK", warn: false, meta: "✓" },
  ];
  return (
    <motion.div variants={scene} className="flex h-full flex-col justify-center gap-2">
      {rows.map((r) => (
        <motion.div
          key={r.text}
          variants={item}
          className="flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 shadow-sm"
        >
          {r.warn ? (
            <TriangleAlert className={cn("size-3.5", AMBER)} />
          ) : (
            <Check className={cn("size-3.5", GREEN)} />
          )}
          <span className="text-xs font-medium text-foreground">{r.text}</span>
          <span className="ml-auto text-[0.65rem] tabular-nums text-muted-foreground">
            {r.meta}
          </span>
        </motion.div>
      ))}
      <motion.p variants={item} className="label-mono text-[0.55rem] text-muted-foreground">
        every finding · evidence attached
      </motion.p>
    </motion.div>
  );
}

function PrioritizeScene({ live }: { live: boolean }) {
  const MOVES = [
    { text: "Refresh pricing page", impact: 7.5 },
    { text: "Add product schema", impact: 9.2 },
    { text: "Publish comparison", impact: 5.1 },
  ];
  const [sorted, setSorted] = React.useState(false);
  React.useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => setSorted(true), 1000);
    return () => clearTimeout(id);
  }, [live]);
  const moves = sorted ? [...MOVES].sort((a, b) => b.impact - a.impact) : MOVES;
  return (
    <motion.div variants={scene} className="flex h-full flex-col justify-center gap-2">
      {moves.map((m) => (
        <motion.div
          key={m.text}
          layout={live}
          variants={item}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 shadow-sm"
        >
          <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
            {m.text}
          </span>
          <span className="h-1.5 w-12 overflow-hidden rounded-full bg-stage">
            <span
              className="block h-full rounded-full bg-brand"
              style={{ width: `${m.impact * 10}%` }}
            />
          </span>
          <span className="text-[0.65rem] font-bold tabular-nums text-muted-foreground">
            {m.impact.toFixed(1)}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

const barFill = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.9, delay: 0.4, ease: EASE },
  },
};

function ProveScene(_props: { live: boolean }) {
  return (
    <motion.div variants={scene} className="flex h-full flex-col justify-center gap-2.5">
      {[
        { cap: "before", w: "22%", muted: true, v: "1.4%" },
        { cap: "after", w: "72%", muted: false, v: "4.9%" },
      ].map((b) => (
        <motion.div key={b.cap} variants={item} className="flex items-center gap-2">
          <span className="label-mono w-10 text-[0.6rem] text-muted-foreground">{b.cap}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-card shadow-sm">
            <motion.span
              variants={barFill}
              style={{ width: b.w }}
              className={cn(
                "block h-full origin-left rounded-full",
                b.muted ? "bg-border" : "bg-brand",
              )}
            />
          </span>
          <span className="w-9 text-right text-xs font-bold tabular-nums text-foreground">
            {b.v}
          </span>
        </motion.div>
      ))}
      <motion.div variants={item}>
        <Chip tone="lime">✓ change detected live · +250%</Chip>
      </motion.div>
    </motion.div>
  );
}

/* The six loop stages compressed into four analytics moments. */
const CARDS: {
  chip: string;
  stages: (typeof LOOP_STAGES)[number][];
  scene: React.ComponentType<{ live: boolean }>;
  differentiator?: boolean;
}[] = [
  { chip: "01–02", stages: [stageById.define, stageById.measure], scene: MeasureScene },
  { chip: "03", stages: [stageById.diagnose], scene: DiagnoseScene },
  { chip: "04", stages: [stageById.prioritize], scene: PrioritizeScene },
  { chip: "05–06", stages: [stageById.verify, stageById.prove], scene: ProveScene, differentiator: true },
];

/**
 * The campaign loop as a bento of four analytics moments. Each card plays its
 * scene once when scrolled into view, then holds. Stage numbers ride the
 * periwinkle chips so the loop order stays legible without any geometry.
 * `compact` (home) drops the blurbs; the full variant (strategy-engine)
 * shows them. Reduced motion: composed static frames, no timers.
 */
export function LoopBento({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25, once: true });
  const live = !reduced && inView;

  return (
    <div ref={ref} className={cn("grid gap-5 sm:grid-cols-2", className)}>
      {CARDS.map((card, ci) => {
        const Scene = card.scene;
        const titleStage = card.stages[card.stages.length - 1];
        return (
          <motion.article
            key={card.chip}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: live || reduced ? 1 : 0, y: live || reduced ? 0 : 18 }}
            transition={{ duration: 0.55, delay: ci * 0.1, ease: EASE }}
            className="rounded-3xl border border-border bg-card p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-periwinkle/35 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-foreground">
                <span className="size-1.5 rounded-full bg-brand" />
                {card.chip} · {card.stages.map((s) => s.verb).join(" & ")}
              </span>
              {card.differentiator ? (
                <span className="label-mono rounded-full bg-brand/10 px-2 py-0.5 text-[0.55rem] text-accent">
                  what others skip
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
              {titleStage.title}
            </h3>
            {!compact ? (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {titleStage.blurb}
              </p>
            ) : null}
            <div aria-hidden className="mt-4">
              <Stage className={cn(compact ? "h-[150px]" : "h-[170px]", "px-4 py-3")}>
                <motion.div
                  variants={scene}
                  initial={reduced ? "show" : "hidden"}
                  animate={live || reduced ? "show" : "hidden"}
                  className="h-full"
                >
                  <Scene live={live} />
                </motion.div>
              </Stage>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
