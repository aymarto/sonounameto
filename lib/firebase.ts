import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import type { FirebasePublicConfig } from "@/lib/firebase-config";
import {
  isValidFirebaseConfig,
  resolveFirebaseConfig,
} from "@/lib/firebase-config";

/** Config injectée au runtime via /api/firebase-config (prioritaire sur le build). */
let runtimeConfig: FirebasePublicConfig | null = null;

export function setRuntimeFirebaseConfig(config: FirebasePublicConfig): void {
  runtimeConfig = config;
  cached = null;
}

function getConfig(): FirebasePublicConfig {
  if (runtimeConfig) return runtimeConfig;
  if (typeof window !== "undefined") {
    const inline = window.__FIREBASE_CONFIG__;
    if (inline && isValidFirebaseConfig(inline)) return inline;
  }
  return resolveFirebaseConfig();
}

export function isFirebaseConfigured(): boolean {
  return isValidFirebaseConfig(getConfig());
}

type FirebaseHandles = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

let cached: FirebaseHandles | null = null;

export function getFirebase(): FirebaseHandles | null {
  const config = getConfig();
  if (!isValidFirebaseConfig(config)) return null;
  if (cached) return cached;

  const app =
    getApps().length === 0 ? initializeApp(config) : getApp();

  cached = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  };

  return cached;
}
