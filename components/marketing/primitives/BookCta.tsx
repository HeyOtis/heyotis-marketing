import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type BookCtaProps = {
  variant?: "primary" | "inverse" | "secondary";
  label?: string;
  href?: string;
  className?: string;
  nudge?: boolean;
  withArrow?: boolean;
  size?: "default" | "lg";
};

const variantClass = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  inverse: "bg-background text-foreground hover:bg-background/90",
  secondary:
    "border border-border bg-transparent text-foreground hover:bg-secondary",
} as const;

/**
 * The site's recurring call-to-action. Defaults to the on-site booking section
 * (`/contact#book`, where the HubSpot Meetings widget is embedded) so visitors
 * stay on our site. Pass `href`/`label` to repurpose it for secondary actions.
 */
export function BookCta({
  variant = "primary",
  label = "Book a chat",
  // On-site booking section (HubSpot widget is embedded there) — keeps visitors
  // on our site rather than sending them to hubspot.com.
  href = "/contact#book",
  className,
  nudge = false,
  withArrow = false,
  size = "lg",
}: BookCtaProps) {
  const isExternal = /^https?:\/\//.test(href);
  const classes = cn(
    "group rounded-full px-6 text-sm",
    variantClass[variant],
    nudge && "cta-nudge",
    className,
  );
  const inner = (
    <>
      {label}
      {withArrow ? (
        <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
      ) : null}
    </>
  );

  return (
    <Button asChild size={size} className={classes}>
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      ) : (
        <Link href={href}>{inner}</Link>
      )}
    </Button>
  );
}
