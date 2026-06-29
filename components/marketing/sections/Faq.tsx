import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/marketing/primitives/SectionHeading";
import type { FaqEntry } from "@/lib/schema";

export type FaqItem = { q: string; a: string };

/** Adapt FAQ items into the shape `faqPageSchema` expects. */
export function faqItemsToSchema(items: FaqItem[]): FaqEntry[] {
  return items.map(({ q, a }) => ({ question: q, answer: a }));
}

type FaqProps = {
  items: FaqItem[];
  heading?: string;
  eyebrow?: string;
  sub?: string;
};

export function Faq({
  items,
  heading = "Frequently asked questions",
  eyebrow = "FAQ",
  sub,
}: FaqProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <SectionHeading eyebrow={eyebrow} title={heading} sub={sub} />
      </div>
      <div className="lg:col-span-7">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
