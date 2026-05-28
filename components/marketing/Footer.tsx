import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/marketing/Container";

const FOOTER_GROUPS: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Overview" },
      { href: "/product/workforce", label: "Workforce" },
      { href: "/product/inventory", label: "Inventory" },
      { href: "/product/intelligence", label: "Intelligence" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/solutions/restaurants", label: "Restaurants" },
      { href: "/solutions/coffee", label: "Coffee" },
      { href: "/solutions/groups", label: "Multi-site groups" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/success-stories", label: "Success stories" },
      { href: "/blog", label: "Resources" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="surface-dark relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(50rem 24rem at 50% 100%, oklch(0.4 0.2 295 / 0.4), transparent 70%)",
        }}
      />
      <Container className="relative max-w-7xl py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link
              href="/"
              aria-label={`${siteConfig.name} home`}
              className="font-display text-5xl leading-none tracking-[-0.04em] text-primary-foreground"
              style={{ fontStretch: "70%", fontWeight: 800 }}
            >
              {siteConfig.name.toLowerCase()}
            </Link>
            <p className="mt-6 max-w-md text-base text-primary-foreground/70">
              The agentic operating system for ambitious operators. Predict,
              plan, run.
            </p>
            <div className="mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Book a chat
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold tracking-wide text-primary-foreground/60 uppercase">
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-primary-foreground/85 transition-colors hover:text-primary-foreground"
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

        <div className="mt-16 flex flex-col gap-3 border-t border-primary-foreground/15 pt-8 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className="hover:text-primary-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary-foreground">
              Terms
            </Link>
            <Link href="/security" className="hover:text-primary-foreground">
              Security
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
