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
import { resolveFirebaseConfig } from "@/lib/firebase-config";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(true);

  useEffect(() => {
    // Valeurs build (.env / GitHub secrets) ou DEFAULT_FIREBASE_CONFIG en secours
    setRuntimeFirebaseConfig(resolveFirebaseConfig());

    const fb = getFirebase();
    if (!fb) {
      setFirebaseReady(false);
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(fb.auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
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
