"use client";

import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { siteConfig, type NavMenuSection } from "@/lib/site";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const triggerClasses =
  "h-auto rounded-none bg-transparent px-0 py-2 text-base font-normal text-primary-foreground/90 hover:bg-transparent hover:text-primary-foreground focus:bg-transparent focus:text-primary-foreground data-[state=open]:bg-transparent data-[state=open]:text-primary-foreground";

const topLinkClasses =
  "inline-flex h-auto items-center rounded-none bg-transparent px-0 py-2 text-base font-normal text-primary-foreground/90 transition-colors hover:bg-transparent hover:text-primary-foreground focus:bg-transparent focus:text-primary-foreground";

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

          <NavigationMenu
            viewport={false}
            aria-label="Primary"
            className="hidden md:flex"
          >
            <NavigationMenuList className="gap-5">
              {siteConfig.nav.map((item) => {
                const sections =
                  "menu" in item
                    ? (item.menu.sections as readonly NavMenuSection[])
                    : null;

                if (!sections) {
                  return (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild className={topLinkClasses}>
                        <Link href={item.href}>{item.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                }

                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger className={triggerClasses}>
                      <span className="inline-flex items-center gap-1.5">
                        {item.label}
                        <Plus
                          aria-hidden
                          className="size-4 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-45"
                        />
                      </span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="flex gap-10 p-6">
                        {sections.map((section) => (
                          <div key={section.heading} className="w-64">
                            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              {section.heading}
                            </p>
                            <ul className="flex flex-col gap-1">
                              {section.links.map((link) => (
                                <li key={link.href}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={link.href}
                                      className="group/link block rounded-lg p-2.5 transition-colors hover:bg-secondary focus:bg-secondary"
                                    >
                                      <span className="flex items-center gap-1.5 font-semibold text-foreground">
                                        {link.label}
                                        <span className="flex size-4 items-center justify-center rounded-full border border-current text-muted-foreground transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-foreground">
                                          <ArrowUpRight className="size-2.5" />
                                        </span>
                                      </span>
                                      <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                                        {link.description}
                                      </span>
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
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
            <Link href="/contact">Get your AI brand scorecard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
