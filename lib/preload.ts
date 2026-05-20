import { artworks, events } from "@/lib/data";
import {
  projects,
  rawWorkImages,
  references,
} from "@/lib/site-content";

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

/** Images locales du hero (repli si Firebase absent). */
export const HERO_PRELOAD_URLS = [
  "/images/portrait_0.jpeg",
  "/images/portrait_1.jpeg",
  "/images/portrait_2.jpeg",
];

const ABOUT_IMAGE = "/images/portrait_3_1.jpeg";

/** URLs critiques selon la page visitée au premier chargement. */
export function getCriticalImageUrls(pathname: string): string[] {
  if (pathname === "/") {
    return [
      ...HERO_PRELOAD_URLS,
      ABOUT_IMAGE,
      ...artworks.slice(0, 4).map((a) => a.imageUrl),
    ];
  }
  if (pathname === "/oeuvres" || pathname.startsWith("/oeuvres/")) {
    return artworks.slice(0, 9).map((a) => a.imageUrl);
  }
  if (pathname === "/projets") {
    return projects.map((p) => p.coverImageUrl);
  }
  if (pathname.startsWith("/projets/")) {
    const id = pathname.split("/")[2];
    const project = projects.find((p) => p.id === id);
    if (project) {
      return [
        project.coverImageUrl,
        ...project.artworkIds
          .map((aid) => artworks.find((a) => a.id === aid)?.imageUrl)
          .filter((u): u is string => Boolean(u)),
      ];
    }
  }
  if (pathname === "/evenements") {
    return events
      .map((e) => e.imageUrl)
      .filter((u): u is string => Boolean(u));
  }
  if (pathname === "/travail-brut") {
    return rawWorkImages.map((i) => i.imageUrl);
  }
  if (pathname === "/references") {
    return references.map((r) => r.imageUrl);
  }
  if (pathname === "/a-propos") {
    return ["/images/portrait_3.jpeg", ABOUT_IMAGE];
  }
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
