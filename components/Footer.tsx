"use client";

import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import GalleryName from "@/components/GalleryName";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { ARTIST_NAME } from "@/lib/brand";
import { NAV_LINKS } from "@/lib/navigation";

export default function Footer() {
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer relative z-20 border-t border-white/10 bg-ink text-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="text-white">
            <GalleryName
              as="span"
              variant="inline"
              className="text-2xl"
              galleryName={settings.galleryName}
            />
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-400">
            {settings.footerText}
          </p>
          <SocialLinks
            variant="footer"
            className="mt-6"
            email={settings.contactEmail}
            instagram={settings.contactInstagram}
            facebook={settings.contactFacebook}
            portfolio={settings.portfolioUrl}
          />
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
            href={`mailto:${settings.contactEmail}`}
            className="text-sm text-neutral-400 transition-colors hover:text-white"
          >
            {settings.contactEmail}
          </a>
          <p className="mt-4 text-sm text-neutral-500">
            {settings.contactLocation}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-4 text-xs text-neutral-500 md:flex-row md:items-center">
          <p>
            © {year} {settings.galleryName} — {ARTIST_NAME}. Tous droits réservés.
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
