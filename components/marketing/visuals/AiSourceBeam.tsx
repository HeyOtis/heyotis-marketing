"use client";

import * as React from "react";
import {
  OpenAI,
  Claude,
  Gemini,
  Perplexity,
  MetaAI,
  Mistral,
} from "@lobehub/icons";
import { useInView } from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { LogoGlyph } from "@/components/marketing/Logo";
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
Node.displayName = "BeamNode";

/* All six engines the copy promises — keep in sync with AiSourceLogos. */
const ENGINES = [
  { name: "ChatGPT", Icon: OpenAI, curvature: -110 },
  { name: "Claude", Icon: Claude, curvature: -66 },
  { name: "Gemini", Icon: Gemini, curvature: -22 },
  { name: "Perplexity", Icon: Perplexity, curvature: 22 },
  { name: "Meta AI", Icon: MetaAI, curvature: 66 },
  { name: "Mistral", Icon: Mistral, curvature: 110 },
] as const;

export function AiSourceBeam({ className }: { className?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const brandRef = React.useRef<HTMLDivElement>(null);
  const engineRefs = React.useMemo(
    () => ENGINES.map(() => React.createRef<HTMLDivElement>()),
    [],
  );
  const reduced = useIsomorphicReducedMotion();
  // Only mount the infinite beam animations while the section is on-screen, so
  // they don't keep repainting on the main thread after scrolling away.
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
      className={cn(
        "relative mx-auto flex h-[440px] w-full max-w-lg items-center justify-between px-2 sm:px-6",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2.5">
        <Node ref={brandRef} className="size-16 border-transparent bg-surface-dark">
          <LogoGlyph className="h-7 w-7" />
        </Node>
        <span className="label-mono text-[0.6rem] text-muted-foreground">
          your brand
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {ENGINES.map(({ name, Icon }, i) => (
          <div key={name} className="flex items-center gap-3 text-foreground">
            <Node ref={engineRefs[i]}>
              <Icon size={22} />
            </Node>
            <span className="text-sm font-medium">{name}</span>
          </div>
        ))}
      </div>

      {reduced || inView ? (
        <>
          {ENGINES.map(({ name, curvature }, i) => (
            <AnimatedBeam
              key={name}
              containerRef={containerRef}
              fromRef={brandRef}
              toRef={engineRefs[i]}
              curvature={curvature}
              delay={i * 0.3}
              static={reduced}
              {...beam}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}
