import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Warm beige inset panel that holds product fragments inside a card. */
export function Stage({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl bg-stage p-4 sm:p-5", className)}>
      {children}
    </div>
  );
}

/** Periwinkle banner row — context label for a stage (Nory's location tile). */
export function BannerTile({
  icon: Icon,
  label,
  right,
  className,
}: {
  icon?: LucideIcon;
  label: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl bg-periwinkle px-4 py-2.5",
        className,
      )}
    >
      {Icon ? <Icon className="size-4 text-foreground/70" strokeWidth={2} /> : null}
      <span className="text-sm font-bold tracking-tight text-foreground">
        {label}
      </span>
      {right ? (
        <span className="ml-auto text-xs font-semibold text-foreground/60">
          {right}
        </span>
      ) : null}
    </div>
  );
}

/** Status / delta chip. Lime = up/good, salmon = down/bad, neutral = beige. */
export function Chip({
  tone,
  className,
  children,
}: {
  tone: "lime" | "salmon" | "neutral";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[0.7rem] font-bold text-foreground",
        tone === "lime" && "bg-lime",
        tone === "salmon" && "bg-salmon",
        tone === "neutral" && "bg-stage",
        className,
      )}
    >
      {children}
    </span>
  );
}
