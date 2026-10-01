"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Mark } from "@/components/mark";

const links = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/suggest", label: "Suggest someone" },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  function renderLinks() {
    return links.map((link) => {
      const current = isCurrent(pathname, link.href);
      return (
        <li key={link.href}>
          <Link
            href={link.href}
            aria-current={current ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${
              current ? "bg-ink text-paper" : "text-ink hover:bg-white/70"
            }`}
          >
            {link.label}
          </Link>
        </li>
      );
    });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-sm">
          <Mark />
          <span>
            <span className="block font-display text-xl leading-none tracking-tight">Shukran TZ</span>
            <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.18em] text-muted">
              Living tribute
            </span>
          </span>
        </Link>
        <button
          type="button"
          className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpenPath(open ? null : pathname)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">{renderLinks()}</ul>
        </nav>
      </div>
      {open ? (
        <nav aria-label="Primary mobile" className="border-t border-line md:hidden">
          <ul id="mobile-nav" className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {renderLinks()}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
