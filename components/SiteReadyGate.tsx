"use client";

import { useEffect, useState } from "react";
import Preloader from "@/components/Preloader";

const SESSION_KEY = "nounameto-site-ready";
const FAILSAFE_MS = 2500;

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
  // Toujours false au 1er rendu (serveur + hydratation) — évite l'erreur d'hydratation.
  const [showPreloader, setShowPreloader] = useState(false);

  useEffect(() => {
    if (isSessionReady()) {
      document.body.classList.remove("preloader-active");
      return;
    }

    setShowPreloader(true);
    document.body.classList.add("preloader-active");

    const finish = () => {
      document.body.classList.remove("preloader-active");
      markSessionReady();
      setShowPreloader(false);
    };

    const failSafe = window.setTimeout(finish, FAILSAFE_MS);
    void (document.fonts?.ready ?? Promise.resolve()).then(finish);

    return () => {
      window.clearTimeout(failSafe);
      document.body.classList.remove("preloader-active");
    };
  }, []);

  return (
    <>
      {showPreloader && <Preloader visible />}
      {children}
    </>
  );
}
