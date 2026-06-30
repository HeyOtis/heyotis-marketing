import { Quote } from "lucide-react";
import { HALENSTEIN } from "@/lib/strategy-content";
import { cn } from "@/lib/utils";

/**
 * Real, named proof. Text-first (logo asset optional/later). The +300% here is
 * an attributed result, not illustrative.
 */
export function ProofHalenstein({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-[2rem] border border-brand/20 bg-brand/[0.06] p-8 sm:p-12",
        className,
      )}
    >
      <Quote aria-hidden className="size-8 text-accent/70" strokeWidth={1.5} />
      <blockquote
        className="mt-5 max-w-3xl font-display text-2xl leading-snug tracking-tight text-foreground sm:text-3xl"
        style={{ fontStretch: "85%" }}
      >
        {HALENSTEIN.lede}
      </blockquote>
      <figcaption className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {HALENSTEIN.detail}
      </figcaption>
      <div className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-t border-brand/15 pt-6">
        <Stat value={HALENSTEIN.lift} label="AI recommendation share" />
        <Stat
          value={HALENSTEIN.shareAfter}
          label={`Recommendation share in ${HALENSTEIN.market}`}
        />
        <Stat value={HALENSTEIN.brand} label="Apparel brand" />
      </div>
    </figure>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p
        className="font-display text-3xl text-foreground sm:text-4xl"
        style={{ fontStretch: "80%", fontWeight: 800 }}
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
