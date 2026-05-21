/** Normalise /uploads/… vers /api/media/… (servi par Next.js, local + prod). */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("/uploads/")) {
    return `/api/media/${trimmed.slice("/uploads/".length)}`;
  }
  return trimmed;
}

export function isCmsMediaUrl(url: string): boolean {
  return (
    url.startsWith("/uploads/") ||
    url.startsWith("/api/media/") ||
    url.startsWith("uploads/")
  );
}
