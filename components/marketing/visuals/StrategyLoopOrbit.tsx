"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
} from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { LogoGlyph } from "@/components/marketing/Logo";
import { LOOP_STAGES } from "@/lib/strategy-content";
import {
  EASE,
  VIGNETTES,
} from "@/components/marketing/visuals/strategy-loop-vignettes";
import { cn } from "@/lib/utils";

/* Stage i sits at −90° + i·60° on a ring of radius 38 (viewBox 0 0 100 100). */
const POS = [
  { x: 50, y: 12 },
  { x: 82.9, y: 31 },
  { x: 82.9, y: 69 },
  { x: 50, y: 88 },
  { x: 17.1, y: 69 },
  { x: 17.1, y: 31 },
] as const;

/* Full ring drawn clockwise from the top — the progress arc fills this path. */
const RING =
  "M 50 12 A 38 38 0 0 1 88 50 A 38 38 0 0 1 50 88 A 38 38 0 0 1 12 50 A 38 38 0 0 1 50 12";
/* The Verify→Prove segment (θ 125°→235°) — the differentiator arc. */
const DIFF_ARC = "M 28.2 81.1 A 38 38 0 0 1 28.2 18.9";
/* Prove→Measure chord — evidence returning for the next measure. */
const FEEDBACK = "M 17.1 31 Q 50 47 82.9 31";

/* Six stage beats + the feedback beat that closes the loop (~22s cycle). */
const STEP_MS = [3000, 3200, 3200, 3000, 3600, 3800, 2200] as const;
const FEEDBACK_STEP = 6;
/* Reduced-motion static frame freezes on Diagnose — mid-loop, most legible. */
const STATIC_STEP = 2;

/**
 * The self-improving loop, played rather than described: a timer steps
 * through the six stages, each playing a miniature product moment in the
 * center screen while its node glows and the ring arc fills; a feedback
 * beat then carries the evidence back from Prove to Measure and the cycle
 * restarts. The diagram is decorative (aria-hidden); the legend list is the
 * semantic content. `compact` shrinks the orbit and drops the stage blurbs
 * (home-page variant). Reduced motion: a static composed frame, no timers.
 */
