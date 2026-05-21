"use client";

import GalleryName from "@/components/GalleryName";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

type Props = {
  visible: boolean;
};

export default function Preloader({ visible }: Props) {
  const { settings } = useSiteSettings();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={visible}
      aria-hidden={!visible}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink text-white transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <GalleryName
        as="p"
        variant="preloader"
        className="px-6"
        galleryName={settings.galleryName}
        suppressHydrationWarning
      />
      <div className="mt-8 h-px w-12 animate-pulse bg-white/40" />
      <p className="mt-6 text-[10px] uppercase tracking-wide-xl text-white/50">
        Chargement
      </p>
    </div>
  );
}
