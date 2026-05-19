export type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

/**
 * Valeurs par défaut (alignées sur .env.local).
 * Utilisées au build et en secours si les variables d'environnement sont absentes.
 * Les clés NEXT_PUBLIC_* Firebase sont publiques côté client.
 */
export const DEFAULT_FIREBASE_CONFIG: FirebasePublicConfig = {
  apiKey: "AIzaSyCYCRfUewRjcw5nBCGdwG7Qt1wv9uKireY",
  authDomain: "sonounameto-f266d.firebaseapp.com",
  projectId: "sonounameto-f266d",
  storageBucket: "sonounameto-f266d.firebasestorage.app",
  messagingSenderId: "288159771588",
  appId: "1:288159771588:web:e3d28305d836d2c1f7d291",
};

function envOrDefault(
  envValue: string | undefined,
  fallback: string
): string {
  const v = envValue?.trim();
  return v || fallback;
}

/** Config Firebase : variables d'env en priorité, puis valeurs par défaut. */
export function resolveFirebaseConfig(): FirebasePublicConfig {
  return {
    apiKey: envOrDefault(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        process.env.FIREBASE_API_KEY,
      DEFAULT_FIREBASE_CONFIG.apiKey
    ),
    authDomain: envOrDefault(
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
        process.env.FIREBASE_AUTH_DOMAIN,
      DEFAULT_FIREBASE_CONFIG.authDomain
    ),
    projectId: envOrDefault(
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
        process.env.FIREBASE_PROJECT_ID,
      DEFAULT_FIREBASE_CONFIG.projectId
    ),
    storageBucket: envOrDefault(
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        process.env.FIREBASE_STORAGE_BUCKET,
      DEFAULT_FIREBASE_CONFIG.storageBucket
    ),
    messagingSenderId: envOrDefault(
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
        process.env.FIREBASE_MESSAGING_SENDER_ID,
      DEFAULT_FIREBASE_CONFIG.messagingSenderId
    ),
    appId: envOrDefault(
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
      DEFAULT_FIREBASE_CONFIG.appId
    ),
  };
}

/** @deprecated Utiliser resolveFirebaseConfig() */
export function readFirebaseConfigFromEnv(): FirebasePublicConfig | null {
  const config = resolveFirebaseConfig();
  return isValidFirebaseConfig(config) ? config : null;
}

export function isValidFirebaseConfig(
  config: FirebasePublicConfig | null
): config is FirebasePublicConfig {
  return Boolean(config?.apiKey && config?.projectId);
}
