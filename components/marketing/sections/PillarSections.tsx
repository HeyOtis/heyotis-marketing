"use client";

import * as React from "react";
import { MousePointer2, Sparkles } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { Section } from "@/components/marketing/primitives/Section";
import { Chip } from "@/components/marketing/primitives/stage";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

/* ── Vignette 1: AEO Insights — cream metric tiles on the warm panel ─────── */

function AeoVignette({ live }: { live: boolean }) {
  const tile = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };
  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } } }}
      initial={live ? "hidden" : "show"}
      animate="show"
      className="flex w-full max-w-[19rem] flex-col gap-3"
    >
      <div className="flex gap-3">
        <motion.div variants={tile} className="rounded-md bg-background px-4 py-3">
          <p className="label-mono text-[0.55rem] text-muted-foreground">Visibility</p>
          <p className="text-xl font-bold tabular-nums tracking-tight text-foreground">34.8%</p>
        </motion.div>
        <motion.div variants={tile} className="flex-1 rounded-md bg-background px-4 py-3">
          <p className="label-mono text-[0.55rem] text-muted-foreground">ChatGPT verdict</p>
          <p className="text-xl font-bold tracking-tight text-foreground">Recommended</p>
        </motion.div>
      </div>
      <motion.div variants={tile} className="rounded-md bg-background px-4 py-3">
        <div className="flex items-baseline justify-between">
          <p className="label-mono text-[0.55rem] text-muted-foreground">Share of voice · 30 days</p>
          <Chip tone="lime" className="text-[0.6rem]">▲ 12.4 pts</Chip>
        </div>
        <div aria-hidden className="mt-2 flex h-12 items-end gap-1.5">
          {[30, 38, 42, 47, 58, 66, 84].map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className={cn(
                "flex-1 origin-bottom rounded-t",
                i >= 5 ? "bg-brand" : "bg-periwinkle/70",
              )}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Vignette 2: Agent Analytics — the crawler roll (vertical reel) ──────── */

const AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "OAI-SearchBot",
];

function AgentVignette({ live }: { live: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <Marquee
        vertical
        repeat={3}
        className={cn(
          "h-full [--duration:18s] [--gap:1.75rem] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]",
          !live && "[&_*]:[animation-play-state:paused]",
        )}
      >
        {AGENTS.map((name) => (
          <span
            key={name}
            className="text-center text-3xl font-bold tracking-tight text-lime sm:text-4xl"
            style={{ fontStretch: "85%" }}
          >
            {name}
          </span>
        ))}
      </Marquee>
      {/* Glass pill the names scroll beneath — Nory's centre-item treatment. */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-[17rem] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/10 backdrop-blur-[3px]" />
    </div>
  );
}

/* ── Vignette 3: Strategy — the cursor clicks, the plan ranks ────────────── */

function StrategyVignette({ live }: { live: boolean }) {
  const [clicked, setClicked] = React.useState(false);
  React.useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => setClicked(true), 1600);
    return () => clearTimeout(id);
  }, [live]);
  const isClicked = clicked || !live;

  return (
    <div className="flex flex-col items-center gap-5">
      <motion.span
        animate={live && !isClicked ? { scale: [1, 1, 0.96, 1] } : { scale: 1 }}
        transition={{ duration: 1.6, times: [0, 0.85, 0.92, 1], ease: EASE }}
        className="relative inline-flex items-center gap-2.5 rounded-md border border-background/40 px-6 py-3.5 text-lg font-bold tracking-tight text-background"
      >
        <Sparkles className="size-5" strokeWidth={2} />
        Generate action plan
        <motion.span
          initial={live ? { opacity: 0, x: 26, y: 26 } : false}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="absolute -bottom-4 -right-4 text-background"
        >
          <MousePointer2 className="size-6 fill-background" strokeWidth={1.5} />
        </motion.span>
      </motion.span>
      <motion.div
        initial={live ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: isClicked ? 1 : 0, y: isClicked ? 0 : 8 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <Chip tone="lime">✓ 3 moves ranked · evidence attached</Chip>
      </motion.div>
    </div>
  );
}

/* ── The three pillars ───────────────────────────────────────────────────── */

const PILLARS = [
  {
    id: "aeo-insights",
    chipDot: "bg-salmon",
    name: "AEO Insights",
    heading: "Campaigns",
    body: "Campaigns of the buyer-intent queries that decide purchases — see how every assistant answers about you: visibility, sentiment, citations and share of voice.",
    href: "/features#campaigns",
    panel: "bg-panel-warm",
    vignette: AeoVignette,
  },
  {
    id: "agent-analytics",
    chipDot: "bg-periwinkle",
    name: "Agent Analytics",
    heading: "Traffic",
    body: "The crawlers are the new audience. Watch GPTBot, ClaudeBot and PerplexityBot fetch your pages, and tie assistant referrals to sessions and conversions.",
    href: "/features#traffic",
    panel: "bg-surface-dark",
    vignette: AgentVignette,
  },
  {
    id: "strategy",
    chipDot: "bg-lime",
    name: "Strategy",
    heading: "Strategy",
    body: "The engine turns findings into a ranked plan, watches the work land, and proves the lift — the loop that closes itself.",
    href: "/strategy-engine",
    panel: "bg-panel-warm",
    vignette: StrategyVignette,
  },
] as const;

/**
 * Nory's deep-panel feature rows: white card, editorial text left, one
 * focused vignette on a dark panel right. Panels alternate the warm
 * terracotta (the salmon hue taken dark) with the site ink. Decorative
 * panels are aria-hidden; the text carries the meaning. Reduced motion:
 * vignettes rest on their final frames, the crawler reel pauses.
 */
export function PillarSections() {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15, once: true });
  const live = !reduced && inView;

  return (
    <Section surface="cream" className="pt-0 md:pt-0">
      <div ref={ref} className="flex flex-col gap-6">
        {PILLARS.map((p) => {
          const Vignette = p.vignette;
          return (
            <article
              key={p.id}
              className="grid items-center gap-10 rounded-lg bg-card px-6 py-10 sm:px-12 sm:py-14 lg:grid-cols-2 lg:gap-16 lg:px-16"
            >
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground">
                  <span className={cn("size-1.5 rounded-full", p.chipDot)} />
                  {p.name}
                </span>
                <h3 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {p.heading}
                </h3>
                <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
                <a
                  href={p.href}
                  className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
                >
                  Learn more →
                </a>
              </div>
              <div
                aria-hidden
                className={cn(
                  "flex aspect-square max-h-[26rem] w-full items-center justify-center justify-self-end rounded-lg p-8",
                  p.panel,
                )}
              >
                <Vignette live={live} />
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
