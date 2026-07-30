"use client";

import * as React from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { EASE } from "@/lib/ease";
import { cn } from "@/lib/utils";

/**
 * The four hero-tab vignettes, all speaking one quiet language: white card,
 * dotted-grid ground, ghosted ink (~30%) everywhere except ONE focal element
 * per panel, mono micro-labels, dashed dividers. No window chrome, no dark
 * panels - these sit behind the fold and must not shout.
 *
 * Motion: cells rest on their finished frame. Entering a cell replays its
 * animation from zero (via a replay counter that remounts the visual);
 * leaving settles it back to the finished frame. Hovering also darkens the
 * cell's text slightly. Reduced motion never animates.
 */

/* Hover-replay wrapper: each mouse-enter bumps `runId`, remounting the
   visual so its animation runs again. runId 0 = untouched resting state. */
function HoverCell({
  className,
  children,
}: {
  className?: string;
  children: (runId: number) => React.ReactNode;
}) {
  const reduced = useIsomorphicReducedMotion();
  const [runId, setRunId] = React.useState(0);
  return (
    <div
      className={cn("group", className)}
      onMouseEnter={reduced ? undefined : () => setRunId((n) => n + 1)}
    >
      {children(runId)}
    </div>
  );
}

/* ── shared frame ── */

/* White card lifted off the cream canvas, bounded by dashed rules
   (the fold's own dashed line reads as its top edge). */
function Frame({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        // Only the horizontal (top/bottom) dashed rules - the vertical edges
        // stay open so the panel reads as bands running to the column rule,
        // DOSS-style.
        "relative mx-auto flex h-full w-full flex-col overflow-hidden border-y border-dashed border-border bg-card",
        className,
      )}
    >
      {/* dotted-grid ground */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0.24 0.02 285 / 0.07) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <div className="relative px-6 pt-5 sm:px-8">
        <span className="label-mono text-[0.7rem] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="relative flex-1 px-6 pb-6 pt-4 sm:px-8">{children}</div>
    </div>
  );
}

/* White glow behind text that feathers out into the dotted grid. Sized by
   the host's own box, so it grows with the copy. */
function Halo() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-x-10 -inset-y-8"
      style={{
        background:
          "radial-gradient(closest-side, white 45%, transparent 100%)",
      }}
    />
  );
}

function TileCaption({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="relative mt-4">
      <Halo />
      <div className="relative">
        <p className="font-display text-base font-semibold text-foreground">
          {title}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/80 sm:text-sm">
          {sub}
        </p>
      </div>
    </div>
  );
}

/* The wide bottom-right cell: editorial copy + the tab's single CTA. */
function EditorialCell({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative flex flex-col justify-center sm:col-span-2 sm:pl-6">
      <Halo />
      <div className="relative">
        <p className="font-display text-base font-semibold text-foreground">
          {title}
        </p>
        <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/80 sm:text-sm">
          {children}
        </p>
        <a
          href={href}
          className="mt-4 inline-flex w-fit items-center rounded-full bg-salmon px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-salmon/85"
        >
          Find out more
        </a>
      </div>
    </div>
  );
}

/* ── Measure: the data-rich surface, as a quiet bento ── */

const VIS_LINE =
  "M4 72C24 70 36 66 56 62C76 58 88 52 108 48C128 44 140 40 160 32C180 24 196 20 216 14";

