"use client";

import * as React from "react";
import { Check, TriangleAlert, Repeat } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { Stage, Chip } from "@/components/marketing/primitives/stage";
import { NumberTicker } from "@/components/ui/number-ticker";
import { LOOP_STAGES, type LoopStage } from "@/lib/strategy-content";
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

function DiagnoseScene() {
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
          className="flex items-center gap-2 rounded-lg bg-card px-3 py-1.5"
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
          className="flex items-center gap-2 rounded-lg bg-card px-3 py-1.5"
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

/* Verify — the detector watches the top-priority move from Prioritise until it
   ships, then flips the status live. Nobody has to tell the engine; it
   re-checks the site itself. Static (not playing): rests on the "live" frame
   so the claim reads instantly without a mid-animation snapshot. */
function VerifyScene({ live }: { live: boolean }) {
  const [ticked, setTicked] = React.useState(false);
  React.useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => setTicked(true), 1400);
    return () => clearTimeout(id);
  }, [live]);
  const isLive = ticked || !live;

  return (
    <motion.div variants={scene} className="flex h-full flex-col justify-center gap-2.5">
      <motion.p variants={item} className="label-mono text-[0.6rem] text-muted-foreground">
        detector · your surfaces
      </motion.p>
      <motion.div
        variants={item}
        className="flex items-center gap-2 rounded-lg bg-card px-3 py-1.5"
      >
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
          Add product schema
        </span>
        <AnimatePresence mode="wait" initial={false}>
          {isLive ? (
            <motion.span
              key="live"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <Chip tone="lime">✓ live</Chip>
            </motion.span>
          ) : (
            <motion.span
              key="watching"
              exit={{ opacity: 0 }}
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="label-mono text-[0.65rem] text-muted-foreground"
            >
              monitoring…
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.p variants={item} className="label-mono text-[0.55rem] text-muted-foreground">
        nobody told us — the engine caught it
      </motion.p>
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

function ProveScene() {
  return (
    <motion.div variants={scene} className="flex h-full flex-col justify-center gap-2.5">
      {[
        { cap: "before", w: "22%", muted: true, v: "1.4%" },
        { cap: "after", w: "72%", muted: false, v: "4.9%" },
      ].map((b) => (
        <motion.div key={b.cap} variants={item} className="flex items-center gap-2">
          <span className="label-mono w-10 text-[0.6rem] text-muted-foreground">{b.cap}</span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-card">
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

/* The five loop stages, each its own analytics moment. */
const CARDS: {
  stage: LoopStage;
  scene: React.ComponentType<{ live: boolean }>;
}[] = [
  { stage: stageById.measure, scene: MeasureScene },
  { stage: stageById.diagnose, scene: DiagnoseScene },
  { stage: stageById.prioritise, scene: PrioritizeScene },
  { stage: stageById.verify, scene: VerifyScene },
  { stage: stageById.prove, scene: ProveScene },
];

/**
 * The campaign loop as a bento of five analytics moments — Measure, Diagnose,
 * Prioritise, Verify, Prove. Each card plays its scene once when scrolled
 * into view, then holds. Stage numbers ride the periwinkle chips so the loop
 * order stays legible without any geometry. When `withCompoundsTease` is on,
 * a sixth cell teases the compounding payoff and links to `#compounds`,
 * filling out the `lg:grid-cols-3` grid — opt in only on pages that actually
 * have a `#compounds` section to land on. Reduced motion: composed static
 * frames, no timers.
 */
export function LoopBento({
  className,
  withCompoundsTease = false,
}: {
  className?: string;
  withCompoundsTease?: boolean;
}) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25, once: true });
  const live = !reduced && inView;

  return (
    <div ref={ref} className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {CARDS.map((card, ci) => {
        const Scene = card.scene;
        const { stage } = card;
        return (
          <motion.article
            key={stage.id}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: live || reduced ? 1 : 0, y: live || reduced ? 0 : 18 }}
            transition={{ duration: 0.55, delay: ci * 0.1, ease: EASE }}
            className="rounded-xl bg-card p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-periwinkle/35 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-foreground">
                <span className="size-1.5 rounded-full bg-brand" />
                {String(stage.n).padStart(2, "0")} · {stage.verb}
              </span>
              {stage.differentiator ? (
                <span className="label-mono rounded-full bg-brand/10 px-2 py-0.5 text-[0.55rem] text-accent">
                  what others skip
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
              {stage.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {stage.blurb}
            </p>
            <div aria-hidden className="mt-4">
              <Stage className="h-[170px] px-4 py-3">
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

      {withCompoundsTease ? (
        <motion.a
          href="#compounds"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: live || reduced ? 1 : 0, y: live || reduced ? 0 : 18 }}
          transition={{ duration: 0.55, delay: CARDS.length * 0.1, ease: EASE }}
          className="group flex flex-col justify-between rounded-xl bg-periwinkle/30 p-5 transition-colors hover:bg-periwinkle/45 sm:p-6"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card/70 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-foreground">
              <Repeat className="size-3" strokeWidth={2.5} />
              Then
            </span>
            <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
              And then it compounds.
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/70">
              Every move proven — or disproven — teaches the engine what to
              recommend next.
            </p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
            See how it compounds
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </motion.a>
      ) : null}

      <p className="label-mono mt-2 text-[0.6rem] text-muted-foreground sm:col-span-2 lg:col-span-3">
        Illustrative — sample campaign data
      </p>
    </div>
  );
}
