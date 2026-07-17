import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/marketing/primitives/Section";

/**
 * Slim mid-page lead-magnet band. One line, one secondary-styled CTA, on a
 * stage-beige flat card — a low-commitment offramp to the free report for
 * visitors not ready to book yet.
 */
export function ReportBand() {
  return (
    <Section surface="card" className="py-10 md:py-12">
      <div className="flex justify-center rounded-lg bg-stage px-6 py-8 sm:px-10">
        <Link
          href="/report"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-6 py-3 text-center text-base font-medium text-foreground transition-colors hover:bg-secondary sm:text-lg"
        >
          See where you stand first — get the free AI Visibility Report.
          <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Section>
  );
}