function VisibilityLine({ runId }: { runId: number }) {
  // Gradient and mask ids must be instance-unique - two vignettes can share the
  // DOM mid-transition, and a collided mask would drive the wrong chart.
  // `useId` emits colons, which browsers choke on inside `url(#...)`.
  const uid = React.useId().replace(/:/g, "");

  // The wipe is driven imperatively rather than by variants: parent variants
  // don't reach a motion child nested inside <defs>, so the mask would sit at
  // its finished frame and never animate. runId 0 is the resting state.
  const reveal = useMotionValue(runId === 0 ? 220 : 0);

  React.useEffect(() => {
    if (runId === 0) return;
    // `key` sits on the <svg>, so only the DOM remounts - this component (and
    // its motion value) survives. Rewind explicitly or a replay animates 220→220.
    reveal.set(0);
    const controls = animate(reveal, 220, {
      delay: 0.12,
      duration: 1,
      ease: EASE,
    });
    return () => controls.stop();
  }, [runId, reveal]);

  return (
    <svg
      key={runId}
      viewBox="0 0 220 90"
      preserveAspectRatio="none"
      className="h-[90px] w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id={`vis-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="var(--periwinkle)" stopOpacity="0.25" />
          <stop offset="1" stopColor="var(--periwinkle)" stopOpacity="0" />
        </linearGradient>
        {/* One left-to-right wipe uncovers the line and its area together, so
            the chart arrives as a single gesture rather than draw-then-fill. */}
        <mask id={`vis-reveal-${uid}`}>
          <motion.rect x="0" y="0" width={reveal} height="90" fill="#fff" />
        </mask>
      </defs>
      {[20, 45, 70].map((y) => (
        <line
          key={y}
          x1="0"
          x2="220"
          y1={y}
          y2={y}
          stroke="oklch(0.24 0.02 285 / 0.08)"
        />
      ))}
      <g mask={`url(#vis-reveal-${uid})`}>
        <path d={`${VIS_LINE}L216 90L4 90Z`} fill={`url(#vis-fill-${uid})`} />
        <path
          d={VIS_LINE}
          fill="none"
          stroke="var(--periwinkle)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

const ANSWER_WORDS =
  "Cult serums dominate the “best skincare” lists, but a simple cleanser-and-SPF routine is the smarter buy for most skin.".split(
    " ",
  );

function GhostAnswer({ runId }: { runId: number }) {
  return (
    <motion.div
      key={runId}
      className="flex h-[90px] flex-col justify-between"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      {/* the answer streams itself out, word by word */}
      <p className="text-[0.7rem] leading-relaxed text-foreground/45 transition-colors group-hover:text-foreground/70">
        {ANSWER_WORDS.map((word, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { delay: i * 0.035, duration: 0.2 },
              },
            }}
          >
            {word}
            {i < ANSWER_WORDS.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </p>
      {/* ...then the citation lands */}
      <motion.span
        className="label-mono inline-flex w-fit items-center gap-1 rounded-full bg-brand-soft px-2 py-1 text-[0.55rem] text-accent"
        variants={{
          hidden: { opacity: 0, y: 6 },
          show: {
            opacity: 1,
            y: 0,
            transition: {
              delay: ANSWER_WORDS.length * 0.035 + 0.25,
              duration: 0.35,
              ease: EASE,
            },
          },
        }}
      >
        yourbrand.com +2
      </motion.span>
    </motion.div>
  );
}

function GaugeNumber({ runId }: { runId: number }) {
  const count = useMotionValue(runId === 0 ? 72 : 0);
  const rounded = useTransform(count, (v) => Math.round(v));
  React.useEffect(() => {
    if (runId === 0) return;
    count.set(0);
    const controls = animate(count, 72, {
      delay: 0.1,
      duration: 1.1,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [runId, count]);
  return (
    <motion.span className="text-xl font-semibold tracking-tight tabular-nums text-foreground">
      {rounded}
    </motion.span>
  );
}

function SentimentGauge({ runId }: { runId: number }) {
  return (
    <div className="relative flex h-[90px] items-end justify-center">
      <motion.svg
        key={runId}
        viewBox="0 0 120 64"
        className="h-full"
        aria-hidden
        initial={runId === 0 ? false : "hidden"}
        animate="show"
      >
        <path
          d="M12 60A48 48 0 0 1 108 60"
          fill="none"
          stroke="oklch(0.24 0.02 285 / 0.08)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* the arc sweeps from 0 to 72 */}
        <motion.path
          d="M12 60A48 48 0 0 1 108 60"
          fill="none"
          stroke="var(--periwinkle)"
          strokeWidth="7"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0 },
            show: {
              pathLength: 0.72,
              transition: { delay: 0.1, duration: 1.1, ease: "easeOut" },
            },
          }}
        />
      </motion.svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <GaugeNumber runId={runId} />
        <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground/70">
          {" "}
          / 100
        </span>
      </div>
    </div>
  );
}

const FANOUT_QUERIES = [
  "best everyday cleanser nz",
  "spf moisturisers compared",
  "serums vs simple routines",
];

function MagnifierIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="size-2.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="5" cy="5" r="3.4" />
      <path d="M7.6 7.6L10.4 10.4" />
    </svg>
  );
}

function FanoutPeek({ runId }: { runId: number }) {
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] flex-col justify-center gap-1.5"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      {/* the question arrives... */}
      <motion.span
        // Full foreground, not /60: this chip is visible (not aria-hidden) and
        // at 10.4px the faded version measured 4.18:1, under the 4.5:1 AA floor.
        className="ml-auto w-fit rounded-full bg-secondary px-2.5 py-1 text-[0.65rem] text-foreground transition-colors"
        variants={{
          hidden: { opacity: 0, x: 14 },
          show: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.45, ease: EASE },
          },
        }}
      >
        &ldquo;best everyday skincare nz&rdquo;
      </motion.span>
      {/* ...the assistant searches... */}
      <motion.span
        className="flex items-center gap-1.5 text-[0.65rem] font-medium text-foreground/55 transition-colors group-hover:text-foreground/70"
        variants={{
          hidden: { opacity: 0, y: 4 },
          show: {
            opacity: 1,
            y: 0,
            transition: { delay: 0.35, duration: 0.35, ease: EASE },
          },
        }}
      >
        <span aria-hidden className="text-foreground/40">✓</span>
        Searched the web
        <span className="font-normal text-foreground/35">5 searches</span>
      </motion.span>
      {/* ...and fans out into follow-up queries */}
      {FANOUT_QUERIES.map((query, i) => (
        <motion.span
          key={query}
          className="flex items-center gap-1.5 text-[0.65rem] leading-none"
          variants={{
            hidden: { opacity: 0, y: 4 },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                delay: 0.55 + i * 0.14,
                duration: 0.35,
                ease: EASE,
              },
            },
          }}
        >
          <span className="text-foreground/30">
            <MagnifierIcon />
          </span>
          <span className="shrink-0 font-medium text-foreground/55 transition-colors group-hover:text-foreground/70">
            Searched web
          </span>
          <span className="truncate text-foreground/35 transition-colors group-hover:text-foreground/50">
            {query}
          </span>
        </motion.span>
      ))}
    </motion.div>
  );
}

