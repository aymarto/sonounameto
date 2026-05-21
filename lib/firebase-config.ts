export type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

/**
 * Repli vide — la config doit venir des variables d'environnement
 * (.env.local en dev, cPanel → Setup Node.js App en production).
 * Les clés Firebase client sont publiques ; la sécurité repose sur Auth + règles Firestore.
 */
export const DEFAULT_FIREBASE_CONFIG: FirebasePublicConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

function envOrDefault(
  envValue: string | undefined,
  fallback: string
): string {
  const v = envValue?.trim();
  return v || fallback;
}

/** Config Firebase : variables d'env uniquement (pas de secrets dans le code). */
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
