/** Firestore n'accepte pas les valeurs `undefined` (même dans les objets imbriqués). */

function isFirestoreFieldValue(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "_methodName" in (value as object)
  );
}

function cleanFirestoreValue(value: unknown): unknown {
  if (value === undefined) return undefined;
  if (isFirestoreFieldValue(value)) return value;

  if (Array.isArray(value)) {
    return value
      .map(cleanFirestoreValue)
      .filter((item) => item !== undefined);
  }

  if (value !== null && typeof value === "object") {
    const obj: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(
      value as Record<string, unknown>
    )) {
      const cleaned = cleanFirestoreValue(nested);
      if (cleaned !== undefined) obj[key] = cleaned;
    }
    return obj;
  }

  return value;
}

export function firestoreWriteData(
  data: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    const cleaned = cleanFirestoreValue(value);
    if (cleaned !== undefined) result[key] = cleaned;
  }
  return result;
}

/** @deprecated Utiliser firestoreWriteData */
export function withoutUndefined<T extends Record<string, unknown>>(
  data: T
): Record<string, unknown> {
  return firestoreWriteData(data);
}