export function MeasureVignette() {
  return (
    <Frame label="Measure · Overview">
      <div className="grid h-full grid-rows-[auto_1fr] gap-0">
        {/* top row: the three measurement surfaces */}
        <div className="grid gap-6 pb-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <HoverCell className="sm:pr-6">
            {(runId) => (
              <>
                <VisibilityLine runId={runId} />
                <TileCaption
                  title="Visibility"
                  sub="Rankings, share of voice and average position across AI platforms."
                />
              </>
            )}
          </HoverCell>
          <HoverCell className="sm:px-6">
            {(runId) => (
              <>
                <SentimentGauge runId={runId} />
                <TileCaption
                  title="Sentiment"
                  sub="How assistants frame you, measured across every model."
                />
              </>
            )}
          </HoverCell>
          <HoverCell className="sm:pl-6">
            {(runId) => (
              <>
                <GhostAnswer runId={runId} />
                <TileCaption
                  title="Citations"
                  sub="Every response, mention trend and the sources AI leans on."
                />
              </>
            )}
          </HoverCell>
        </div>
        {/* bottom row: fanouts + the AEO insights editorial cell */}
        <div className="grid gap-6 border-t border-dashed border-border pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <HoverCell className="sm:pr-6">
            {(runId) => (
              <>
                <FanoutPeek runId={runId} />
                <TileCaption
                  title="Fanouts"
                  sub="The follow-up queries assistants run behind every answer."
                />
              </>
            )}
          </HoverCell>
          <EditorialCell title="AEO Insights" href="/platform#insights-surface">
            Understand what&rsquo;s actually driving your visibility. Every
            answer is scored, every citation traced, and every shift
            explained - so you can see which pages, sources and topics move
            your recommendation share, and where the next point of share
            will come from.
          </EditorialCell>
        </div>
      </div>
    </Frame>
  );
}

/* ── Strategy: insights → recommendations → the plan ── */

const INSIGHTS = [
  { tag: "Cited", text: "A retailer's page, not yours", focal: true },
  { tag: "Missing", text: "No 'best everyday' comparison", focal: false },
  { tag: "Slipping", text: "Sentiment on price questions", focal: false },
];

function InsightList({ runId }: { runId: number }) {
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] flex-col justify-center gap-2.5"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      {INSIGHTS.map(({ tag, text, focal }, i) => (
        <div key={text} className="flex items-center gap-2">
          {/* fixed-width slot keeps the insight text column aligned */}
          <span className="w-[3.6rem] shrink-0">
            {/* the tag lands first... */}
            <motion.span
              className={cn(
                "label-mono inline-flex rounded-full px-1.5 py-0.5 text-[0.5rem] leading-none",
                focal
                  ? "bg-brand-soft text-accent"
                  : "bg-secondary text-foreground/40",
              )}
              variants={{
                hidden: { opacity: 0, scale: 0.6 },
                show: {
                  opacity: 1,
                  scale: 1,
                  transition: { delay: i * 0.18, duration: 0.35, ease: EASE },
                },
              }}
            >
              {tag}
            </motion.span>
          </span>
          {/* ...then its finding slides in behind it */}
          <motion.span
            className={cn(
              "truncate text-[0.7rem]",
              focal ? "text-foreground/70" : "text-foreground/35",
            )}
            variants={{
              hidden: { opacity: 0, x: 8 },
              show: {
                opacity: 1,
                x: 0,
                transition: {
                  delay: i * 0.18 + 0.1,
                  duration: 0.4,
                  ease: EASE,
                },
              },
            }}
          >
            {text}
          </motion.span>
        </div>
      ))}
    </motion.div>
  );
}

function RecommendationList({ runId }: { runId: number }) {
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] flex-col justify-center gap-1.5"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      {/* the ranked cards settle into place top-down... */}
      <motion.div
        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 py-2 shadow-[0_1px_2px_0_rgba(40,30,70,0.05)]"
        variants={{
          hidden: { opacity: 0, y: 12 },
          show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: EASE },
          },
        }}
      >
        <span className="truncate text-[0.7rem] font-medium leading-none text-foreground">
          1 · Own &ldquo;best for everyday&rdquo;
        </span>
        {/* ...and the priority stamp lands last */}
        <motion.span
          className="label-mono shrink-0 rounded-full bg-brand-soft px-1.5 py-0.5 text-[0.5rem] leading-none text-accent"
          variants={{
            hidden: { opacity: 0, scale: 0.5 },
            show: {
              opacity: 1,
              scale: 1,
              transition: { delay: 0.6, duration: 0.3, ease: EASE },
            },
          }}
        >
          High
        </motion.span>
      </motion.div>
      {["2 · Add Product & FAQ schema", "3 · Answer the price question"].map(
        (move, i) => (
          <motion.div
            key={move}
            className="truncate rounded-lg border border-border/60 bg-card px-3.5 py-2 text-[0.7rem] leading-none text-foreground/35"
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.18 + i * 0.15,
                  duration: 0.45,
                  ease: EASE,
                },
              },
            }}
          >
            {move}
          </motion.div>
        ),
      )}
    </motion.div>
  );
}

