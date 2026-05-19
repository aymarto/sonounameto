"use client";

import { useEffect } from "react";

const STORAGE_KEY = "sonounameto-app-version";

/**
 * Détecte un nouveau déploiement via /version.json et recharge une fois.
 * Un site ne peut pas effacer le cache du navigateur à la place de l'utilisateur.
 */
export default function DeployVersionCheck() {
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch(`/version.json?_=${Date.now()}`, {
          cache: "no-store",
          headers: { Pragma: "no-cache" },
        });
        if (!res.ok) return;

        const data = (await res.json()) as { version?: string };
        const remote = data.version;
        if (!remote || cancelled) return;

        const stored = sessionStorage.getItem(STORAGE_KEY);

        if (stored && stored !== remote) {
          sessionStorage.setItem(STORAGE_KEY, remote);
          window.location.reload();
          return;
        }

        if (!stored) {
          sessionStorage.setItem(STORAGE_KEY, remote);
        }
      } catch {
        /* hors ligne ou fichier absent */
      }
    };

    check();
    const interval = window.setInterval(check, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
