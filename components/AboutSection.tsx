"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { ARTIST_NAME } from "@/lib/brand";
import { splitParagraphs } from "@/lib/site-settings";

export default function AboutSection() {
  const { settings } = useSiteSettings();
  const paragraphs = splitParagraphs(settings.aboutDescription);

  return (
    <section className="section-pad bg-white">
      <div className="container-page grid gap-8 md:grid-cols-2 md:items-center md:gap-10">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={settings.aboutImageUrl}
            alt={`Portrait de ${ARTIST_NAME}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover grayscale"
            priority
            unoptimized={settings.aboutImageUrl.startsWith("http")}
          />
        </div>
        <div>
          <p className="eyebrow">{settings.aboutEyebrow}</p>
          <h2 className="section-title mt-3">{settings.aboutTitle}</h2>
          <div className="mt-4 space-y-3 text-neutral-700 leading-relaxed">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <Link href="/a-propos" className="btn-line mt-6">
            En savoir plus
          </Link>
        </div>
      </div>
    </section>
  );
}