const GANTT_BARS = [
  { left: "0%", width: "38%", focal: true },
  { left: "24%", width: "30%", focal: false },
  { left: "42%", width: "34%", focal: false },
  { left: "64%", width: "30%", focal: false },
];

function PlanGantt({ runId }: { runId: number }) {
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] flex-col justify-center"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      <motion.div
        className="flex justify-between font-mono text-[0.55rem] uppercase tracking-widest text-foreground/35"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.3 } },
        }}
      >
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
      </motion.div>
      <div className="relative mt-2 flex flex-col gap-2.5">
        {/* month gridlines */}
        <motion.div
          aria-hidden
          className="absolute inset-y-0 left-1/2 border-l border-dashed border-border"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { delay: 0.2, duration: 0.3 } },
          }}
        />
        {/* the quarter schedules itself, each bar sweeping across its slot */}
        {GANTT_BARS.map(({ left, width, focal }, i) => (
          <div key={i} className="relative h-2">
            <motion.div
              className={cn(
                "absolute inset-y-0 origin-left rounded-full",
                focal ? "bg-periwinkle" : "bg-foreground/10",
              )}
              style={{ left, width }}
              variants={{
                hidden: { scaleX: 0 },
                show: {
                  scaleX: 1,
                  transition: {
                    delay: 0.25 + i * 0.13,
                    duration: 0.55,
                    ease: EASE,
                  },
                },
              }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ImpactMatrix({ runId }: { runId: number }) {
  const dots = [
    { left: "18%", top: "22%", focal: true },
    { left: "44%", top: "46%", focal: false },
    { left: "66%", top: "30%", focal: false },
    { left: "34%", top: "68%", focal: false },
    { left: "76%", top: "64%", focal: false },
  ];
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] items-center gap-4"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      <motion.div
        className="relative aspect-square h-full rounded-lg border border-border/60"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.3 } },
        }}
      >
        <div
          aria-hidden
          className="absolute inset-y-0 left-1/2 border-l border-dashed border-border/60"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-1/2 border-t border-dashed border-border/60"
        />
        {/* each move gets scored onto the grid; the winner plots last */}
        {dots.map(({ left, top, focal }, i) => (
          <motion.span
            key={i}
            className={cn(
              "absolute size-2 rounded-full",
              focal ? "bg-periwinkle" : "bg-foreground/15",
            )}
            style={{ left, top, x: "-50%", y: "-50%" }}
            variants={{
              hidden: { opacity: 0, scale: 0 },
              show: {
                opacity: 1,
                scale: 1,
                transition: {
                  delay: focal ? 0.85 : 0.25 + i * 0.12,
                  type: "spring",
                  stiffness: 420,
                  damping: focal ? 14 : 22,
                },
              },
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="font-mono text-[0.55rem] uppercase leading-relaxed tracking-widest text-foreground/35"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { delay: 0.15, duration: 0.35 } },
        }}
      >
        Impact
        <br />×<br />
        Effort
      </motion.div>
    </motion.div>
  );
}

export function StrategyVignette() {
  return (
    <Frame label="Strategy · Action plan">
      <div className="grid h-full grid-rows-[auto_1fr] gap-0">
        {/* top row: the pipeline, left to right */}
        <div className="grid gap-6 pb-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <HoverCell className="sm:pr-6">
            {(runId) => (
              <>
                <InsightList runId={runId} />
                <TileCaption
                  title="Insights"
                  sub="What the measurement surfaced - cited, missing, slipping."
                />
              </>
            )}
          </HoverCell>
          <HoverCell className="sm:px-6">
            {(runId) => (
              <>
                <RecommendationList runId={runId} />
                <TileCaption
                  title="Recommendations"
                  sub="Ranked moves with the why attached, never vibes."
                />
              </>
            )}
          </HoverCell>
          <HoverCell className="sm:pl-6">
            {(runId) => (
              <>
                <PlanGantt runId={runId} />
                <TileCaption
                  title="The plan"
                  sub="Sequenced into a quarter you can actually run."
                />
              </>
            )}
          </HoverCell>
        </div>
        {/* bottom row: scoring + the engine, editorially */}
        <div className="grid gap-6 border-t border-dashed border-border pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <HoverCell className="sm:pr-6">
            {(runId) => (
              <>
                <ImpactMatrix runId={runId} />
                <TileCaption
                  title="Impact × effort"
                  sub="Every move is scored before it's ranked."
                />
              </>
            )}
          </HoverCell>
          <EditorialCell title="The Strategy Engine" href="/strategy">
            Every recommendation is written from measured findings. Moves
            are scored on impact and effort, ranked, and sequenced into a
            plan - each step carrying the evidence it came from, so you
            always know why it&rsquo;s worth doing and what it should move.
          </EditorialCell>
        </div>
      </div>
    </Frame>
  );
}

