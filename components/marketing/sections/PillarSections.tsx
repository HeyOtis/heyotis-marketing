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

/* ── Vignette 1: Campaigns - the answer coming back, mentions scored ─────── */

const ANSWER_ITEMS: Array<{
  lead: string;
  name: string;
  cite?: string;
  focal?: boolean;
}> = [
  { lead: "Cleanser:", name: "Mira Daily Cleanser.", cite: "miraskin.nz" },
  {
    lead: "Sunscreen:",
    name: "YourBrand Daily SPF.",
    cite: "yourbrand.com +2",
    focal: true,
  },
  { lead: "Night:", name: "Aro Skin Balm." },
];

/* A brand name inside the answer, marker-highlighted: the tint sweeps across
   the words left-to-right after the line lands - the "scored" gesture. */
function Mention({
  tint,
  delay,
  children,
}: {
  tint: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <span className="relative inline-block whitespace-nowrap rounded px-1.5 py-0.5">
      <motion.span
        aria-hidden
        className={cn("absolute inset-0 rounded", tint)}
        style={{ originX: 0 }}
        variants={{
          hidden: { scaleX: 0 },
          show: {
            scaleX: 1,
            transition: { delay, duration: 0.4, ease: EASE },
          },
        }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

function AeoVignette({ live }: { live: boolean }) {
  const fadeUp = (delay: number) => ({
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.45, ease: EASE },
    },
  });
  return (
    <motion.div
      initial={live ? "hidden" : "show"}
      animate="show"
      className="flex w-full max-w-[21rem] flex-col gap-3"
    >
      {/* One chat surface, transcript-style. The card is a fixed-height window
          onto a longer answer: hovering glides the transcript up to reveal the
          rest, like scrolling the real thread. */}
      <motion.div
        variants={fadeUp(0)}
        className="group/chat relative h-[21rem] overflow-hidden rounded-xl bg-background"
      >
        <div className="p-4 pb-6 transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/chat:-translate-y-[9.5rem] motion-reduce:transition-none motion-reduce:group-hover/chat:translate-y-0 sm:p-5 sm:pb-6">
          {/* the buyer's question arrives... */}
          <motion.span
            variants={{
              hidden: { opacity: 0, x: 16 },
              show: {
                opacity: 1,
                x: 0,
                transition: { delay: 0.15, duration: 0.45, ease: EASE },
              },
            }}
            // Full foreground, not /80: at 10.4px on bg-secondary the faded
            // version measured 4.18:1, just under the 4.5:1 AA floor.
            className="ml-auto block w-fit rounded-full bg-secondary px-3.5 py-2 text-xs font-medium text-foreground"
          >
            &ldquo;best everyday skincare nz&rdquo;
          </motion.span>

          {/* ...the AI assistant works... */}
          <motion.p
            variants={fadeUp(0.55)}
            className="mt-3.5 text-[0.65rem] text-muted-foreground/70"
          >
            Worked for 12s <span aria-hidden>›</span>
          </motion.p>

          {/* ...and the answer streams in, mentions scored as they land */}
          <motion.p
            variants={fadeUp(0.75)}
            className="mt-2.5 text-xs leading-relaxed text-foreground/80"
          >
            For a{" "}
            <span className="font-semibold text-foreground">
              simple, reliable everyday routine in NZ
            </span>
            , I&rsquo;d use:
          </motion.p>

          <motion.p
            variants={fadeUp(0.9)}
            className="mt-2.5 text-xs font-semibold text-foreground"
          >
            Morning
          </motion.p>
          <ol className="mt-1.5 space-y-1.5">
            {ANSWER_ITEMS.map(({ lead, name, cite, focal }, i) => (
              <motion.li
                key={name}
                variants={fadeUp(1 + i * 0.35)}
                className="relative pl-5 text-xs leading-relaxed text-foreground/80"
              >
                <span className="absolute left-0 tabular-nums text-foreground/50">
                  {i + 1}.
                </span>
                <span className="font-semibold text-foreground">{lead}</span>{" "}
                {focal ? (
                  <Mention tint="bg-salmon/45" delay={1.15 + i * 0.35}>
                    {name}
                  </Mention>
                ) : (
                  <span>{name}</span>
                )}{" "}
                {cite ? (
                  <motion.span
                    variants={{
                      hidden: { opacity: 0, scale: 0.6 },
                      show: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                          delay: 1.35 + i * 0.35,
                          duration: 0.3,
                          ease: EASE,
                        },
                      },
                    }}
                    className={cn(
                      "label-mono inline-flex items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-0.5 align-middle text-[0.5rem] leading-none",
                      focal
                        ? "bg-brand-soft text-accent"
                        : "bg-secondary text-foreground/50",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "size-1.5 rounded-full",
                        focal ? "bg-periwinkle" : "bg-foreground/25",
                      )}
                    />
                    {cite}
                  </motion.span>
                ) : null}
              </motion.li>
            ))}
          </ol>

          {/* below the fold - revealed by the hover glide */}
          <motion.p
            variants={fadeUp(2.1)}
            className="mt-3 text-xs font-semibold text-foreground"
          >
            Evening
          </motion.p>
          <ol className="mt-1.5 space-y-1.5">
            {["Cleanse.", "Apply the same moisturiser."].map((step, i) => (
              <motion.li
                key={step}
                variants={fadeUp(2.2 + i * 0.1)}
                className="relative pl-5 text-xs leading-relaxed text-foreground/80"
              >
                <span className="absolute left-0 tabular-nums text-foreground/50">
                  {i + 1}.
                </span>
                {step}
              </motion.li>
            ))}
          </ol>
          <motion.p
            variants={fadeUp(2.4)}
            className="mt-2.5 text-xs leading-relaxed text-foreground/80"
          >
            That&rsquo;s genuinely enough for most people. I wouldn&rsquo;t
            start with toners, eye creams or several serums.
          </motion.p>
          <motion.p
            variants={fadeUp(2.5)}
            className="mt-2.5 text-xs leading-relaxed text-foreground/80"
          >
            <span className="font-semibold text-foreground">
              Best value setup:
            </span>{" "}
            Mira cleanser + YourBrand Daily SPF. In NZ, daily broad-spectrum
            sunscreen is the step that matters most.{" "}
            <span className="label-mono inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-secondary px-1.5 py-0.5 align-middle text-[0.5rem] leading-none text-foreground/50">
              <span aria-hidden className="size-1.5 rounded-full bg-foreground/25" />
              dermnet.nz +1
            </span>
          </motion.p>

          {/* the answer's sources, quietly */}
          <motion.div
            variants={fadeUp(2.6)}
            className="mt-3.5 flex items-center gap-2 border-t border-dashed border-border pt-3"
          >
            <span aria-hidden className="flex -space-x-1">
              <span className="size-2.5 rounded-full bg-salmon ring-2 ring-background" />
              <span className="size-2.5 rounded-full bg-periwinkle ring-2 ring-background" />
              <span className="size-2.5 rounded-full bg-lime ring-2 ring-background" />
            </span>
            <span className="label-mono text-[0.5rem] text-muted-foreground">
              8 sources
            </span>
          </motion.div>
        </div>

        {/* window-edge fades: the top one appears once the transcript has
            scrolled; the bottom one hints there's more, and lifts on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background to-transparent opacity-0 transition-opacity duration-700 group-hover/chat:opacity-100"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent transition-opacity duration-700 group-hover/chat:opacity-0"
        />
      </motion.div>

      <motion.div variants={fadeUp(2.5)}>
        <Chip tone="lime">✓ answered weekly, every AI assistant</Chip>
      </motion.div>
    </motion.div>
  );
}

/* ── Vignette 2: Agent Analytics - the crawler roll (vertical reel) ──────── */

const AGENTS = [
  "GPTBot",
  "PerplexityBot",
  "ClaudeBot",
  "GoogleBot",
  "GoogleExtended",
  "OAISearchBot",
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
    </div>
  );
}

/* ── Vignette 3: Strategy - the cursor clicks, the plan ranks ────────────── */

/* The moves the click produces. `impact` drives the bar width, and the order
   IS the ranking - the numeral carries real information, so it earns its
   place. Keep the copy in the same query language as vignette 1. */
const MOVES: { title: string; impact: number }[] = [
  { title: "Answer “best everyday SPF”", impact: 0.92 },
  { title: "Add ingredient FAQ schema", impact: 0.68 },
  { title: "Refresh the routine guide", impact: 0.44 },
];

function StrategyVignette({ live }: { live: boolean }) {
  const [clicked, setClicked] = React.useState(false);
  React.useEffect(() => {
    if (!live) return;
    const id = setTimeout(() => setClicked(true), 1500);
    return () => clearTimeout(id);
  }, [live]);
  const isClicked = clicked || !live;

  return (
    <div className="flex w-full max-w-[21rem] flex-col items-center gap-5">
      {/* The trigger. Cursor glides in, presses, and the press is what the
          whole vignette is about - so the button reacts (fills, compresses)
          rather than just sitting there. */}
      <motion.span
        animate={{
          scale: isClicked && live ? [0.96, 1] : 1,
          backgroundColor: isClicked
            ? "rgba(244,241,234,0.14)"
            : "rgba(244,241,234,0)",
        }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative inline-flex items-center gap-2.5 rounded-md border border-background/40 px-6 py-3.5 text-lg font-bold tracking-tight text-background"
      >
        <motion.span
          animate={
            isClicked && live ? { scale: [1, 1.25, 1], rotate: [0, -12, 0] } : {}
          }
          transition={{ duration: 0.55, ease: EASE }}
        >
          <Sparkles className="size-5" strokeWidth={2} />
        </motion.span>
        Generate action plan
        {/* click ripple, from under the cursor tip */}
        <motion.span
          aria-hidden
          initial={false}
          animate={
            isClicked && live
              ? { scale: [0.3, 1.9], opacity: [0.55, 0] }
              : { scale: 0.3, opacity: 0 }
          }
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="pointer-events-none absolute -bottom-1 -right-1 size-10 rounded-full bg-lime"
        />
        <motion.span
          initial={live ? { opacity: 0, x: 34, y: 30 } : false}
          animate={{
            opacity: 1,
            x: isClicked ? 0 : [34, 0],
            y: isClicked ? 0 : [30, 0],
          }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="absolute -bottom-4 -right-4 text-background"
        >
          <motion.span
            className="block"
            animate={isClicked && live ? { scale: [1, 0.82, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <MousePointer2
              className="size-6 fill-background"
              strokeWidth={1.5}
            />
          </motion.span>
        </motion.span>
      </motion.span>

      {/* The payoff: the ranked plan itself, dealt out row by row. */}
      <motion.div
        initial={live ? { opacity: 0, y: 12, scale: 0.97 } : false}
        animate={{
          opacity: isClicked ? 1 : 0,
          y: isClicked ? 0 : 12,
          scale: isClicked ? 1 : 0.97,
        }}
        transition={{ duration: 0.45, ease: EASE }}
        className="w-full rounded-xl bg-background p-4 sm:p-5"
      >
        <div className="flex items-baseline justify-between">
          <span className="font-display text-sm font-bold tracking-tight text-foreground">
            Action plan
          </span>
          <span className="label-mono text-[0.55rem] text-muted-foreground">
            Ranked by impact
          </span>
        </div>

        <ul className="mt-3 flex flex-col gap-2.5">
          {MOVES.map((move, i) => (
            <motion.li
              key={move.title}
              initial={live ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: isClicked ? 1 : 0, y: isClicked ? 0 : 8 }}
              transition={{
                duration: 0.35,
                delay: isClicked && live ? 0.18 + i * 0.12 : 0,
                ease: EASE,
              }}
              className="flex items-center gap-3"
            >
              <span className="label-mono w-4 shrink-0 text-[0.6rem] text-muted-foreground">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground">
                {move.title}
              </span>
              <span className="h-1.5 w-14 shrink-0 overflow-hidden rounded-full bg-foreground/10">
                <motion.span
                  className="block h-full rounded-full bg-lime"
                  style={{ originX: 0 }}
                  initial={live ? { scaleX: 0 } : false}
                  animate={{ scaleX: isClicked ? move.impact : 0 }}
                  transition={{
                    duration: 0.55,
                    delay: isClicked && live ? 0.32 + i * 0.12 : 0,
                    ease: EASE,
                  }}
                />
              </span>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={live ? { opacity: 0 } : false}
          animate={{ opacity: isClicked ? 1 : 0 }}
          transition={{
            duration: 0.35,
            delay: isClicked && live ? 0.7 : 0,
            ease: EASE,
          }}
          className="mt-3.5 flex items-center gap-2 border-t border-border pt-3"
        >
          <Chip tone="lime" className="shrink-0 whitespace-nowrap">
            Evidence attached
          </Chip>
          <span className="text-[0.65rem] leading-tight text-muted-foreground">
            Each move cites the answers it moves
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── The three pillars ───────────────────────────────────────────────────── */

const PILLARS = [
  {
    id: "measure",
    chipDot: "bg-salmon",
    name: "Measure",
    heading: "See how AI answers about you",
    body: "Campaigns that mirror your customer's decision journey - from discovery to purchase intent - showing how every AI assistant answers at each stage, and scoring what comes back: visibility, sentiment, citations and share of voice.",
    href: "/platform#insights-surface",
    panel: "bg-panel-warm",
    vignette: AeoVignette,
  },
  {
    id: "strategy",
    chipDot: "bg-lime",
    name: "Strategy",
    heading: "The moves with the biggest return",
    body: "The Strategy Engine turns findings into a ranked plan - moves scored on impact and effort - and watches the work land.",
    href: "/strategy",
    panel: "bg-panel-violet",
    vignette: StrategyVignette,
  },
  {
    id: "attribute",
    chipDot: "bg-periwinkle",
    name: "Attribute",
    heading: "The lift, with receipts",
    body: "AI is the new audience. Watch AI assistants visit your pages, and tie the visitors they send you to sessions and conversions.",
    href: "/platform#analytics-surface",
    panel: "bg-surface-dark",
    vignette: AgentVignette,
  },
] as const;

/**
 * Nory's deep-panel feature rows: white card, editorial text left, one
 * focused vignette on a dark panel right. Panels use the warm terracotta
 * (the salmon hue taken dark) and the site ink, in loop order. Decorative
 * panels are aria-hidden; the text carries the meaning. Reduced motion:
 * vignettes rest on their final frames, the crawler reel pauses.
 */
export function PillarSections() {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15, once: true });
  const live = !reduced && inView;

  return (
    <Section surface="cream" className="overflow-x-clip">
      <div ref={ref} className="flex flex-col gap-6">
        {PILLARS.map((p) => {
          const Vignette = p.vignette;
          return (
            <div key={p.id} className="relative">
              {/* Blueprint rules: dashed horizontals that run the full page
                  width, aligned to the card's top and bottom edges. The card's
                  opaque background masks them across its own width, so they
                  read as guide lines the card sits on. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-[-50vw] top-0 border-t border-dashed border-border/60"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-[-50vw] bottom-0 border-t border-dashed border-border/60"
              />
              <article
                className="relative grid items-center gap-10 rounded-lg border border-border bg-card px-6 py-10 sm:px-12 sm:py-14 lg:grid-cols-2 lg:gap-16 lg:px-16"
              >
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground">
                  <span className={cn("size-1.5 rounded-full", p.chipDot)} />
                  {p.name}
                </span>
                <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
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
            </div>
          );
        })}
      </div>
    </Section>
  );
}
