import { ArrowRight, RefreshCw } from "lucide-react";
import { Reveal } from "@/components/marketing/primitives/Reveal";
import { LOOP_STAGES } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/**
 * The self-improving Strategy Engine loop. Six stages laid out as a connected
 * sequence; the last two (Verify, Prove) are highlighted as the differentiator,
 * and a "loops back" caption makes the compounding cycle explicit. Static markup
 * with per-card Reveal entrance (reduced-motion safe).
 */
export function StrategyLoop({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LOOP_STAGES.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <Reveal key={stage.id} delay={i * 0.06} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-6 transition-colors",
                  stage.differentiator
                    ? "border-brand/30 bg-brand/[0.06]"
                    : "border-border bg-card",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl ring-1",
                      stage.differentiator
                        ? "bg-brand/15 text-accent ring-brand/20"
                        : "bg-brand/10 text-accent ring-brand/15",
                    )}
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="label-mono text-xs text-muted-foreground">
                    {String(stage.n).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                  <span className="text-accent">{stage.verb}.</span>{" "}
                  {stage.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {stage.blurb}
                </p>
                {stage.differentiator ? (
                  <span className="label-mono mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[0.6rem] text-accent">
                    What others skip
                  </span>
                ) : null}
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.4}>
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <RefreshCw className="size-4 text-accent" aria-hidden />
          <span>
            <span className="font-medium text-foreground">Prove</span> feeds back
            into <span className="font-medium text-foreground">Measure</span> —
            every campaign compounds.
          </span>
          <ArrowRight className="size-4 text-accent" aria-hidden />
        </p>
      </Reveal>
    </div>
  );
}
