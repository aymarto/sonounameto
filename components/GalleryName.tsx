import { GALLERY_NAME } from "@/lib/brand";

type Props = {
  as?: "p" | "span" | "h1";
  /** hero | preloader | nav | inline */
  variant?: "hero" | "preloader" | "nav" | "inline";
  className?: string;
  suppressHydrationWarning?: boolean;
};

const variantClass: Record<NonNullable<Props["variant"]>, string> = {
  hero:
    "font-display uppercase leading-[1.05] tracking-normal text-[clamp(1.35rem,6.5vw,3.75rem)] md:tracking-wide-xl",
  preloader:
    "max-w-[min(100%,18rem)] text-center font-display text-xl uppercase leading-tight tracking-normal md:max-w-none md:text-3xl md:tracking-wide-xl",
  nav: "font-display text-[0.7rem] uppercase leading-tight tracking-normal whitespace-nowrap sm:text-sm md:text-2xl md:tracking-wide-xl",
  inline: "font-display uppercase tracking-normal md:tracking-wide-xl",
};

/** Affichage « Galerie NOUNAMETO » — une ligne dans le header ; empilé sur mobile ailleurs (hero, preloader). */
export default function GalleryName({
  as: Tag = "span",
  variant = "inline",
  className = "",
  suppressHydrationWarning,
}: Props) {
  if (variant === "nav") {
    return (
      <Tag
        className={`${variantClass.nav} ${className}`.trim()}
        suppressHydrationWarning={suppressHydrationWarning}
      >
        {GALLERY_NAME}
      </Tag>
    );
  }

  return (
    <Tag
      className={`${variantClass[variant]} ${className}`.trim()}
      suppressHydrationWarning={suppressHydrationWarning}
    >
      <span className="block sm:inline">Galerie </span>
      <span className="block sm:inline">NOUNAMETO</span>
    </Tag>
  );
}
