/** Précharge une image (ne bloque pas si erreur). */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function preloadImages(urls: string[]): Promise<void> {
  return Promise.all(urls.map(preloadImage)).then(() => undefined);
}

/** Images locales du hero (repli si Firebase absent). */
export const HERO_PRELOAD_URLS = [
  "/images/portrait_0.jpeg",
  "/images/portrait_1.jpeg",
  "/images/portrait_2.jpeg",
];
