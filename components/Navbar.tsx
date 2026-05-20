"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GalleryName from "@/components/GalleryName";
import { NAV_LINKS, isNavActive } from "@/lib/navigation";

const linkClass = (active: boolean) =>
  `relative whitespace-nowrap pb-1 transition-colors ${
    active
      ? "text-white after:absolute after:-bottom-0 after:left-0 after:h-px after:w-full after:bg-white"
      : "text-neutral-400 hover:text-white"
  }`;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header sticky top-0 z-50 w-full border-b border-white/10 bg-ink text-white">
      <div className="container-page">
        <div className="flex h-14 items-center justify-between md:h-auto md:flex-col md:gap-3 md:py-3">
          <div className="flex w-full items-center justify-between md:w-auto md:justify-center">
            <Link
              href="/"
              className="text-white"
              suppressHydrationWarning
            >
              <GalleryName as="span" variant="nav" suppressHydrationWarning />
            </Link>
            <button
              type="button"
              aria-label="Ouvrir le menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center md:hidden"
            >
              <span className="sr-only">Menu</span>
              <div className="relative h-3 w-6">
                <span
                  className={`absolute left-0 top-0 block h-px w-6 bg-white transition-transform ${
                    open ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[12px] block h-px w-6 bg-white transition-transform ${
                    open ? "-translate-y-[6px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          <nav className="hidden md:block">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-wide-xl lg:gap-x-6 lg:text-xs">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={linkClass(isNavActive(pathname, link.href))}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden border-t border-white/10 bg-ink transition-[max-height,opacity] duration-300 ease-in-out ${
          open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="container-page flex flex-col gap-0 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block py-2.5 text-sm uppercase tracking-wide-xl ${
                  isNavActive(pathname, link.href)
                    ? "text-white"
                    : "text-neutral-400"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
