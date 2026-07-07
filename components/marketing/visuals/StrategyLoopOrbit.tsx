"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { LogoGlyph } from "@/components/marketing/Logo";
import { LOOP_STAGES } from "@/lib/strategy-content";
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

/* Full ring drawn clockwise from the top — the pulse travels this path. */
const RING =
  "M 50 12 A 38 38 0 0 1 88 50 A 38 38 0 0 1 50 88 A 38 38 0 0 1 12 50 A 38 38 0 0 1 50 12";
/* The Verify→Prove segment (θ 125°→235°) — the differentiator arc. */
const DIFF_ARC = "M 28.2 81.1 A 38 38 0 0 1 28.2 18.9";
/* Prove→Measure chord — the evidence returning for the next measure. */
const FEEDBACK = "M 17.1 31 Q 50 47 82.9 31";

/**
 * The self-improving loop as an actual cycle: six stages on a ring, a pulse
 * traveling it, the Verify/Prove arc emphasized, and the Prove→Measure
 * feedback chord that makes "it compounds" visible. The orbit is decorative
 * (aria-hidden); the legend list is the semantic content. `compact` shrinks
 * the orbit and drops the stage blurbs (home-page variant).
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
  const animate = !reduced && inView;

  return (
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
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none">
          <path d={RING} stroke="var(--border)" strokeWidth="1.2" />
          <path
            d={DIFF_ARC}
            stroke="var(--brand)"
            strokeOpacity="0.55"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--brand-strong)" />
            </marker>
          </defs>
          <path
            d={FEEDBACK}
            stroke="var(--brand-strong)"
            strokeOpacity="0.7"
            strokeWidth="1.4"
            strokeDasharray="3 3"
            markerEnd={`url(#${markerId})`}
            className={animate ? "orbit-dash" : undefined}
          />
          {animate ? (
            <circle r="2" fill="var(--brand-strong)">
              <animateMotion dur="16s" repeatCount="indefinite" path={RING} />
            </circle>
          ) : null}
        </svg>

        <span className="absolute left-1/2 top-[34%] flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5">
          <RefreshCw className="size-3 text-accent" />
          <span className="label-mono whitespace-nowrap text-[0.55rem] text-accent">
            evidence feeds back
          </span>
        </span>

        <div className="absolute left-1/2 top-[54%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-surface-dark shadow-lg">
            <LogoGlyph className="h-6 w-6" />
          </span>
          <span className="label-mono text-[0.6rem] text-muted-foreground">
            strategy engine
          </span>
        </div>

        {LOOP_STAGES.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${POS[i].x}%`, top: `${POS[i].y}%` }}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex items-center justify-center rounded-xl bg-card shadow-sm ring-1",
                    compact ? "size-10" : "size-11",
                    stage.differentiator
                      ? "bg-brand/10 ring-brand/40"
                      : "ring-border",
                  )}
                >
                  <Icon className="size-5 text-accent" strokeWidth={1.75} />
                </span>
                <span className="text-[0.7rem] font-semibold text-foreground">
                  {stage.verb}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <ol className={cn("flex flex-col", compact ? "gap-2.5" : "gap-4")}>
        {LOOP_STAGES.map((stage) => (
          <li key={stage.id} className="flex items-baseline gap-3">
            <span className="label-mono text-xs text-muted-foreground">
              {String(stage.n).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-foreground">
                <span className="text-accent">{stage.verb}.</span> {stage.title}
                {stage.differentiator ? (
                  <span className="label-mono ml-2 rounded-full bg-brand/10 px-2 py-0.5 text-[0.55rem] text-accent">
                    what others skip
                  </span>
                ) : null}
              </p>
              {!compact ? (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {stage.blurb}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
