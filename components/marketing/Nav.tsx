import Link from "next/link";
import { Plus } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";

const NAV_WITH_DROPDOWNS = ["Product", "Resources", "About"];

export function Nav() {
  return (
    <header className="relative z-30 w-full bg-transparent">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10 lg:gap-14">
          <Link
            href="/"
            aria-label={`${siteConfig.name} home`}
            className="font-display text-4xl leading-none tracking-[-0.04em] text-primary-foreground"
            style={{ fontStretch: "70%", fontWeight: 800 }}
          >
            {siteConfig.name.toLowerCase()}
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-5 md:flex"
          >
            {siteConfig.nav.map((item) => {
              const hasDropdown = NAV_WITH_DROPDOWNS.includes(item.label);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 text-base text-primary-foreground/90 transition-colors hover:text-primary-foreground"
                >
                  {item.label}
                  {hasDropdown && (
                    <Plus
                      aria-hidden
                      className="size-4 opacity-70 transition-transform group-hover:rotate-90"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="hidden text-base text-primary-foreground/90 hover:text-primary-foreground md:inline-flex"
          >
            Login
          </Link>
          <Button
            asChild
            size="sm"
            className="rounded-md bg-background text-foreground hover:bg-background/90"
          >
            <Link href="/contact">Book a chat</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
