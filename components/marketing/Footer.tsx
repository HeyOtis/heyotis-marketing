import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/marketing/Container";
import { LogoGlyph, Wordmark } from "@/components/marketing/Logo";
import { BookCta } from "@/components/marketing/primitives/BookCta";

const currentYear = 2026;

export function Footer() {
  return (
    <footer className="surface-dark relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(48rem 22rem at 50% 120%, oklch(0.68 0.1 280 / 0.30), transparent 70%)",
        }}
      />
      <Container className="relative py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link
              href="/"
              aria-label={`${siteConfig.name} home`}
              className="inline-flex items-center gap-2.5"
            >
              <LogoGlyph className="h-7 w-7" />
              <Wordmark tone="cream" className="text-3xl" />
            </Link>
            <p className="mt-6 max-w-sm text-base text-surface-dark-foreground/70">
              Brand visibility for the age of AI search. Measure how ChatGPT,
              Claude, Gemini and Perplexity recommend you — then win the answer.
            </p>
            <div className="mt-8">
              <BookCta variant="inverse" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:col-span-7 lg:justify-items-end">
            {siteConfig.footerNav.map((group) => (
              <div key={group.heading}>
                <h3 className="label-mono text-surface-dark-foreground/50">
                  {group.heading}
                </h3>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-surface-dark-foreground/80 transition-colors hover:text-surface-dark-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-surface-dark-foreground/15 pt-8 text-xs text-surface-dark-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-surface-dark-foreground"
            >
              LinkedIn
            </a>
            <a
              href={siteConfig.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-surface-dark-foreground"
            >
              X / Twitter
            </a>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="transition-colors hover:text-surface-dark-foreground"
            >
              {siteConfig.contactEmail}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
