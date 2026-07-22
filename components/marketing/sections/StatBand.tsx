import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

export type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  customer?: string;
};

export function StatBand({
  stats,
  className,
  tone = "ink",
  cols = 4,
}: {
  stats: Stat[];
  className?: string;
  tone?: "ink" | "cream";
  /** Desktop column count - match the number of stats so short bands fill the row. */
  cols?: 2 | 3 | 4;
}) {
  const numberTone = tone === "cream" ? "text-surface-dark-foreground" : "text-foreground";
  const labelTone =
    tone === "cream"
      ? "text-surface-dark-foreground/65"
      : "text-muted-foreground";
  const customerTone = tone === "cream" ? "text-brand-soft" : "text-accent";
  const divider = tone === "cream" ? "divide-white/10" : "divide-border";

  return (
    <dl
      className={cn(
        "grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:divide-x",
        cols === 2 && "lg:grid-cols-2",
        cols === 3 && "lg:grid-cols-3",
        cols === 4 && "lg:grid-cols-4",
        divider,
        className,
      )}
    >
      {stats.map((stat, i) => (
        <div key={i} className="px-0 lg:px-8 lg:first:pl-0">
          <dd
            className={cn(
              "font-display text-5xl tabular-nums sm:text-6xl",
              numberTone,
            )}
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            {stat.prefix}
            <NumberTicker
              value={stat.value}
              decimalPlaces={stat.decimals ?? 0}
              className={cn("text-inherit dark:text-inherit", numberTone)}
            />
            {stat.suffix}
          </dd>
          <dt className={cn("mt-3 text-sm leading-snug", labelTone)}>
            {stat.label}
          </dt>
          {stat.customer ? (
            <p className={cn("mt-2 label-mono text-[0.7rem]", customerTone)}>
              {stat.customer}
            </p>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
