import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="surface-dark">
        <Nav />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
