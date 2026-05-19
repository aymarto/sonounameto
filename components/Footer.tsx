import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link
            href="/"
            className="font-display text-2xl tracking-wide-xl uppercase"
          >
            SONOUNAMETO
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600">
            Galerie officielle de l&apos;artiste. Portraits, expositions et
            collaborations.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Navigation</p>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>
              <Link href="/galerie" className="hover:text-black">
                Ma galerie
              </Link>
            </li>
            <li>
              <Link href="/evenements" className="hover:text-black">
                Mes évènements
              </Link>
            </li>
            <li>
              <Link href="/a-propos" className="hover:text-black">
                À propos de moi
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-black">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Suivre</p>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>
              <a href="#" className="hover:text-black">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Facebook
              </a>
            </li>
            <li>
              <a href="mailto:contact@sonounameto.art" className="hover:text-black">
                contact@sonounameto.art
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/10">
        <div className="container-page flex flex-col items-start justify-between gap-3 py-6 text-xs text-neutral-500 md:flex-row md:items-center">
          <p>© {year} SONOUNAMETO — Tous droits réservés.</p>
          <Link
            href="/admin"
            className="uppercase tracking-wide-xl text-neutral-500 hover:text-black"
          >
            Dashboard admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
