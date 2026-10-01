"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Home", track: undefined },
  { href: "/categories", label: "Categories", track: "open_category" },
  { href: "/suggest", label: "Suggest someone", track: "suggest" },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/88 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-sm">
          <Mark />
          <span>
            <span className="block font-display text-xl leading-none tracking-tight">Shukran TZ</span>
            <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
              Living tribute
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const current = isCurrent(pathname, link.href);
            return (
              <Button key={link.href} asChild variant={current ? "secondary" : "ghost"}>
                <Link href={link.href} aria-current={current ? "page" : undefined} data-track={link.track}>
                  {link.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden" aria-label="Open menu">
              <Menu />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm">
            <SheetHeader className="px-6 pt-8">
              <SheetTitle className="font-display text-3xl font-normal">Shukran TZ</SheetTitle>
              <SheetDescription>A living tribute. Working title.</SheetDescription>
            </SheetHeader>
            <nav aria-label="Primary mobile" className="flex flex-col gap-2 px-6">
              {links.map((link) => {
                const current = isCurrent(pathname, link.href);
                return (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      data-track={link.track}
                      className="flex min-h-12 items-center font-display text-3xl tracking-tight"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
