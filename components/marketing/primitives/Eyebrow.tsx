import { cn } from "@/lib/utils";

/** Geist Mono uppercase label - the "engineered / measured" signal. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("label-mono text-accent", className)}>
      <span aria-hidden className="opacity-60">/</span> {children}
    </p>
  );
}
