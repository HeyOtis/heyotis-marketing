"use client";

import * as React from "react";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Claude,
  Cohere,
  Gemini,
  Grok,
  Meta,
  Mistral,
  OpenAI,
  Perplexity,
} from "@lobehub/icons";
import { Container } from "@/components/marketing/Container";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type BrandIcon = React.ComponentType<{ size?: number }> & {
  Text: React.ComponentType<{ size?: number }>;
};

const BRANDS: Array<{ key: string; brand: BrandIcon }> = [
  { key: "openai", brand: OpenAI as unknown as BrandIcon },
  { key: "claude", brand: Claude as unknown as BrandIcon },
  { key: "gemini", brand: Gemini as unknown as BrandIcon },
  { key: "meta", brand: Meta as unknown as BrandIcon },
  { key: "mistral", brand: Mistral as unknown as BrandIcon },
  { key: "perplexity", brand: Perplexity as unknown as BrandIcon },
  { key: "grok", brand: Grok as unknown as BrandIcon },
  { key: "cohere", brand: Cohere as unknown as BrandIcon },
];

export function LogoStrip() {
  const [autoScroll] = React.useState(() =>
    AutoScroll({
      speed: 0.6,
      startDelay: 0,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  return (
    <section className="surface-cream py-20 sm:py-28">
      <Container>
        <h2 className="text-center font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
          Benchmarked across every major AI assistant
        </h2>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent"
          />
          <Carousel
            opts={{ loop: true, align: "start", dragFree: true }}
            plugins={[autoScroll]}
            className="w-full"
          >
            <CarouselContent className="-ml-6">
              {BRANDS.map(({ key, brand: Brand }) => (
                <CarouselItem
                  key={key}
                  className="basis-1/2 pl-6 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Card className="flex aspect-square flex-row items-center justify-center gap-3 rounded-2xl border-0 bg-card shadow-none">
                    <Brand size={44} />
                    <Brand.Text size={32} />
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </Container>
    </section>
  );
}
