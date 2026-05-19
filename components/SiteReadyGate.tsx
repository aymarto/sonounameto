"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Preloader from "@/components/Preloader";
import { HERO_PRELOAD_URLS, preloadImages } from "@/lib/preload";

const MIN_DISPLAY_MS = 600;
const MAX_WAIT_MS = 12000;

function waitForWindowLoad(): Promise<void> {
  if (document.readyState === "complete") {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true });
  });
}

export default function SiteReadyGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    let cancelled = false;

    document.body.classList.add("preloader-active");

    const run = async () => {
      const minDelay = new Promise<void>((r) =>
        setTimeout(r, MIN_DISPLAY_MS)
      );
      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      const windowLoad = waitForWindowLoad();

      const criticalImages =
        pathname === "/"
          ? preloadImages(HERO_PRELOAD_URLS)
          : Promise.resolve();

      const timeout = new Promise<void>((resolve) =>
        setTimeout(resolve, MAX_WAIT_MS)
      );

      await Promise.race([
        Promise.all([minDelay, fontsReady, windowLoad, criticalImages]),
        timeout,
      ]);

      if (cancelled) return;

      setReady(true);
      document.body.classList.remove("preloader-active");

      setTimeout(() => {
        if (!cancelled) setShowPreloader(false);
      }, 750);
    };

    run();

    return () => {
      cancelled = true;
      document.body.classList.remove("preloader-active");
    };
    // Premier chargement uniquement (pas à chaque changement de page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showPreloader && <Preloader visible={!ready} />}

      <div
        className={`transition-opacity duration-700 ease-out ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!ready}
      >
        {children}
      </div>
    </>
  );
}
