"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/components/AuthProvider";
import { getSiteSettings } from "@/lib/firestore";
import {
  EMPTY_SITE_SETTINGS,
  normalizeSiteSettings,
} from "@/lib/site-settings";
import type { SiteSettings } from "@/lib/types";

type SiteSettingsContextValue = {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => Promise<void>;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: EMPTY_SITE_SETTINGS,
  loading: true,
  refresh: async () => {},
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { firebaseReady } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    if (!firebaseReady) return;
    setLoading(true);
    try {
      const data = await getSiteSettings();
      setSettings(normalizeSiteSettings(data));
    } catch {
      setSettings(EMPTY_SITE_SETTINGS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(true);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await getSiteSettings();
        if (!cancelled) setSettings(normalizeSiteSettings(data));
      } catch {
        if (!cancelled) setSettings(EMPTY_SITE_SETTINGS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [firebaseReady]);

  const value = useMemo(
    () => ({ settings, loading, refresh }),
    [settings, loading]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
