"use client";

import { useEffect, useState } from "react";
import Preloader from "@/components/Preloader";
import { preloadImages } from "@/lib/preload";

const SESSION_KEY = "nounameto-site-ready";
/** Délai max absolu — la page s’affiche toujours après ce délai */
const FAILSAFE_MS = 3000;

function isSessionReady(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markSessionReady(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

export default function SiteReadyGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    if (isSessionReady()) {
      setReady(true);
      setShowPreloader(false);
      document.body.classList.remove("preloader-active");
      return;
    }

    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      setReady(true);
      document.body.classList.remove("preloader-active");
      markSessionReady();
      window.setTimeout(() => setShowPreloader(false), 400);
    };

    document.body.classList.add("preloader-active");

    const failSafe = window.setTimeout(finish, FAILSAFE_MS);

    void Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      preloadImages([]),
    ]).then(finish);

    return () => {
      window.clearTimeout(failSafe);
      document.body.classList.remove("preloader-active");
    };
    // Une seule passe au montage (évite blocage React Strict Mode + re-navigations)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {showPreloader && <Preloader visible={!ready} />}

      <div
        className={
          ready
            ? "opacity-100 transition-opacity duration-500 ease-out"
            : "pointer-events-none opacity-0 select-none"
        }
        aria-hidden={!ready}
      >
        {children}
      </div>
    </>
  );
}
