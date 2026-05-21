/** Précharge une image (ne bloque pas si erreur). */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (!src) {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function preloadImages(urls: string[]): Promise<void> {
  const unique = [...new Set(urls.filter(Boolean))];
  return Promise.all(unique.map(preloadImage)).then(() => undefined);
}

/** URLs critiques selon la page visitée au premier chargement. */
export function getCriticalImageUrls(_pathname: string): string[] {
  return [];
}

function isInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return (
    rect.top < window.innerHeight + 120 &&
    rect.bottom > -120 &&
    rect.left < window.innerWidth + 120 &&
    rect.right > -120
  );
}

/** Ne bloque que les images visibles ou chargées en eager / priority. */
function shouldWaitForDomImage(img: HTMLImageElement): boolean {
  if (img.getAttribute("loading") === "lazy") {
    return isInViewport(img);
  }
  return true;
}

function waitForImageElement(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalHeight > 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const done = () => resolve();
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });
}

/** Laisse React peindre le DOM puis attend les <img> du contenu. */
export async function waitForDomImages(
  root: HTMLElement | null,
  maxMs = 15000
): Promise<void> {
  if (!root) return;

  await new Promise<void>((r) => {
    requestAnimationFrame(() => requestAnimationFrame(() => r()));
  });

  const deadline = Date.now() + maxMs;

  while (Date.now() < deadline) {
    const imgs = Array.from(root.querySelectorAll("img")).filter(
      shouldWaitForDomImage
    );
    if (imgs.length === 0) {
      return;
    }

    await Promise.race([
      Promise.all(imgs.map(waitForImageElement)),
      new Promise((r) => setTimeout(r, 300)),
    ]);

    const pending = imgs.filter(
      (img) => !(img.complete && img.naturalHeight > 0)
    );
    if (pending.length === 0) {
      return;
    }

    await new Promise((r) => setTimeout(r, 80));
  }
}
