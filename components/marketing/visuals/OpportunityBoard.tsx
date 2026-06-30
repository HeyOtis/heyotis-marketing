import { CircleCheck, Shield } from "lucide-react";
import { OPPORTUNITIES, type Opportunity } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

const IMPACT_DOT: Record<Opportunity["impact"], string> = {
  High: "bg-brand",
  Medium: "bg-amber-500",
  Low: "bg-muted-foreground",
};

/**
 * Illustrative "Your action plan" board — mirrors the product's Strategy Engine:
 * ranked opportunities with impact × effort, the metric each is measured by, and
 * the underlying signal count. The top opportunity is shown expanded with the
 * product's drawer sections (Why this / What to do / What you'll see).
 */
export function OpportunityBoard({ className }: { className?: string }) {
  const [top, ...rest] = OPPORTUNITIES;

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-card p-5 sm:p-6",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            Strategy Engine
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
            Your action plan
          </h3>
          <p className="text-sm text-muted-foreground">
            {OPPORTUNITIES.length} opportunities to focus on this month
          </p>
        </div>
        <span className="label-mono shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[0.6rem] text-accent">
          Impact × Effort
        </span>
      </div>

      {/* Expanded top opportunity */}
      <div className="mt-5 rounded-xl border border-brand/25 bg-brand/[0.05] p-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-brand/15 text-[0.7rem] font-semibold text-accent">
            {top.rank}
          </span>
          <span className="label-mono text-[0.6rem] text-accent">
            Highest priority
          </span>
        </div>
        <h4 className="mt-3 text-sm font-semibold text-foreground">
          {top.title}
        </h4>

        <div className="mt-3 flex flex-wrap gap-2 text-[0.7rem]">
          <Chip dot={IMPACT_DOT[top.impact]}>{top.impact} impact</Chip>
          <Chip dot="bg-muted-foreground">{top.effort} effort</Chip>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-0.5 text-muted-foreground">
            <CircleCheck className="size-3 text-accent" aria-hidden />
            Measured by {top.measure}
          </span>
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="label-mono text-[0.6rem] text-muted-foreground">
              Why this
            </dt>
            <dd className="mt-1 text-xs leading-relaxed text-foreground/80">
              {top.why}
            </dd>
          </div>
          <div>
            <dt className="label-mono text-[0.6rem] text-muted-foreground">
              What to do
            </dt>
            <dd className="mt-1">
              <ol className="flex flex-col gap-1 text-xs leading-relaxed text-foreground/80">
                {top.doThis.map((step, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-accent">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </dd>
          </div>
        </dl>

        <p className="mt-3 border-t border-brand/15 pt-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            What you&apos;ll see:
          </span>{" "}
          {top.expect}
        </p>
        <p className="mt-2 label-mono text-[0.6rem] text-muted-foreground">
          Based on {top.signals} signals
        </p>
      </div>

      {/* Remaining opportunities (compact) */}
      <ul className="mt-3 flex flex-col gap-2">
        {rest.map((o) => (
          <li
            key={o.rank}
            className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.7rem] font-semibold text-foreground/70">
              {o.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                {o.title}
              </p>
              <p className="label-mono text-[0.6rem] text-muted-foreground">
                Measured by {o.measure} · {o.signals} signals
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className={cn("size-2 rounded-full", IMPACT_DOT[o.impact])} />
              <span className="text-[0.65rem] text-muted-foreground">
                {o.impact}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Honesty footer (verbatim product line) */}
      <p className="mt-4 flex items-start gap-2 border-t border-border pt-3 text-[0.7rem] leading-relaxed text-muted-foreground">
        <Shield className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
        Composed by the strategy engine from deterministic signals above. The
        wording is generated; the evidence is not.
      </p>
    </div>
  );
}

function Chip({ dot, children }: { dot: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2 py-0.5 text-muted-foreground">
      <span className={cn("size-2 rounded-full", dot)} />
      {children}
    </span>
  );
}
