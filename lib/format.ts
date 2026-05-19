export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatDateRange(start: string, end?: string): string {
  if (!end) return formatDate(start);
  return `${formatDate(start)} — ${formatDate(end)}`;
}
