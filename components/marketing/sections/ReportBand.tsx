import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/marketing/primitives/Section";

/**
 * Slim mid-page lead-magnet band. One line, one lavender CTA sitting straight
 * on the page surface - a low-commitment offramp to the free report for
 * visitors not ready to book yet.
 */
export function ReportBand() {
  return (
    <Section surface="card" className="py-10 md:py-12">
      <div className="flex justify-center">
        <Link
          href="/report"
          className="group inline-flex items-center gap-2 rounded-full bg-periwinkle px-6 py-3 text-center text-base font-medium text-foreground transition-colors hover:bg-periwinkle/85 sm:text-lg"
        >
          See where you stand first - get the free AI Visibility Report.
          <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Section>
  );
}
