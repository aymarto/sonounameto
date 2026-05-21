"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { getFirebase, setRuntimeFirebaseConfig } from "@/lib/firebase";
import type { FirebasePublicConfig } from "@/lib/firebase-config";
import {
  isValidFirebaseConfig,
  resolveFirebaseConfig,
} from "@/lib/firebase-config";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  firebaseReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  firebaseReady: false,
  signIn: async () => {},
  signOut: async () => {},
});

async function loadFirebaseConfig(): Promise<FirebasePublicConfig | null> {
  try {
    const res = await fetch("/api/firebase-config", { cache: "no-store" });
    if (!res.ok) throw new Error("Config indisponible");
    const data = (await res.json()) as FirebasePublicConfig & {
      configured?: boolean;
    };
    if (data.configured && isValidFirebaseConfig(data)) {
      return {
        apiKey: data.apiKey,
        authDomain: data.authDomain,
        projectId: data.projectId,
        storageBucket: data.storageBucket,
        messagingSenderId: data.messagingSenderId,
        appId: data.appId,
      };
    }
  } catch {
    // API indisponible (ex. premier chargement) — repli build / .env.local
  }

  const fallback = resolveFirebaseConfig();
  return isValidFirebaseConfig(fallback) ? fallback : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let unsubAuth: (() => void) | undefined;

    (async () => {
      const config = await loadFirebaseConfig();
      if (cancelled) return;

      if (config) {
        setRuntimeFirebaseConfig(config);
      }

      const fb = getFirebase();
      if (!fb) {
        setFirebaseReady(false);
        setLoading(false);
        return;
      }

      unsubAuth = onAuthStateChanged(fb.auth, (u) => {
        setUser(u);
        setLoading(false);
      });
    })();

    return () => {
      cancelled = true;
      unsubAuth?.();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      firebaseReady,
      async signIn(email, password) {
        const fb = getFirebase();
        if (!fb) throw new Error("Firebase n'est pas configuré.");
        await signInWithEmailAndPassword(fb.auth, email, password);
      },
      async signOut() {
        const fb = getFirebase();
        if (!fb) return;
        await fbSignOut(fb.auth);
      },
    }),
    [user, loading, firebaseReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
