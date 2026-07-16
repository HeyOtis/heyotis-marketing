"use client";

import * as React from "react";
import { Bot, Check, TriangleAlert } from "lucide-react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/* Spec easing: confident, no bounce. Shared by orchestrator and vignettes. */
export const EASE = [0.32, 0.72, 0, 1] as const;

/* Decorative status colors on card surfaces (same pattern as BotLogFeed). */
const AMBER = "text-[oklch(0.72_0.13_75)]";
const GREEN = "text-[oklch(0.55_0.13_160)]";

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

/* 01 Define — scope chips slot into the campaign card. */
const SCOPE_CHIPS = ["Brand", "Competitors ×4", "Personas ×3", "Prompts ×24"];

function DefineVignette() {
  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col justify-center gap-2 p-3"
    >
      <motion.p
        variants={item}
        className="label-mono text-[0.5rem] text-muted-foreground"
      >
        campaign scope
      </motion.p>
      <div className="flex flex-wrap gap-1">
        {SCOPE_CHIPS.map((c) => (
          <motion.span
            key={c}
            variants={item}
            className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[0.55rem] font-medium text-accent"
          >
            {c}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* 02 Measure — assistant answers scan in; present in one, absent in another. */
const ANSWERS = [
  { name: "ChatGPT", tag: "cited", ok: true },
  { name: "Claude", tag: "absent", ok: false },
  { name: "Gemini", tag: "stale", ok: false },
] as const;

function MeasureVignette() {
  return (
    <div className="relative flex h-full flex-col justify-center gap-1.5 overflow-hidden p-3">
      <motion.div
        variants={list}
        initial="hidden"
        animate="show"
        className="contents"
      >
        {ANSWERS.map((a) => (
          <motion.div
            key={a.name}
            variants={item}
            className="flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1"
          >
            <Bot className="size-2.5 shrink-0 text-muted-foreground" />
            <span className="text-[0.55rem] font-semibold text-foreground">
              {a.name}
            </span>
            <span className="h-1 min-w-0 flex-1 rounded-full bg-border" />
            <span
              className={cn(
                "label-mono text-[0.45rem]",
                a.ok ? "text-accent" : "text-muted-foreground",
              )}
            >
              {a.tag}
            </span>
          </motion.div>
        ))}
      </motion.div>
      <motion.span
        className="pointer-events-none absolute inset-x-2 top-0 h-8 bg-gradient-to-b from-transparent via-brand/15 to-transparent"
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 148, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.4, delay: 0.8, ease: "linear" }}
      />
    </div>
  );
}

/* 03 Diagnose — the same surfaces re-read as findings, flags land. */
const FINDINGS = [
  { text: "schema missing", warn: true },
  { text: "pricing outdated", warn: true },
  { text: "source cited", warn: false },
] as const;

function DiagnoseVignette() {
  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col justify-center gap-1.5 p-3"
    >
      {FINDINGS.map((f) => (
        <motion.div
          key={f.text}
          variants={item}
          className="flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1"
        >
          <span className="text-[0.55rem] font-medium text-foreground">
            {f.text}
          </span>
          <motion.span
            className="ml-auto"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1.1, ease: EASE }}
          >
            {f.warn ? (
              <TriangleAlert className={cn("size-3", AMBER)} />
            ) : (
              <Check className={cn("size-3", GREEN)} />
            )}
          </motion.span>
        </motion.div>
      ))}
      <motion.p
        className="label-mono text-[0.45rem] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.6 }}
      >
        2 findings · evidence attached
      </motion.p>
    </motion.div>
  );
}

/* 04 Prioritize — moves re-rank by impact. */
const MOVES = [
  { text: "Refresh pricing page", impact: 7.5 },
  { text: "Add product schema", impact: 9.2 },
  { text: "Publish comparison", impact: 5.1 },
] as const;

