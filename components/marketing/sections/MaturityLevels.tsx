import { Reveal } from "@/components/marketing/primitives/Reveal";
import { MATURITY_LEVELS } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/**
 * The four levels the engine operates at, as a left-to-right ladder.
 * All present tense per the positioning decision.
 */
export function MaturityLevels({ className }: { className?: string }) {
  return (
    <div
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
    >
      {MATURITY_LEVELS.map((level, i) => {
        const Icon = level.icon;
        return (
          <Reveal key={level.id} delay={i * 0.06} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-accent ring-1 ring-brand/15">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span className="label-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">
                {level.level}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent">
                {level.tagline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {level.blurb}
              </p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
