import Link from "next/link";
import { Container } from "@/components/marketing/Container";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { buildMetadata } from "@/lib/seo";

/* This file lives at the app root (not inside the (marketing) group) because
   that's the only not-found Next.js serves for URLs that match no route at all.
   The trade-off: it does NOT inherit app/(marketing)/layout.tsx, so Nav and
   Footer are rendered here explicitly. Without them a mistyped URL is a dead
   end with no way to navigate. */

export const metadata = buildMetadata({
  title: "Page not found",
  description:
    "The page you're looking for doesn't exist or has been moved. Browse the HeyOtis platform, pricing and AEO guides instead.",
  // 404s must never be indexed, and must never advertise a canonical - doing so
  // would consolidate signals onto whatever URL we named here.
  noindex: true,
});

const ELSEWHERE = [
  { label: "The platform", href: "/platform" },
  { label: "Pricing", href: "/pricing" },
  { label: "Free AI Visibility Report", href: "/report" },
  { label: "Blog", href: "/blog" },
];

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="flex-1">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-32 text-center">
          <p className="label-mono text-xs text-muted-foreground">404</p>
          <h1
            className="display-sm mt-4 text-balance"
            style={{ fontStretch: "80%", letterSpacing: "-0.02em" }}
          >
            Page not found
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            This page doesn&rsquo;t exist or has been moved. Here&rsquo;s where
            most people are heading.
          </p>
          <Button asChild className="mt-8">
            <Link href="/">Back to home</Link>
          </Button>
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {ELSEWHERE.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Footer />
    </>
  );
}
