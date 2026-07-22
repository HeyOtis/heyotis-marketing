"use client";

import * as React from "react";
import Link from "next/link";
import { NavigationMenu } from "radix-ui";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV, siteConfig, type NavEntry } from "@/lib/site";
import { Logo } from "@/components/marketing/Logo";
import { BookCta } from "@/components/marketing/primitives/BookCta";
import { cn } from "@/lib/utils";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";

const triggerClass =
  "group flex cursor-pointer items-center gap-1.5 rounded-md text-[0.9375rem] font-medium text-foreground outline-none transition-colors hover:text-foreground/70 focus-visible:text-foreground/70 data-[state=open]:text-foreground/70";

const plainLinkClass =
  "text-[0.9375rem] font-medium text-foreground transition-colors hover:text-foreground/70";

/* Editorial intro for each mega-menu's left column, DOSS-style. */
const MENU_INTRO: Record<string, { label: string; title: string }> = {
  Platform: {
    label: "The Platform",
    title: "One loop from measurement to proof",
  },
  Resources: {
    label: "All Resources",
    title: "Guides, proof and the thinking behind AEO",
  },
  Pricing: {
    label: "Pricing",
    title: "Plans that scale with your strategy",
  },
};

/* DOSS-style mega-panel: full container width, held by the page's column
   rules — editorial intro left, ruled link columns, bottom bar with the
   CTA and socials. */
