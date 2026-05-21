import { getFirebase, setRuntimeFirebaseConfig } from "@/lib/firebase";
import type { FirebasePublicConfig } from "@/lib/firebase-config";
import {
  isValidFirebaseConfig,
  resolveFirebaseConfig,
} from "@/lib/firebase-config";

declare global {
  interface Window {
    __FIREBASE_CONFIG__?: FirebasePublicConfig;
  }
}

function readInlineConfig(): FirebasePublicConfig | null {
  if (typeof window === "undefined") return null;
  const inline = window.__FIREBASE_CONFIG__;
  return inline && isValidFirebaseConfig(inline) ? inline : null;
}

export function applyFirebaseConfig(config: FirebasePublicConfig): void {
  setRuntimeFirebaseConfig(config);
}

/** Lit la config injectée dans le HTML ou les variables build (.env.local). */
export function bootstrapFirebaseFromEnv(): boolean {
  const inline = readInlineConfig();
  if (inline) {
    applyFirebaseConfig(inline);
    return Boolean(getFirebase());
  }

  const envConfig = resolveFirebaseConfig();
  if (isValidFirebaseConfig(envConfig)) {
    applyFirebaseConfig(envConfig);
    return Boolean(getFirebase());
  }

  return false;
}

let remoteInit: Promise<boolean> | null = null;

async function fetchRemoteConfig(): Promise<boolean> {
  try {
    const res = await fetch("/api/firebase-config", { cache: "no-store" });
    if (!res.ok) return false;
    const data = (await res.json()) as FirebasePublicConfig & {
      configured?: boolean;
    };
    if (data.configured && isValidFirebaseConfig(data)) {
      applyFirebaseConfig({
        apiKey: data.apiKey,
        authDomain: data.authDomain,
        projectId: data.projectId,
        storageBucket: data.storageBucket,
        messagingSenderId: data.messagingSenderId,
        appId: data.appId,
      });
      return Boolean(getFirebase());
    }
  } catch {
    // API indisponible
  }
  return false;
}

/** Initialise Firebase (inline → env → API), une seule fois. */
export function ensureFirebaseInitialized(): Promise<boolean> {
  if (bootstrapFirebaseFromEnv()) return Promise.resolve(true);
  if (!remoteInit) {
    remoteInit = fetchRemoteConfig();
  }
  return remoteInit;
}