/* ── Act: the plan becomes shipped, verified work ── */

const WORK_ITEMS = [
  { label: "Publish /best-everyday comparison", done: true, focal: true },
  { label: "Add Product & FAQ schema", done: true, focal: false },
  { label: "Rewrite the pricing FAQ", done: false, focal: false },
];

function WorkList({ runId }: { runId: number }) {
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] flex-col justify-center gap-2.5"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      {WORK_ITEMS.map(({ label, done, focal }, i) => (
        <motion.div
          key={label}
          className="flex items-center gap-2.5"
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: {
              opacity: 1,
              y: 0,
              transition: { delay: i * 0.1, duration: 0.35, ease: EASE },
            },
          }}
        >
          {/* the list arrives first; then the done boxes tick themselves off */}
          <span
            aria-hidden
            className={cn(
              "relative flex size-3.5 shrink-0 items-center justify-center overflow-hidden rounded border text-[0.5rem] leading-none",
              done ? "border-transparent" : "border-border bg-card",
            )}
          >
            {done ? (
              <>
                <motion.span
                  className={cn(
                    "absolute inset-0 rounded",
                    focal ? "bg-periwinkle" : "bg-foreground/15",
                  )}
                  variants={{
                    hidden: { scale: 0 },
                    show: {
                      scale: 1,
                      transition: {
                        delay: 0.5 + i * 0.3,
                        duration: 0.25,
                        ease: EASE,
                      },
                    },
                  }}
                />
                <motion.span
                  className={cn(
                    "relative",
                    focal ? "text-foreground" : "text-card",
                  )}
                  variants={{
                    hidden: { opacity: 0, scale: 0.4 },
                    show: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        delay: 0.62 + i * 0.3,
                        duration: 0.2,
                        ease: EASE,
                      },
                    },
                  }}
                >
                  ✓
                </motion.span>
              </>
            ) : null}
          </span>
          <span
            className={cn(
              "truncate text-[0.7rem]",
              focal ? "text-foreground/70" : "text-foreground/35",
            )}
          >
            {label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

const LANDING_STEPS = [
  { label: "Shipped", time: "09:12", focal: false },
  { label: "Fetched", time: "11:47", focal: false },
  { label: "Re-answered", time: "Jun 21", focal: true },
];

function LandingSteps({ runId }: { runId: number }) {
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] flex-col justify-center"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      <div className="relative flex items-center justify-between">
        {/* the pipeline draws itself left to right... */}
        <motion.div
          aria-hidden
          className="absolute inset-x-2 top-1/2 origin-left border-t border-dashed border-border"
          variants={{
            hidden: { scaleX: 0 },
            show: {
              scaleX: 1,
              transition: { duration: 0.9, ease: EASE },
            },
          }}
        />
        {/* ...each milestone lighting as it's reached, the re-answer landing
            with a springier pop */}
        {LANDING_STEPS.map(({ label, focal }, i) => (
          <motion.span
            key={label}
            aria-hidden
            className={cn(
              "relative size-2.5 rounded-full border",
              focal ? "border-transparent bg-periwinkle" : "border-border bg-card",
            )}
            variants={{
              hidden: { scale: 0, opacity: 0 },
              show: {
                scale: 1,
                opacity: 1,
                transition: {
                  delay: 0.1 + i * 0.35,
                  type: "spring",
                  stiffness: 420,
                  damping: focal ? 12 : 22,
                },
              },
            }}
          />
        ))}
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        {LANDING_STEPS.map(({ label, time, focal }, i) => (
          <motion.div
            key={label}
            className="min-w-0"
            variants={{
              hidden: { opacity: 0, y: 5 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.2 + i * 0.35,
                  duration: 0.3,
                  ease: EASE,
                },
              },
            }}
          >
            <p
              className={cn(
                "text-[0.7rem] font-medium",
                focal ? "text-foreground" : "text-foreground/40",
              )}
            >
              {label}
            </p>
            <p
              className={cn(
                "mt-0.5 font-mono text-[0.55rem]",
                focal ? "text-muted-foreground" : "text-foreground/30",
              )}
            >
              {time}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const VERIFY_ROWS = [
  { path: "/best-everyday", status: "Verified", live: true },
  { path: "/pricing-faq", status: "Pending", live: false },
  { path: "/product-schema", status: "Queued", live: false },
];

function VerifyList({ runId }: { runId: number }) {
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] flex-col justify-center gap-1.5"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      {VERIFY_ROWS.map(({ path, status, live }, i) => (
        <motion.div
          key={path}
          className={cn(
            "flex items-center justify-between gap-3 rounded-lg border bg-card px-3.5 py-2",
            live ? "border-border" : "border-border/60",
          )}
          variants={{
            hidden: { opacity: 0, x: 14 },
            show: {
              opacity: 1,
              x: 0,
              transition: { delay: i * 0.15, duration: 0.4, ease: EASE },
            },
          }}
        >
          <span
            className={cn(
              "truncate font-mono text-[0.65rem] leading-none",
              live ? "text-foreground/80" : "text-foreground/35",
            )}
          >
            {path}
          </span>
          {/* the verified stamp lands hardest; the queue just fades in */}
          <motion.span
            className={cn(
              "label-mono shrink-0 rounded-full px-1.5 py-0.5 text-[0.5rem] leading-none",
              live ? "bg-brand-soft text-accent" : "bg-secondary text-foreground/40",
            )}
            variants={
              live
                ? {
                    hidden: { opacity: 0, scale: 0.4 },
                    show: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        delay: 0.55,
                        type: "spring",
                        stiffness: 420,
                        damping: 13,
                      },
                    },
                  }
                : {
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { delay: i * 0.15 + 0.25, duration: 0.25 },
                    },
                  }
            }
          >
            {status}
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  );
}

