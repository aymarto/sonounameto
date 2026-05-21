"use client";

import CmsImage from "@/components/CmsImage";
import Link from "next/link";
import ContentUnavailable from "@/components/ContentUnavailable";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { ARTIST_NAME } from "@/lib/brand";
import { hasAboutContent, splitParagraphs } from "@/lib/site-settings";

export default function AboutSection() {
  const { settings, loading } = useSiteSettings();

  if (loading) {
    return (
      <section className="section-pad bg-white">
        <div className="container-page animate-pulse py-8 text-sm text-neutral-500">
          Chargement…
        </div>
      </section>
    );
  }

  if (!hasAboutContent(settings)) {
    return (
      <section className="section-pad bg-white">
        <ContentUnavailable className="py-12" />
      </section>
    );
  }

  const paragraphs = splitParagraphs(settings.aboutDescription);

  return (
    <section className="section-pad bg-white">
      <div className="container-page grid gap-8 md:grid-cols-2 md:items-center md:gap-10">
        {settings.aboutImageUrl && (
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <CmsImage
              src={settings.aboutImageUrl}
              alt={`Portrait de ${ARTIST_NAME}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover grayscale"
              priority
            />
          </div>
        )}
        <div>
          {settings.aboutEyebrow && (
            <p className="eyebrow">{settings.aboutEyebrow}</p>
          )}
          {settings.aboutTitle && (
            <h2 className="section-title mt-3">{settings.aboutTitle}</h2>
          )}
          {paragraphs.length > 0 && (
            <div className="mt-4 space-y-3 text-neutral-700 leading-relaxed">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          )}
          <Link href="/a-propos" className="btn-line mt-6">
            En savoir plus
          </Link>
        </div>
      </div>
    </section>
  );
}
