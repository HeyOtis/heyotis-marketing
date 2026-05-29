"use client";

import Link from "next/link";
import * as React from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/Container";

const SLOGAN_LINES = [
  ["Over", "a", "billion", "conversations"],
  ["a", "day", "go", "through", "AI."],
  ["Make", "sure", "yours", "is", "one", "of", "them."],
];

export function ValueStatement() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.75, 1],
    [0, 1, 1, 0],
  );
  const y = useTransform(scrollYProgress, [0, 0.2, 0.75, 1], [40, 0, 0, -40]);

  let wordIndex = 0;

  return (
    <section className="surface-cream pb-20 sm:pb-28">
      <Container>
        <motion.div
          ref={ref}
          style={{ opacity, y }}
          className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20"
        >
          <div>
            <h2 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.5rem]">
              {SLOGAN_LINES.map((line, lineIdx) => (
                <span key={lineIdx} className="block">
                  {line.map((word) => {
                    const i = wordIndex++;
                    const isEmphasis =
                      word === "AI." ||
                      word === "billion" ||
                      word === "yours";
                    return (
                      <motion.span
                        key={`${lineIdx}-${i}`}
                        initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                        animate={
                          inView
                            ? { opacity: 1, y: 0, filter: "blur(0px)" }
                            : undefined
                        }
                        transition={{
                          duration: 0.55,
                          delay: i * 0.08,
                          ease: [0.21, 0.47, 0.32, 0.98],
                        }}
                        className={`mr-[0.25em] inline-block ${
                          isEmphasis ? "text-accent" : ""
                        }`}
                      >
                        {word}
                      </motion.span>
                    );
                  })}
                </span>
              ))}
            </h2>
          </div>

          <div className="lg:text-right">
            <h3 className="font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
              AI search has created a new marketing channel
            </h3>
            <p
              className="mt-6 max-w-xl text-base text-foreground/70 sm:text-lg lg:ml-auto"
              data-speakable
            >
              Consumers now ask AI assistants what to buy and which brand to
              trust — and get a recommendation, not a list of links. Your brand
              can be strong in search and retail yet still be missing or
              misrepresented when AI explains the category. HeyOtis benchmarks
              how you perform across every major assistant, then gives you a
              prioritised plan to fix it.
            </p>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="mt-8 rounded-md border-foreground/40 bg-transparent text-foreground hover:bg-foreground/5"
            >
              <Link href="/contact">Get your AI brand scorecard</Link>
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
