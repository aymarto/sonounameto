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
  loaded: boolean;
  refresh: () => Promise<void>;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: EMPTY_SITE_SETTINGS,
  loading: true,
  loaded: false,
  refresh: async () => {},
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { firebaseReady } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  async function refresh() {
    if (!firebaseReady) return;
    setLoading(true);
    setLoaded(false);
    try {
      const data = await getSiteSettings();
      setSettings(normalizeSiteSettings(data));
      setLoaded(true);
    } catch {
      setSettings(EMPTY_SITE_SETTINGS);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(true);
      setLoaded(false);
      return;
    }

    let ignore = false;
    setLoading(true);
    setLoaded(false);

    void getSiteSettings()
      .then((data) => {
        if (!ignore) {
          setSettings(normalizeSiteSettings(data));
          setLoaded(true);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setSettings(EMPTY_SITE_SETTINGS);
          setLoaded(true);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [firebaseReady]);

  const value = useMemo(
    () => ({ settings, loading, loaded, refresh }),
    [settings, loading, loaded]
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
