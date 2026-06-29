import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/** The rising-bars brand glyph (shared with the platform app). */
export function LogoGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      role="img"
      aria-hidden="true"
      fill="none"
    >
      <rect x="2.5" y="13" width="4.5" height="8.5" rx="1.5" fill="oklch(0.74 0.09 280)" />
      <rect x="9.75" y="8.25" width="4.5" height="13.25" rx="1.5" fill="oklch(0.63 0.13 280)" />
      <rect x="17" y="3.25" width="4.5" height="18.25" rx="1.5" fill="oklch(0.5 0.16 280)" />
    </svg>
  );
}

/** "heyotis" wordmark in condensed Bricolage. */
export function Wordmark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "cream";
}) {
  return (
    <span
      className={cn(
        "font-display leading-none",
        tone === "cream" ? "text-surface-dark-foreground" : "text-foreground",
        className,
      )}
      style={{ fontStretch: "72%", fontWeight: 800, letterSpacing: "-0.03em" }}
    >
      HeyOtis
    </span>
  );
}

/** Glyph + wordmark, linked home. */
export function Logo({
  className,
  glyphClassName,
  wordmarkClassName,
  tone = "ink",
  href = "/",
}: {
  className?: string;
  glyphClassName?: string;
  wordmarkClassName?: string;
  tone?: "ink" | "cream";
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <LogoGlyph className={cn("h-6 w-6", glyphClassName)} />
      <Wordmark tone={tone} className={cn("text-2xl", wordmarkClassName)} />
    </Link>
  );
}
