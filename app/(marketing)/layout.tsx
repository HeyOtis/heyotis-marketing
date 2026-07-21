import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <SmoothScroll>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline focus:outline-2 focus:outline-ring"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        {/* Blueprint column rules, DOSS-style: a solid hairline pair at the
            content edges plus a fainter dashed pair in the outer margin.
            Painted last so they sit over section backgrounds; inert to
            pointers and screen readers. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-y-0 left-1/2 hidden w-full max-w-6xl -translate-x-1/2 border-x border-border/70 xl:block"
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-y-0 left-1/2 hidden w-full max-w-7xl -translate-x-1/2 border-x border-dashed border-border/50 xl:block"
        />
      </SmoothScroll>
    </MotionProvider>
  );
}
