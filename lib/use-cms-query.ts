"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

/**
 * Charge des données CMS après Firebase.
 * N’affiche pas « vide » tant que loading — ignore les réponses obsolètes (Strict Mode).
 */
export function useCmsQuery<T>(
  loadFn: () => Promise<T>,
  deps: unknown[] = []
) {
  const { firebaseReady } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(true);
      return;
    }

    let ignore = false;
    setLoading(true);

    void loadFn()
      .then((result) => {
        if (!ignore) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setData(null);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
    // loadFn volontairement hors deps — une seule charge par firebaseReady + deps métier
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseReady, ...deps]);

  return {
    data,
    loading: !firebaseReady || loading,
    ready: firebaseReady && !loading,
  };
}
