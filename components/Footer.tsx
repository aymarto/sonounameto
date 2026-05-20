import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import GalleryName from "@/components/GalleryName";
import { ARTIST_NAME, GALLERY_NAME } from "@/lib/brand";
import { NAV_LINKS } from "@/lib/navigation";
import { SOCIAL_LINKS } from "@/lib/social";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer relative z-20 border-t border-white/10 bg-ink text-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="text-white">
            <GalleryName as="span" variant="inline" className="text-2xl" />
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-400">
            Galerie de l&apos;artiste {ARTIST_NAME}. Portraits, expositions et
            collaborations.
          </p>
          <SocialLinks variant="footer" className="mt-6" />
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-wide-xl text-neutral-500">
            Navigation
          </p>
          <ul className="space-y-2 text-sm text-neutral-400">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
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
          <p>
            © {year} {GALLERY_NAME} — {ARTIST_NAME}. Tous droits réservés.
          </p>
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
