"use client";

import * as React from "react";
import { OpenAI, Claude, Gemini, Perplexity } from "@lobehub/icons";
import { useReducedMotion } from "motion/react";
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
      "z-10 flex size-14 items-center justify-center rounded-2xl border border-border bg-card shadow-[0_8px_24px_-12px_rgba(40,30,70,0.4)]",
      className,
    )}
  >
    {children}
  </div>
));
Node.displayName = "BeamNode";

export function AiSourceBeam({ className }: { className?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const brandRef = React.useRef<HTMLDivElement>(null);
  const chatgptRef = React.useRef<HTMLDivElement>(null);
  const claudeRef = React.useRef<HTMLDivElement>(null);
  const geminiRef = React.useRef<HTMLDivElement>(null);
  const perplexityRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

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
        "relative mx-auto flex h-[360px] w-full max-w-lg items-center justify-between px-2 sm:px-6",
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

      <div className="flex flex-col gap-6">
        <EngineRow nodeRef={chatgptRef} name="ChatGPT">
          <OpenAI size={26} />
        </EngineRow>
        <EngineRow nodeRef={claudeRef} name="Claude">
          <Claude size={26} />
        </EngineRow>
        <EngineRow nodeRef={geminiRef} name="Gemini">
          <Gemini size={26} />
        </EngineRow>
        <EngineRow nodeRef={perplexityRef} name="Perplexity">
          <Perplexity size={26} />
        </EngineRow>
      </div>

      {!reduced ? (
        <>
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={brandRef}
            toRef={chatgptRef}
            curvature={-80}
            {...beam}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={brandRef}
            toRef={claudeRef}
            curvature={-28}
            delay={0.3}
            {...beam}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={brandRef}
            toRef={geminiRef}
            curvature={28}
            delay={0.6}
            {...beam}
          />
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={brandRef}
            toRef={perplexityRef}
            curvature={80}
            delay={0.9}
            {...beam}
          />
        </>
      ) : null}
    </div>
  );
}

function EngineRow({
  nodeRef,
  name,
  children,
}: {
  nodeRef: React.RefObject<HTMLDivElement | null>;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-foreground">
      <Node ref={nodeRef}>{children}</Node>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}