function DropdownPanel({
  entry,
}: {
  entry: Extract<NavEntry, { groups: unknown }>;
}) {
  const intro = MENU_INTRO[entry.label] ?? { label: entry.label, title: "" };
  const cols = Math.max(entry.groups.length, 2);

  return (
    /* Full-bleed cream band; the container-width inner wrapper carries the
       page's column rules straight through the panel. */
    <div className="w-full border-b border-border bg-background shadow-[0_32px_64px_-48px_rgba(40,30,70,0.3)]">
      <div className="mx-auto w-full max-w-6xl border-x border-border/70">
      <div
        className="grid gap-x-8 px-4 py-10 sm:px-6 lg:px-8"
        style={{ gridTemplateColumns: `1.25fr repeat(${cols}, 1fr)` }}
      >
        <div className="pr-4">
          <p className="label-mono text-[0.65rem] text-muted-foreground">
            {intro.label}
          </p>
          <p className="mt-4 max-w-[15rem] text-xl font-medium leading-snug tracking-tight text-foreground">
            {intro.title}
          </p>
        </div>
        {entry.groups.map((group) => (
          <div key={group.heading} className="border-l border-border/60 pl-8">
            <p className="label-mono text-[0.65rem] text-muted-foreground">
              {group.heading}
            </p>
            <ul className="mt-5 space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <NavigationMenu.Link asChild>
                    <Link href={link.href} className="group/link block">
                      <span className="block text-sm leading-snug text-foreground/70 transition-colors group-hover/link:text-foreground">
                        {link.label}
                      </span>
                      {link.description ? (
                        <span className="mt-0.5 block text-xs text-muted-foreground/80">
                          {link.description}
                        </span>
                      ) : null}
                    </Link>
                  </NavigationMenu.Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* keep the column rhythm even when a menu has few groups */}
        {Array.from({ length: cols - entry.groups.length }).map((_, i) => (
          <div key={i} aria-hidden className="border-l border-border/60" />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border/70 px-4 py-4 sm:px-6 lg:px-8">
        <NavigationMenu.Link asChild>
          <Link
            href="/contact#book"
            className="text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            Book a chat →
          </Link>
        </NavigationMenu.Link>
        {entry.footerLink ? (
          <NavigationMenu.Link asChild>
            <Link
              href={entry.footerLink.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {entry.footerLink.label}
            </Link>
          </NavigationMenu.Link>
        ) : (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

function DesktopNav() {
  const reduced = useIsomorphicReducedMotion();
  const [openMenu, setOpenMenu] = React.useState("");

  return (
    <NavigationMenu.Root
      aria-label="Primary"
      className="hidden lg:flex"
      delayDuration={100}
      value={openMenu}
      onValueChange={setOpenMenu}
    >
      <NavigationMenu.List className="flex items-center gap-8">
        {NAV.map((item) =>
          "href" in item ? (
            <NavigationMenu.Item key={item.href}>
              <NavigationMenu.Link asChild>
                <Link href={item.href} className={plainLinkClass}>
                  {item.label}
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item key={item.label} value={item.label}>
              <NavigationMenu.Trigger className={triggerClass}>
                {item.label}
                <ChevronDown
                  aria-hidden
                  className="size-3 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="w-full">
                <DropdownPanel entry={item} />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ),
        )}
      </NavigationMenu.List>

      {/* Scrim: darkens the page beneath the open panel. Anchored below the
          nav (not `fixed` — the nav's slide-away transform would contain
          it); the panel paints after it, so it only tints the exposed page.
          Inert so hover-out still closes the menu. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-full h-screen w-screen -translate-x-1/2 bg-[oklch(0.21_0.02_285/0.3)] transition-opacity duration-300",
          openMenu ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Full-bleed panel band, attached to the nav's bottom rule and
          spanning the whole viewport, DOSS-style. The panel's inner wrapper
          re-draws the column rules at the container edges. */}
      <div className="absolute left-1/2 top-full w-screen -translate-x-1/2">
        <NavigationMenu.Viewport
          className={cn(
            "relative w-full overflow-hidden",
            "h-[var(--radix-navigation-menu-viewport-height)]",
            !reduced &&
              "duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          )}
        />
      </div>
    </NavigationMenu.Root>
  );
}

function MobileGroup({
  item,
  onNavigate,
}: {
  item: Extract<NavEntry, { groups: unknown }>;
  onNavigate: () => void;
}) {
  const flatten = item.groups.length === 1;

  return (
    <div className="py-2">
      <p className="label-mono px-3 text-muted-foreground">{item.label}</p>
      <div className="mt-2 flex flex-col gap-3">
        {item.groups.map((group) => (
          <div key={group.heading}>
            {!flatten ? (
              <p className="label-mono px-3 text-[0.65rem] text-muted-foreground/60">
                {group.heading}
              </p>
            ) : null}
            <div className="mt-1 flex flex-col gap-1">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className="rounded-lg px-3 py-2 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {link.label}
                  {link.description ? (
                    <span className="block text-xs font-normal text-muted-foreground">
                      {link.description}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {item.footerLink ? (
        <Link
          href={item.footerLink.href}
          onClick={onNavigate}
          className="mt-2 block rounded-lg px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-secondary"
        >
          {item.footerLink.label}
        </Link>
      ) : null}
    </div>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const toggleRef = React.useRef<HTMLButtonElement>(null);

  // DOSS-style chrome: the bar slides up out of view when you scroll down and
  // slides back the instant you scroll up (from anywhere on the page). rAF-
  // throttled so it rides Lenis's frame loop without thrashing React.
  React.useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 16);

      const delta = y - lastY;
      // Ignore sub-pixel jitter and rubber-band bounces.
      if (Math.abs(delta) > 4) {
        // Always reveal near the very top; otherwise follow scroll direction.
        setHidden(y > 72 && delta > 0);
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the bar pinned whenever the mobile menu is open.
  const isHidden = hidden && !open;

  // Close the mobile menu on route hash / resize to desktop.
  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close the mobile menu on Escape and return focus to the toggle.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-transform duration-300 ease-out",
        isHidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div
        className={cn(
          "relative border-b border-border transition-colors duration-300",
          scrolled || open
            ? "bg-background/85 backdrop-blur-md"
            : "bg-background",
        )}
      >
        {/* the page's dashed outer rules, carried up through the nav */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-full max-w-7xl -translate-x-1/2 border-x border-dashed border-border/50 xl:block"
        />
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 xl:border-x xl:border-border/70">
          {/* DOSS grouping: logo and links cluster left; actions sit right. */}
          <div className="flex items-center gap-8 lg:gap-12">
            <Logo />
            <DesktopNav />
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href={siteConfig.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm font-medium text-foreground/70 transition-colors hover:text-foreground lg:inline-flex"
            >
              Log in
            </a>
            <BookCta variant="salmon" size="default" className="inline-flex" />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          hidden={!open}
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border/60 lg:hidden"
        >
          <nav
            aria-label="Mobile"
            className="mx-auto flex max-w-6xl flex-col divide-y divide-border/60 px-4 py-2 sm:px-6"
          >
            {NAV.map((item) =>
              "href" in item ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <MobileGroup
                  key={item.label}
                  item={item}
                  onNavigate={() => setOpen(false)}
                />
              ),
            )}
            <div className="flex flex-col gap-1 py-2">
              <a
                href={siteConfig.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              >
                Log in
              </a>
              <div className="px-3 pt-3">
                <BookCta className="w-full" />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