function AnswerShift({ runId }: { runId: number }) {
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] flex-col justify-center gap-3"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.35 } },
        }}
      >
        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-foreground/35">
          Before
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="h-2 w-[55%] rounded-full bg-foreground/10" />
          <div className="h-2 w-[20%] rounded-full bg-foreground/10" />
        </div>
      </motion.div>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { delay: 0.35, duration: 0.35 } },
        }}
      >
        <p className="font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground">
          After
        </p>
        <div className="mt-1.5 flex items-center gap-1.5">
          {/* the rewritten answer assembles around the brand: bars slide in
              from either side, then the mention splices itself in between */}
          <motion.div
            className="h-2 w-[30%] rounded-full bg-foreground/10"
            variants={{
              hidden: { opacity: 0, x: -10 },
              show: {
                opacity: 1,
                x: 0,
                transition: { delay: 0.55, duration: 0.4, ease: EASE },
              },
            }}
          />
          <motion.span
            className="label-mono rounded-full bg-brand-soft px-2 py-0.5 text-[0.5rem] leading-none text-accent"
            variants={{
              hidden: { opacity: 0, scale: 0.3 },
              show: {
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 0.95,
                  type: "spring",
                  stiffness: 380,
                  damping: 13,
                },
              },
            }}
          >
            yourbrand
          </motion.span>
          <motion.div
            className="h-2 w-[24%] rounded-full bg-foreground/10"
            variants={{
              hidden: { opacity: 0, x: 10 },
              show: {
                opacity: 1,
                x: 0,
                transition: { delay: 0.65, duration: 0.4, ease: EASE },
              },
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ActVignette() {
  return (
    <Frame label="Act · Implementation">
      <div className="grid h-full grid-rows-[auto_1fr] gap-0">
        {/* top row: work → landing → verification */}
        <div className="grid gap-6 pb-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <HoverCell className="sm:pr-6">
            {(runId) => (
              <>
                <WorkList runId={runId} />
                <TileCaption
                  title="Work items"
                  sub="The plan broken into concrete, owned tasks."
                />
              </>
            )}
          </HoverCell>
          <HoverCell className="sm:px-6">
            {(runId) => (
              <>
                <LandingSteps runId={runId} />
                <TileCaption
                  title="Watch it land"
                  sub="From ship, to crawl, to a changed answer - within days."
                />
              </>
            )}
          </HoverCell>
          <HoverCell className="sm:pl-6">
            {(runId) => (
              <>
                <VerifyList runId={runId} />
                <TileCaption
                  title="Verified live"
                  sub="Every change checked in production before it counts."
                />
              </>
            )}
          </HoverCell>
        </div>
        {/* bottom row: the answer shift + editorial */}
        <div className="grid gap-6 border-t border-dashed border-border pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <HoverCell className="sm:pr-6">
            {(runId) => (
              <>
                <AnswerShift runId={runId} />
                <TileCaption
                  title="The answer moves"
                  sub="The work shows up in the words assistants use."
                />
              </>
            )}
          </HoverCell>
          <EditorialCell title="Act on the strategy" href="/strategy#verify">
            A plan only counts once it ships. Each move becomes tracked
            work: HeyOtis watches the crawlers pick up the change, verifies
            it&rsquo;s live in production, and confirms the answer actually
            moved - so acting is measured, never assumed.
          </EditorialCell>
        </div>
      </div>
    </Frame>
  );
}

/* ── Attribute: the lift, receipts attached ── */

function StepChart({ runId }: { runId: number }) {
  /* The share responding to the shipped move: flat, then climbing. The
     dashed marker is the ship date; the area fill grounds the line. One
     left-to-right wipe uncovers the whole story (same gesture as the
     Measure visibility chart). */
  const uid = React.useId().replace(/:/g, "");
  const reveal = useMotionValue(runId === 0 ? 300 : 0);

  React.useEffect(() => {
    if (runId === 0) return;
    reveal.set(0);
    const controls = animate(reveal, 300, {
      delay: 0.3,
      duration: 1.1,
      ease: EASE,
    });
    return () => controls.stop();
  }, [runId, reveal]);

  const line =
    "M0 48C34 48 62 47 92 44C122 41 148 30 192 21C232 13 268 8 300 6";
  return (
    <svg
      key={runId}
      viewBox="0 0 300 64"
      preserveAspectRatio="none"
      className="h-16 w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id={`lift-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="var(--periwinkle)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--periwinkle)" stopOpacity="0" />
        </linearGradient>
        <mask id={`lift-reveal-${uid}`}>
          <motion.rect x="0" y="0" width={reveal} height="64" fill="#fff" />
        </mask>
      </defs>
      {[24, 48].map((y) => (
        <line
          key={y}
          x1="0"
          x2="300"
          y1={y}
          y2={y}
          stroke="oklch(0.24 0.02 285 / 0.07)"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <g mask={`url(#lift-reveal-${uid})`}>
        <path d={`${line}L300 64L0 64Z`} fill={`url(#lift-fill-${uid})`} />
        <line
          x1="92"
          y1="8"
          x2="92"
          y2="60"
          stroke="oklch(0.24 0.02 285 / 0.18)"
          strokeDasharray="3 4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={line}
          fill="none"
          stroke="var(--periwinkle)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="92" cy="44" r="3" fill="var(--periwinkle)" />
        <circle cx="297" cy="6" r="3.5" fill="var(--periwinkle)" />
      </g>
    </svg>
  );
}

/* The headline share climbs from its before-value to its after-value while
   the chart wipe replays the same story underneath. */
function LiftNumber({ runId }: { runId: number }) {
  const count = useMotionValue(runId === 0 ? 4.9 : 1.4);
  const text = useTransform(count, (v) => v.toFixed(1));
  React.useEffect(() => {
    if (runId === 0) return;
    count.set(1.4);
    const controls = animate(count, 4.9, {
      delay: 0.15,
      duration: 1.2,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [runId, count]);
  return <motion.span>{text}</motion.span>;
}

function LiftStat({ runId }: { runId: number }) {
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] flex-col justify-center gap-2.5"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      <div className="flex items-center gap-2.5">
        <span className="font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground">
          <LiftNumber runId={runId} />%
        </span>
        {/* the delta stamp lands once the number has climbed */}
        <motion.span
          className="inline-flex items-center gap-1 rounded-full bg-salmon px-2.5 py-1 text-[0.7rem] font-semibold leading-none tracking-tight text-foreground"
          variants={{
            hidden: { opacity: 0, scale: 0.5 },
            show: {
              opacity: 1,
              scale: 1,
              transition: {
                delay: 1.25,
                type: "spring",
                stiffness: 400,
                damping: 14,
              },
            },
          }}
        >
          <span aria-hidden className="text-[0.55rem]">▲</span>
          3.5 pts
        </motion.span>
      </div>
      <StepChart runId={runId} />
    </motion.div>
  );
}

const LEDGERS = [
  { tag: "Web", line: "chatgpt.com referral sessions", value: "▲ 96%", focal: true },
  { tag: "Bots", line: "GPTBot fetches of changed pages", value: "▲ 3.1×", focal: false },
];

function LedgerRows({ runId }: { runId: number }) {
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] flex-col justify-center gap-2"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      {/* the two ledgers post one after the other, each delta stamping in
          once its row has landed */}
      {LEDGERS.map(({ tag, line, value, focal }, i) => (
        <motion.div
          key={tag}
          className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card px-3.5 py-2.5"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: {
              opacity: 1,
              y: 0,
              transition: { delay: i * 0.25, duration: 0.4, ease: EASE },
            },
          }}
        >
          <span className="label-mono shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[0.5rem] leading-none text-foreground/50">
            {tag}
          </span>
          <span
            className={cn(
              "min-w-0 truncate text-[0.7rem] leading-none",
              focal ? "text-foreground/70" : "text-foreground/40",
            )}
          >
            {line}
          </span>
          <motion.span
            className={cn(
              "ml-auto shrink-0 text-[0.7rem] font-semibold tabular-nums leading-none",
              focal ? "text-foreground" : "text-foreground/45",
            )}
            variants={{
              hidden: { opacity: 0, scale: 0.5 },
              show: {
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 0.4 + i * 0.25,
                  type: "spring",
                  stiffness: 400,
                  damping: focal ? 13 : 20,
                },
              },
            }}
          >
            {value}
          </motion.span>
        </motion.div>
      ))}
    </motion.div>
  );
}

