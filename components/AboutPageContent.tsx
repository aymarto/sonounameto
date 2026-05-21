"use client";

import CmsImage from "@/components/CmsImage";
import ContentUnavailable from "@/components/ContentUnavailable";
import PageHeader from "@/components/PageHeader";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { ARTIST_NAME } from "@/lib/brand";
import { hasAboutContent, splitParagraphs } from "@/lib/site-settings";

export default function AboutPageContent() {
  const { settings, loading, loaded } = useSiteSettings();

  if (loading || !loaded) {
    return (
      <div className="container-page animate-pulse py-8 text-sm text-neutral-500">
        Chargement…
      </div>
    );
  }

  if (!hasAboutContent(settings)) {
    return (
      <>
        <PageHeader
          eyebrow="À propos"
          title="À propos"
          description="Biographie et démarche artistique."
        />
        <ContentUnavailable />
      </>
    );
  }

  const paragraphs = splitParagraphs(settings.aboutDescription);

  return (
    <>
      <PageHeader
        eyebrow={settings.aboutEyebrow || "À propos"}
        title={settings.aboutTitle || "À propos"}
        description="Biographie et démarche artistique."
      />

      <section className="page-content">
        <div className="container-page grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-10">
          {settings.aboutImageUrl && (
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <CmsImage
                key={settings.aboutImageUrl}
                src={settings.aboutImageUrl}
                alt={`Portrait de ${ARTIST_NAME}`}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover grayscale"
              />
            </div>
          )}

          {paragraphs.length > 0 ? (
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <ContentUnavailable />
          )}
        </div>
      </section>
    </>
  );
}
