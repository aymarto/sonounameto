import { GALLERY_NAME } from "@/lib/brand";

type Props = {
  as?: "p" | "span" | "h1";
  /** hero | preloader | nav | inline */
  variant?: "hero" | "preloader" | "nav" | "inline";
  className?: string;
  suppressHydrationWarning?: boolean;
  galleryName?: string;
};

const variantClass: Record<NonNullable<Props["variant"]>, string> = {
  hero:
    "font-display uppercase leading-[1.05] tracking-normal text-[clamp(1.35rem,6.5vw,3.75rem)] md:tracking-wide-xl",
  preloader:
    "max-w-[min(100%,18rem)] text-center font-display text-xl uppercase leading-tight tracking-normal md:max-w-none md:text-3xl md:tracking-wide-xl",
  nav: "font-display text-lg uppercase leading-tight tracking-[0.05em] whitespace-nowrap sm:text-xl md:text-2xl md:tracking-wide-xl",
  inline: "font-display uppercase tracking-normal md:tracking-wide-xl",
};

/** Affichage du nom de galerie — une ligne dans le header. */
export default function GalleryName({
  as: Tag = "span",
  variant = "inline",
  className = "",
  suppressHydrationWarning,
  galleryName = GALLERY_NAME,
}: Props) {
  if (variant === "nav") {
    return (
      <Tag
        className={`${variantClass.nav} ${className}`.trim()}
        suppressHydrationWarning={suppressHydrationWarning}
      >
        {galleryName}
      </Tag>
    );
  }

  const [line1, line2] = splitGalleryName(galleryName);

  return (
    <Tag
      className={`${variantClass[variant]} ${className}`.trim()}
      suppressHydrationWarning={suppressHydrationWarning}
    >
      <span className="block sm:inline">{line1} </span>
      <span className="block sm:inline">{line2}</span>
    </Tag>
  );
}

function splitGalleryName(name: string): [string, string] {
  const normalized = name.replace(/\u00a0/g, " ").trim();
  const match = normalized.match(/^Galerie\s+(.+)$/i);
  if (match) return ["Galerie", match[1]];
  const parts = normalized.split(/\s+/);
  if (parts.length <= 1) return [normalized, ""];
  return [parts[0], parts.slice(1).join(" ")];
}
