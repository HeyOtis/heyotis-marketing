import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import wordmarkImage from "@/public/brand/heyotis-wordmark-trim.png";

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

/** The brand wordmark image (transparent ground, dark ink — light surfaces
    only). `priority`: the logo is above the fold on every page. `unoptimized`:
    a 40KB logo doesn't need the /_next/image pipeline, and the dev optimizer
    has been seen hanging on this asset's webp variant. */
export function WordmarkImage({ className }: { className?: string }) {
  return (
    <Image
      src={wordmarkImage}
      alt=""
      priority
      unoptimized
      className={cn("h-8 w-auto", className)}
    />
  );
}

/** The wordmark, linked home. */
export function Logo({
  className,
  wordmarkClassName,
  href = "/",
}: {
  className?: string;
  wordmarkClassName?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className={cn("inline-flex items-center", className)}
    >
      <WordmarkImage className={wordmarkClassName} />
    </Link>
  );
}
