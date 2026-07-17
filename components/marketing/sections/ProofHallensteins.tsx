import { StatBand, type Stat } from "@/components/marketing/sections/StatBand";
import { HALLENSTEINS } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/* Real, named proof. Stat-only — the +300% / 3.7% here are attributed
   results, not illustrative. No third stat: HALLENSTEINS carries no stated
   measurement window, so we don't invent one. */
const STATS: Stat[] = [
  {
    value: 300,
    prefix: "+",
    suffix: "%",
    label: "AI recommendation share lift",
    customer: `${HALLENSTEINS.brand} · Apparel`,
  },
  {
    value: 3.7,
    decimals: 1,
    suffix: "%",
    label: `Recommendation share in ${HALLENSTEINS.market} — up from near-zero`,
  },
];

export function ProofHallensteins({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl bg-card p-8 sm:p-12", className)}>
      <StatBand stats={STATS} tone="ink" />

      {/* QUOTE SLOT: awaiting named Hallensteins quote — do not fabricate */}

      <div className="mt-10 border-t border-border pt-6">
        <a
          href="/case-studies/hallensteins"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          Read the full story →
        </a>
      </div>
    </div>
  );
}
