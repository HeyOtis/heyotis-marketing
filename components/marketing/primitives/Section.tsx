import { cn } from "@/lib/utils";
import { Container } from "@/components/marketing/Container";

type SectionProps = {
  surface?: "cream" | "card" | "dark";
  className?: string;
  containerClassName?: string;
  id?: string;
  /** Skip the centered Container wrapper (for full-bleed content). */
  bleed?: boolean;
  children: React.ReactNode;
};

const surfaceClass = {
  cream: "surface-cream",
  card: "surface-card",
  dark: "surface-dark",
} as const;

export function Section({
  surface = "cream",
  className,
  containerClassName,
  id,
  bleed = false,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-20 md:py-28", surfaceClass[surface], className)}
    >
      {bleed ? (
        children
      ) : (
        <Container className={containerClassName}>{children}</Container>
      )}
    </section>
  );
}
