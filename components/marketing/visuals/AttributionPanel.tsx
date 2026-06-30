import { ArrowUpRight, Shield } from "lucide-react";
import { ATTRIBUTION } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/**
 * Real-attribution proof tile: before → after on the actual metric over a
 * window, with the delta and an evidence line. Bars are sized from the sample
 * values relative to the post value. Illustrative numbers, real mechanism.
 */
export function AttributionPanel({ className }: { className?: string }) {
  const { metric, pre, post, preNum, postNum, deltaLabel, windowDays, evidence } =
    ATTRIBUTION;
  const max = Math.max(preNum, postNum);
  const prePct = Math.round((preNum / max) * 100);
  const postPct = Math.round((postNum / max) * 100);

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border bg-card p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-mono text-[0.6rem] text-muted-foreground">
            Attribution · {windowDays}-day window
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground">
            {metric}
          </h3>
          <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-accent">
            Sample
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-sm font-semibold text-accent">
          <ArrowUpRight className="size-4" aria-hidden />
          {deltaLabel}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Bar label="Before" value={pre} pct={prePct} tone="muted" />
        <Bar label="After" value={post} pct={postPct} tone="brand" />
      </div>

      <p className="mt-6 flex items-start gap-2 border-t border-border pt-3 text-[0.7rem] leading-relaxed text-muted-foreground">
        <Shield className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
        {evidence}
      </p>
    </div>
  );
}

function Bar({
  label,
  value,
  pct,
  tone,
}: {
  label: string;
  value: string;
  pct: number;
  tone: "muted" | "brand";
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="label-mono text-[0.6rem] text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            tone === "brand" ? "text-accent" : "text-muted-foreground",
          )}
        >
          {value}
        </span>
      </div>
      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "brand" ? "bg-accent" : "bg-muted-foreground/40",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
