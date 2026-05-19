"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/galerie", label: "Ma galerie" },
  { href: "/evenements", label: "Mes évènements" },
  { href: "/a-propos", label: "À propos de moi" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container-page flex h-16 items-center md:h-20">
        {/* Mobile: logo left, button right. Desktop: logo centered, links underneath/around */}
        <div className="flex w-full items-center justify-between md:hidden">
          <Link
            href="/"
            className="font-display text-xl tracking-wide-xl uppercase"
          >
            SONOUNAMETO
          </Link>
          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center"
          >
            <span className="sr-only">Menu</span>
            <div className="relative h-3 w-6">
              <span
                className={`absolute left-0 top-0 block h-px w-6 bg-black transition-transform ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[12px] block h-px w-6 bg-black transition-transform ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Desktop layout: links on both sides, logo centered */}
        <nav className="hidden w-full grid-cols-3 items-center md:grid">
          <ul className="flex items-center gap-8 text-xs uppercase tracking-wide-xl">
            {NAV_LINKS.slice(0, 2).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative pb-1 transition-colors hover:text-black ${
                    pathname === link.href
                      ? "text-black after:absolute after:-bottom-0 after:left-0 after:h-px after:w-full after:bg-black"
                      : "text-neutral-600"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex justify-center">
            <Link
              href="/"
              className="font-display text-2xl tracking-wide-xl uppercase"
            >
              SONOUNAMETO
            </Link>
          </div>

          <ul className="flex items-center justify-end gap-8 text-xs uppercase tracking-wide-xl">
            {NAV_LINKS.slice(2).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative pb-1 transition-colors hover:text-black ${
                    pathname === link.href
                      ? "text-black after:absolute after:-bottom-0 after:left-0 after:h-px after:w-full after:bg-black"
                      : "text-neutral-600"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className={`md:hidden overflow-hidden border-t border-black/10 bg-white transition-[max-height,opacity] duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="container-page flex flex-col gap-1 py-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block py-3 text-sm uppercase tracking-wide-xl ${
                  pathname === link.href ? "text-black" : "text-neutral-600"
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