function PrioritizeVignette() {
  const [sorted, setSorted] = React.useState(false);
  React.useEffect(() => {
    const id = setTimeout(() => setSorted(true), 1100);
    return () => clearTimeout(id);
  }, []);
  const moves = sorted
    ? [...MOVES].sort((a, b) => b.impact - a.impact)
    : [...MOVES];
  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col justify-center gap-1.5 p-3"
    >
      {moves.map((m) => (
        <motion.div
          key={m.text}
          layout
          variants={item}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1"
        >
          <span className="min-w-0 flex-1 truncate text-[0.55rem] font-medium text-foreground">
            {m.text}
          </span>
          <span className="h-1 w-10 overflow-hidden rounded-full bg-border">
            <span
              className="block h-full rounded-full bg-brand-strong/60"
              style={{ width: `${m.impact * 10}%` }}
            />
          </span>
          <span className="label-mono text-[0.45rem] tabular-nums text-muted-foreground">
            {m.impact.toFixed(1)}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* 05 Verify — the detector marks the top move live. No self-reporting. */
function VerifyVignette() {
  const [live, setLive] = React.useState(false);
  React.useEffect(() => {
    const id = setTimeout(() => setLive(true), 1400);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-3">
      <p className="label-mono text-[0.5rem] text-muted-foreground">
        detector · your surfaces
      </p>
      <div className="flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1.5">
        <span className="min-w-0 flex-1 truncate text-[0.55rem] font-medium text-foreground">
          Add product schema
        </span>
        <AnimatePresence mode="wait" initial={false}>
          {live ? (
            <motion.span
              key="live"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
              className={cn(
                "label-mono flex items-center gap-1 text-[0.45rem]",
                GREEN,
              )}
            >
              <Check className="size-2.5" /> live · 14:02
            </motion.span>
          ) : (
            <motion.span
              key="watching"
              exit={{ opacity: 0 }}
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="label-mono text-[0.45rem] text-muted-foreground"
            >
              monitoring…
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <motion.p
        className="label-mono text-[0.45rem] text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: live ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        change detected on site — marked done
      </motion.p>
    </div>
  );
}

/* 06 Prove — recommendation share lifts; evidence stamped. */
const PROVE_PATH = "M 2 44 H 32 V 34 H 62 V 26 H 92 V 14 H 118";

function ProveVignette() {
  const count = useMotionValue(18);
  const label = useTransform(count, (v) => `${Math.round(v)}%`);
  React.useEffect(() => {
    const controls = animate(count, 24, {
      duration: 1.4,
      delay: 0.5,
      ease: EASE,
    });
    return () => controls.stop();
  }, [count]);
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 p-3">
      <div className="flex items-baseline justify-between">
        <p className="label-mono text-[0.5rem] text-muted-foreground">
          recommendation share
        </p>
        <motion.span className="text-sm font-semibold tabular-nums text-foreground">
          {label}
        </motion.span>
      </div>
      <svg viewBox="0 0 120 52" className="w-full" aria-hidden>
        <line
          x1="2"
          x2="118"
          y1="44"
          y2="44"
          stroke="var(--border)"
          strokeWidth="1"
        />
        <motion.path
          d={PROVE_PATH}
          fill="none"
          stroke="var(--brand-strong)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
      </svg>
      <motion.span
        className="label-mono self-start rounded-full bg-brand/10 px-1.5 py-0.5 text-[0.45rem] text-accent"
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 1.9, ease: EASE }}
      >
        evidence #1284 ✓
      </motion.span>
    </div>
  );
}

/**
 * One micro-scene per loop stage, keyed by LOOP_STAGES id. Each component
 * takes no props, plays on mount, and must clear its own timers on unmount
 * (the orchestrator mounts/unmounts vignettes via AnimatePresence).
 */
export const VIGNETTES: Record<string, React.ComponentType> = {
  define: DefineVignette,
  measure: MeasureVignette,
  diagnose: DiagnoseVignette,
  prioritize: PrioritizeVignette,
  verify: VerifyVignette,
  prove: ProveVignette,
};
