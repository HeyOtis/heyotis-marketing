"use client";

import * as React from "react";
import { ListChecks } from "lucide-react";
import { useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { LogoGlyph } from "@/components/marketing/Logo";
import { SIGNAL_STREAMS } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

const Node = React.forwardRef<
  HTMLDivElement,
  { className?: string; children: React.ReactNode }
>(({ className, children }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-10 flex size-12 items-center justify-center rounded-2xl border border-border bg-card shadow-[0_8px_24px_-12px_rgba(40,30,70,0.4)]",
      className,
    )}
  >
    {children}
  </div>
));
Node.displayName = "IntakeNode";

const CURVES = [-84, -42, 0, 42, 84];

/**
 * The five signal streams converging into the engine core, which emits ranked
 * moves. Decorative (aria-hidden) — the section's semantic stream list carries
 * the content. Beams mount only in view and never under reduced motion,
 * matching AiSourceBeam.
 */
export function SignalIntake({ className }: { className?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const coreRef = React.useRef<HTMLDivElement>(null);
  const outRef = React.useRef<HTMLDivElement>(null);
  const s0 = React.useRef<HTMLDivElement>(null);
  const s1 = React.useRef<HTMLDivElement>(null);
  const s2 = React.useRef<HTMLDivElement>(null);
  const s3 = React.useRef<HTMLDivElement>(null);
  const s4 = React.useRef<HTMLDivElement>(null);
  function streamRef(i: number) {
    switch (i) {
      case 0:
        return s0;
      case 1:
        return s1;
      case 2:
        return s2;
      case 3:
        return s3;
      default:
        return s4;
    }
  }
  const reduced = useIsomorphicReducedMotion();
  const inView = useInView(containerRef, { margin: "0px" });

  const beam = {
    gradientStartColor: "oklch(0.72 0.1 280)",
    gradientStopColor: "oklch(0.5 0.16 280)",
    pathColor: "oklch(0.5 0.02 285)",
    pathOpacity: 0.12,
    duration: 4,
  };

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "relative mx-auto flex h-[400px] w-full max-w-xl items-center justify-between px-2 sm:px-6",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        {SIGNAL_STREAMS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center gap-2.5">
              <Node
                ref={streamRef(i)}
                className={cn(
                  s.differentiator && "border-transparent ring-2 ring-brand/40",
                )}
              >
                <Icon className="size-5 text-accent" strokeWidth={1.75} />
              </Node>
              <span className="text-[0.65rem] font-medium text-foreground/80 sm:text-xs">
                {s.short}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <Node ref={coreRef} className="size-16 border-transparent bg-surface-dark">
          <LogoGlyph className="h-7 w-7" />
        </Node>
        <span className="label-mono text-[0.6rem] text-muted-foreground">
          strategy engine
        </span>
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <Node ref={outRef}>
          <ListChecks className="size-5 text-accent" strokeWidth={1.75} />
        </Node>
        <span className="label-mono text-[0.6rem] text-muted-foreground">
          ranked moves
        </span>
      </div>

      {!reduced && inView ? (
        <>
          {SIGNAL_STREAMS.map((s, i) => (
            <AnimatedBeam
              key={s.id}
              containerRef={containerRef}
              fromRef={streamRef(i)}
              toRef={coreRef}
              curvature={CURVES[i]}
              delay={i * 0.3}
              {...beam}
            />
          ))}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={coreRef}
            toRef={outRef}
            delay={1.6}
            {...beam}
            duration={3}
          />
        </>
      ) : null}
    </div>
  );
}
