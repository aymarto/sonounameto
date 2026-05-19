import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import { SOCIAL_LINKS } from "@/lib/social";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer relative z-20 border-t border-white/10 bg-ink text-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link
            href="/"
            className="font-display text-2xl tracking-wide-xl uppercase text-white"
          >
            SONOUNAMETO
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-400">
            Galerie officielle de l&apos;artiste. Portraits, expositions et
            collaborations.
          </p>
          <SocialLinks variant="footer" className="mt-6" />
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-wide-xl text-neutral-500">
            Navigation
          </p>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              <Link href="/galerie" className="hover:text-white">
                Ma galerie
              </Link>
            </li>
            <li>
              <Link href="/evenements" className="hover:text-white">
                Mes évènements
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="hover:text-white">
                À propos de moi
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-wide-xl text-neutral-500">
            Contact
          </p>
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            {SOCIAL_LINKS.email}
          </a>
          <p className="mt-4 text-sm text-neutral-500">
            Lomé — sur rendez-vous
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-4 text-xs text-neutral-500 md:flex-row md:items-center">
          <p>© {year} SONOUNAMETO — Tous droits réservés.</p>
          <Link
            href="/admin"
            className="uppercase tracking-wide-xl text-neutral-500 hover:text-white"
          >
            Dashboard admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
