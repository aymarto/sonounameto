"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

const NAV = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/galerie", label: "Galerie" },
  { href: "/admin/evenements", label: "Évènements" },
  { href: "/admin/hero", label: "Hero / Accueil" },
];

function isActive(pathname: string, item: (typeof NAV)[number]) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, firebaseReady, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!firebaseReady) return;
    if (!loading && !user) {
      const from = encodeURIComponent(pathname || "/admin");
      router.replace(`/login?from=${from}`);
    }
  }, [user, loading, firebaseReady, pathname, router]);

  if (loading && !firebaseReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-xs uppercase tracking-wide-xl text-neutral-500">
          Chargement…
        </p>
      </main>
    );
  }

  if (!firebaseReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper px-6">
        <div className="max-w-md border border-black/10 bg-white p-8 text-sm">
          <p className="eyebrow mb-3">Configuration requise</p>
          <p className="text-neutral-700">
            Les variables Firebase ne sont pas lues par le serveur. Dans cPanel →
            Setup Node.js App → Environment variables, vérifie les{" "}
            <code className="bg-neutral-100 px-1">NEXT_PUBLIC_FIREBASE_*</code>
            , puis clique sur <strong>Restart</strong>.
          </p>
          <p className="mt-3 text-neutral-600 text-xs">
            Test : ouvre{" "}
            <code className="bg-neutral-100 px-1">/api/firebase-config</code>{" "}
            — tu dois voir <code>configured: true</code>.
          </p>
          <Link href="/" className="btn-line mt-6">
            Retour au site
          </Link>
        </div>
      </main>
    );
  }

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-xs uppercase tracking-wide-xl text-neutral-500">
          Chargement…
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white">
        <div className="flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setNavOpen((v) => !v)}
              aria-label="Ouvrir le menu"
              className="inline-flex h-10 w-10 items-center justify-center md:hidden"
            >
              <div className="relative h-3 w-6">
                <span
                  className={`absolute left-0 top-0 block h-px w-6 bg-black transition-transform ${
                    navOpen ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[12px] block h-px w-6 bg-black transition-transform ${
                    navOpen ? "-translate-y-[6px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
            <Link
              href="/admin"
              className="font-display text-xl tracking-wide-xl uppercase"
            >
              SONOUNAMETO
            </Link>
            <span className="hidden text-xs uppercase tracking-wide-xl text-neutral-500 md:inline">
              · Admin
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              target="_blank"
              className="hidden text-xs uppercase tracking-wide-xl text-neutral-600 hover:text-black md:inline"
            >
              Voir le site ↗
            </Link>
            <span className="hidden text-xs text-neutral-500 md:inline">
              {user.email}
            </span>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.replace("/login");
              }}
              className="text-xs uppercase tracking-wide-xl text-neutral-700 hover:text-black"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar desktop */}
        <aside className="hidden w-60 shrink-0 border-r border-black/10 bg-white md:block">
          <nav className="sticky top-16 px-4 py-8">
            <ul className="space-y-1">
              {NAV.map((item) => {
                const active = isActive(pathname || "", item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-black text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Sidebar mobile */}
        <div
          className={`fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden ${
            navOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onClick={() => setNavOpen(false)}
          aria-hidden
        />
        <aside
          className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform border-r border-black/10 bg-white transition-transform md:hidden ${
            navOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="px-4 py-8">
            <ul className="space-y-1">
              {NAV.map((item) => {
                const active = isActive(pathname || "", item);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-3 py-2 text-sm ${
                        active
                          ? "bg-black text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 border-t border-black/10 pt-6 text-xs text-neutral-500">
              {user.email}
            </div>
          </nav>
        </aside>

        <main className="min-h-[calc(100vh-4rem)] flex-1">
          <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-10 md:py-14">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