export function StrategyLoopOrbit({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const reduced = useIsomorphicReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const markerId = React.useId();
  const playing = !reduced && inView;

  const [rawStep, setRawStep] = React.useState(0);
  React.useEffect(() => {
    if (!playing) return;
    const id = setTimeout(
      () => setRawStep((s) => (s + 1) % STEP_MS.length),
      STEP_MS[rawStep],
    );
    return () => clearTimeout(id);
  }, [playing, rawStep]);

  const step = reduced ? STATIC_STEP : rawStep;
  const stage = step === FEEDBACK_STEP ? 5 : step;
  const Vignette = VIGNETTES[LOOP_STAGES[stage].id];

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <div
        ref={ref}
        className={cn(
          "grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16",
          className,
        )}
      >
        <div
          aria-hidden
          className={cn(
            "relative mx-auto aspect-square w-full",
            compact ? "max-w-[400px]" : "max-w-[480px]",
          )}
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            fill="none"
          >
            <path d={RING} stroke="var(--border)" strokeWidth="1.2" />
            <path
              d={DIFF_ARC}
              stroke="var(--brand)"
              strokeOpacity="0.55"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {reduced ? (
              <path
                d={RING}
                pathLength={1}
                strokeDasharray={`${STATIC_STEP / 6} ${1 - STATIC_STEP / 6}`}
                stroke="var(--brand)"
                strokeOpacity="0.9"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <motion.path
                d={RING}
                stroke="var(--brand)"
                strokeWidth="1.8"
                strokeLinecap="round"
                initial={false}
                animate={{
                  pathLength:
                    step === FEEDBACK_STEP ? 1 : Math.max(step / 6, 0.0001),
                  /* Invisible at Define (nothing completed yet) and while
                     fading out during the feedback beat's reset. */
                  opacity: step === 0 || step === FEEDBACK_STEP ? 0 : 0.9,
                }}
                transition={{
                  pathLength:
                    step === 0
                      ? { duration: 0 }
                      : { duration: 0.7, ease: EASE },
                  opacity:
                    step === FEEDBACK_STEP
                      ? { duration: 1.2, delay: 0.8 }
                      : { duration: 0.3 },
                }}
              />
            )}
            <defs>
              <marker
                id={markerId}
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--brand-strong)" />
              </marker>
            </defs>
            {/* Group opacity (not stroke-opacity) so the arrowhead marker
                dims together with the dashed chord outside the feedback beat. */}
            <path
              d={FEEDBACK}
              stroke="var(--brand-strong)"
              opacity={step === FEEDBACK_STEP ? 0.8 : 0.3}
              strokeWidth="1.4"
              strokeDasharray="3 3"
              markerEnd={`url(#${markerId})`}
              className={cn(
                "transition-opacity duration-500",
                playing && step === FEEDBACK_STEP && "orbit-dash",
              )}
            />
            {playing && step === FEEDBACK_STEP ? (
              <circle r="1.7" fill="var(--brand-strong)">
                <animateMotion
                  dur="1.8s"
                  repeatCount="1"
                  fill="freeze"
                  path={FEEDBACK}
                />
              </circle>
            ) : null}
          </svg>

          {LOOP_STAGES.map((s, i) => {
            const Icon = s.icon;
            const isActive = !reduced && i === stage;
            const isDone =
              !reduced && (step === FEEDBACK_STEP ? i < 5 : i < stage);
            return (
              <div
                key={s.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${POS[i].x}%`, top: `${POS[i].y}%` }}
              >
                <div className="flex flex-col items-center gap-1">
                  <motion.span
                    initial={false}
                    animate={{ scale: isActive ? 1.12 : 1 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className={cn(
                      "flex items-center justify-center rounded-xl shadow-sm ring-1",
                      "transition-[color,background-color,box-shadow] duration-300",
                      compact ? "size-10" : "size-11",
                      isActive
                        ? "bg-brand/15 ring-brand/60 shadow-[0_0_18px_-2px_var(--brand)]"
                        : isDone
                          ? "bg-brand/10 ring-brand/30"
                          : cn(
                              "bg-card ring-border",
                              reduced &&
                                s.differentiator &&
                                "bg-brand/10 ring-brand/40",
                            ),
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 transition-colors duration-300",
                        isActive || isDone || reduced
                          ? "text-accent"
                          : "text-muted-foreground",
                      )}
                      strokeWidth={1.75}
                    />
                  </motion.span>
                  <span
                    className={cn(
                      "text-[0.7rem] font-semibold transition-colors duration-300",
                      isActive ? "text-accent" : "text-foreground",
                    )}
                  >
                    {s.verb}
                  </span>
                </div>
              </div>
            );
          })}

          <div className="absolute left-1/2 top-1/2 w-[48%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-border bg-card shadow-md">
            <div className="flex items-center gap-1.5 border-b border-border px-2.5 py-1.5">
              <span className="flex size-4 items-center justify-center rounded bg-surface-dark">
                <LogoGlyph className="h-2.5 w-2.5" />
              </span>
              <span className="label-mono text-[0.5rem] text-muted-foreground">
                strategy engine
              </span>
              <span className="label-mono ml-auto text-[0.5rem] tabular-nums text-accent">
                {String(stage + 1).padStart(2, "0")}/06
              </span>
            </div>
            <div
              className={cn("relative", compact ? "h-[116px]" : "h-[140px]")}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="absolute inset-0"
                >
                  <Vignette />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {step === FEEDBACK_STEP ? (
              <motion.span
                key="feedback-pill"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute left-1/2 top-[24%] flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5"
              >
                <RefreshCw className="size-3 text-accent" />
                <span className="label-mono whitespace-nowrap text-[0.55rem] text-accent">
                  evidence feeds back
                </span>
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>

        <ol className={cn("flex flex-col", compact ? "gap-2.5" : "gap-4")}>
          {LOOP_STAGES.map((s, i) => {
            const isActive = !reduced && i === stage;
            return (
              <li
                key={s.id}
                className={cn(
                  "flex items-baseline gap-3 transition-opacity duration-300",
                  !reduced && !isActive && "opacity-55",
                )}
              >
                <span
                  className={cn(
                    "label-mono text-xs transition-colors duration-300",
                    isActive ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  {String(s.n).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-semibold tracking-tight text-foreground">
                    <span className="text-accent">{s.verb}.</span> {s.title}
                    {s.differentiator ? (
                      <span className="label-mono ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[0.55rem] text-accent">
                        what others skip
                      </span>
                    ) : null}
                  </p>
                  {!compact ? (
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {s.blurb}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </MotionConfig>
  );
}
