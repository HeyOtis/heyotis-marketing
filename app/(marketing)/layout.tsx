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
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScroll>
    </MotionProvider>
  );
}
