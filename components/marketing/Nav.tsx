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
  "group flex items-center gap-1 rounded-md text-sm font-medium text-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:text-foreground data-[state=open]:text-foreground";

const plainLinkClass =
  "text-sm font-medium text-foreground/70 transition-colors hover:text-foreground";

function DropdownPanel({
  entry,
}: {
  entry: Extract<NavEntry, { groups: unknown }>;
}) {
  const isGrid = entry.groups.length > 1;

  return (
    <div className={cn(isGrid ? "w-[44rem]" : "w-72")}>
      <div className="rounded-xl bg-card p-6 ring-1 ring-border/60">
        {isGrid ? (
          <div className="grid grid-cols-4 gap-8">
            {entry.groups.map((group) => (
              <div key={group.heading}>
                <p className="label-mono text-muted-foreground">
                  {group.heading}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <NavigationMenu.Link asChild>
                        <Link
                          href={link.href}
                          className="text-sm leading-snug text-foreground/80 transition-colors hover:text-accent"
                        >
                          {link.label}
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {entry.groups[0].links.map((link) => (
              <li key={link.href}>
                <NavigationMenu.Link asChild>
                  <Link
                    href={link.href}
                    className="group block rounded-lg px-3 py-2 -mx-3 transition-colors hover:bg-secondary"
                  >
                    <span className="block text-sm font-medium text-foreground/90 transition-colors group-hover:text-accent">
                      {link.label}
                    </span>
                    {link.description ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {link.description}
                      </span>
                    ) : null}
                  </Link>
                </NavigationMenu.Link>
              </li>
            ))}
          </ul>
        )}

        {entry.footerLink ? (
          <div className="mt-6 border-t border-border/60 pt-4">
            <NavigationMenu.Link asChild>
              <Link
                href={entry.footerLink.href}
                className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
              >
                {entry.footerLink.label}
              </Link>
            </NavigationMenu.Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DesktopNav() {
  const reduced = useIsomorphicReducedMotion();

  return (
    <NavigationMenu.Root
      aria-label="Primary"
      className="hidden lg:flex"
      delayDuration={100}
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
            <NavigationMenu.Item key={item.label}>
              <NavigationMenu.Trigger className={triggerClass}>
                {item.label}
                <ChevronDown
                  aria-hidden
                  className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <DropdownPanel entry={item} />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ),
        )}
      </NavigationMenu.List>

      <div className="absolute inset-x-0 top-full flex justify-center">
        <NavigationMenu.Viewport
          className={cn(
            "relative mt-3 overflow-hidden",
            "h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)]",
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
  const [open, setOpen] = React.useState(false);
  const toggleRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "transition-colors duration-300",
          scrolled || open
            ? "border-b border-border/60 bg-background/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <Logo />

          <DesktopNav />

          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href={siteConfig.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm font-medium text-foreground/70 transition-colors hover:text-foreground lg:inline-flex"
            >
              Log in
            </a>
            <BookCta size="default" className="inline-flex" />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary lg:hidden"
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
            className="mx-auto flex max-w-7xl flex-col divide-y divide-border/60 px-4 py-2 sm:px-6"
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
