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
            className="ml-auto block w-fit rounded-full bg-secondary px-3.5 py-2 text-xs font-medium text-foreground/80"
          >
            &ldquo;best everyday skincare nz&rdquo;
          </motion.span>

          {/* ...the assistant works... */}
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
        <Chip tone="lime">✓ answered weekly, every assistant</Chip>
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
    id: "measure",
    chipDot: "bg-salmon",
    name: "Measure",
    heading: "See how AI answers about you",
    body: "We run campaigns of the buyer-intent queries that decide purchases across every assistant - and score what comes back: visibility, sentiment, citations and share of voice.",
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
    panel: "bg-panel-warm",
    vignette: StrategyVignette,
  },
  {
    id: "attribute",
    chipDot: "bg-periwinkle",
    name: "Attribute",
    heading: "The lift, with receipts",
    body: "The crawlers are the new audience. Watch GPTBot, ClaudeBot and PerplexityBot fetch your pages, and tie assistant referrals to sessions and conversions.",
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