const RECEIPTS = [
  ["09:41", "GPTBot GET /best-everyday · 200"],
  ["09:58", "Session · chatgpt.com → /pricing"],
  ["10:04", "Order #48211 · first-touch: ChatGPT"],
];

function ReceiptTrail({ runId }: { runId: number }) {
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] flex-col justify-center"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      <div className="flex flex-col divide-y divide-dashed divide-border/70 rounded-lg border border-border/60 bg-card">
        {/* log lines append top-down, like tailing the event stream; the
            newest (the order) lands last and darkest */}
        {RECEIPTS.map(([time, line], i) => (
          <motion.div
            key={time}
            className={cn(
              "flex items-baseline gap-2.5 px-3 py-[7px] font-mono text-[0.6rem] leading-none",
              i === RECEIPTS.length - 1
                ? "text-foreground/70"
                : "text-foreground/30",
            )}
            variants={{
              hidden: { opacity: 0, x: -8 },
              show: {
                opacity: 1,
                x: 0,
                transition: {
                  delay: 0.15 + i * 0.35,
                  duration: 0.3,
                  ease: EASE,
                },
              },
            }}
          >
            <span className="tabular-nums">{time}</span>
            <span className="truncate">{line}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const WATERFALL_BARS = [
  { x: 10, y: 48, height: 16, fill: "oklch(0.24 0.02 285 / 0.12)", opacity: 1 },
  { x: 90, y: 26, height: 22, fill: "var(--periwinkle)", opacity: 0.55 },
  { x: 170, y: 10, height: 16, fill: "var(--periwinkle)", opacity: 0.55 },
  { x: 250, y: 10, height: 54, fill: "var(--periwinkle)", opacity: 1 },
];

function CauseEffectWaterfall({ runId }: { runId: number }) {
  /* The lift as a waterfall: before, plus each shipped move's measured
     contribution, landing on after. Deterministic attribution, drawn -
     each contribution stacks up in turn, its connector carrying the level
     across, and the after-bar lands with a settle. */
  const barDelay = (i: number) => 0.1 + i * 0.3;
  return (
    <motion.div
      key={runId}
      className="flex h-[104px] flex-col justify-center"
      initial={runId === 0 ? false : "hidden"}
      animate="show"
    >
      <svg viewBox="0 0 300 64" className="h-16 w-full" aria-hidden>
        {[
          { x1: 60, x2: 90, y: 48 },
          { x1: 140, x2: 170, y: 26 },
          { x1: 220, x2: 250, y: 10 },
        ].map(({ x1, x2, y }, i) => (
          <motion.line
            key={x1}
            x1={x1}
            x2={x2}
            y1={y}
            y2={y}
            stroke="oklch(0.24 0.02 285 / 0.25)"
            strokeDasharray="3 3"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { delay: barDelay(i) + 0.25, duration: 0.25 },
              },
            }}
          />
        ))}
        {WATERFALL_BARS.map(({ x, y, height, fill, opacity }, i) => (
          <motion.rect
            key={x}
            x={x}
            y={y}
            width="50"
            height={height}
            rx="2"
            fill={fill}
            fillOpacity={opacity}
            style={{ transformBox: "fill-box", originY: 1 }}
            variants={{
              hidden: { scaleY: 0 },
              show: {
                scaleY: 1,
                transition:
                  i === WATERFALL_BARS.length - 1
                    ? {
                        delay: barDelay(i),
                        type: "spring",
                        stiffness: 320,
                        damping: 18,
                      }
                    : { delay: barDelay(i), duration: 0.4, ease: EASE },
              },
            }}
          />
        ))}
      </svg>
      <div className="mt-2 flex font-mono text-[0.5rem] uppercase tracking-wider text-foreground/40">
        {["1.4%", "+1.8", "+1.7", "4.9%"].map((label, i) => (
          <motion.span
            key={label}
            className={cn(
              "w-1/4",
              i === 1 || i === 2 ? "text-center" : "",
              i === 3 ? "text-right font-semibold text-foreground/70" : "",
            )}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { delay: barDelay(i) + 0.15, duration: 0.3 },
              },
            }}
          >
            {label}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export function AttributeVignette() {
  return (
    <Frame label="Attribute · 30-day window">
      <div className="grid h-full grid-rows-[auto_1fr] gap-0">
        {/* top row: the lift → the two ledgers → the receipts */}
        <div className="grid gap-6 pb-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <HoverCell className="sm:pr-6">
            {(runId) => (
              <>
                <LiftStat runId={runId} />
                <TileCaption
                  title="The lift"
                  sub="Recommendation share, before and after the work shipped."
                />
              </>
            )}
          </HoverCell>
          <HoverCell className="sm:px-6">
            {(runId) => (
              <>
                <LedgerRows runId={runId} />
                <TileCaption
                  title="Two ledgers"
                  sub="Web analytics and agent analytics, joined in one record."
                />
              </>
            )}
          </HoverCell>
          <HoverCell className="sm:pl-6">
            {(runId) => (
              <>
                <ReceiptTrail runId={runId} />
                <TileCaption
                  title="The receipts"
                  sub="Every number traces back to a logged event."
                />
              </>
            )}
          </HoverCell>
        </div>
        {/* bottom row: cause-and-effect + editorial */}
        <div className="grid gap-6 border-t border-dashed border-border pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-dashed sm:divide-border">
          <HoverCell className="sm:pr-6">
            {(runId) => (
              <>
                <CauseEffectWaterfall runId={runId} />
                <TileCaption
                  title="Cause, then effect"
                  sub="The lift, decomposed into the moves that caused it."
                />
              </>
            )}
          </HoverCell>
          <EditorialCell title="Deterministic attribution" href="/platform#analytics-surface">
            No modelled guesswork. Web analytics and agent analytics are
            joined into one deterministic record, so every lift is
            attributed to the move that caused it - and what worked feeds
            straight back into the next plan. That&rsquo;s the feedback
            loop, compounding.
          </EditorialCell>
        </div>
      </div>
    </Frame>
  );
}
