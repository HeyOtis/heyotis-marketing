import { cn } from "@/lib/utils";
import { Container } from "@/components/marketing/Container";

type SectionProps = {
  surface?: "cream" | "card" | "dark";
  className?: string;
  containerClassName?: string;
  id?: string;
  /** Skip the centered Container wrapper (for full-bleed content). */
  bleed?: boolean;
  /** Forwarded to Container. `reading` keeps long-form pages narrow. */
  width?: "default" | "reading";
  children: React.ReactNode;
};

/* Blueprint canvas: light sections all sit on the one paper surface and are
   separated by hairline rules instead of alternating band colors. `card`
   is kept as an accepted value so callers don't churn. */
const surfaceClass = {
  cream: "surface-cream border-t border-border",
  card: "surface-cream border-t border-border",
  dark: "surface-dark",
} as const;

export function Section({
  surface = "cream",
  className,
  containerClassName,
  id,
  bleed = false,
  width = "default",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 md:py-28 2xl:py-36",
        surfaceClass[surface],
        className,
      )}
    >
      {bleed ? (
        children
      ) : (
        <Container width={width} className={containerClassName}>
          {children}
        </Container>
      )}
    </section>
  );
}
