import { resolveFirebaseConfig } from "@/lib/firebase-config";

type VerifiedAdmin = {
  uid: string;
  email?: string;
};

/** Vérifie un ID token Firebase Auth (sans firebase-admin). */
export async function verifyAdminIdToken(
  idToken: string
): Promise<VerifiedAdmin | null> {
  const apiKey = resolveFirebaseConfig().apiKey;
  if (!apiKey) return null;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!res.ok) return null;

  const data = (await res.json()) as {
    users?: Array<{ localId?: string; email?: string }>;
  };

  const user = data.users?.[0];
  if (!user?.localId) return null;

  return {
    uid: user.localId,
    email: user.email,
  };
}

export function getBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}
