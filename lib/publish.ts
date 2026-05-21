/** Absent ou true = visible sur le site public */
export function isPublished(item: { published?: boolean }): boolean {
  return item.published !== false;
}

export function publishLabel(published?: boolean): string {
  return isPublished({ published }) ? "Publié" : "Masqué";
}
