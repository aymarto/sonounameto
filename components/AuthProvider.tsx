"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import {
  bootstrapFirebaseFromEnv,
  ensureFirebaseInitialized,
} from "@/lib/firebase-bootstrap";
import { getFirebase } from "@/lib/firebase";

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
  const [firebaseReady, setFirebaseReady] = useState(false);

  useLayoutEffect(() => {
    let unsubAuth: (() => void) | undefined;
    let active = true;

    function attachAuthListener() {
      const fb = getFirebase();
      if (!fb) {
        setLoading(false);
        return;
      }
      unsubAuth = onAuthStateChanged(fb.auth, (u) => {
        if (!active) return;
        setUser(u);
        setLoading(false);
      });
    }

    if (bootstrapFirebaseFromEnv()) {
      setFirebaseReady(true);
      attachAuthListener();
      return () => {
        active = false;
        unsubAuth?.();
      };
    }

    void ensureFirebaseInitialized().then((ready) => {
      if (!active) return;
      setFirebaseReady(ready);
      if (ready) {
        attachAuthListener();
      } else {
        setLoading(false);
      }
    });

    return () => {
      active = false;
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
