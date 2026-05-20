import { formatDate } from "@/lib/format";

type Props = {
  title: string;
  date: string;
  description?: string;
  /** Taille du titre — grille œuvres vs aperçu accueil */
  size?: "md" | "lg";
};

export default function ArtworkCardMeta({
  title,
  date,
  description,
  size = "lg",
}: Props) {
  const titleClass =
    size === "lg"
      ? "font-display text-base leading-snug group-hover:opacity-70 sm:text-lg md:text-2xl"
      : "font-display text-base leading-tight sm:text-lg";

  const TitleTag = size === "lg" ? "h2" : "h3";

  return (
    <div className={`min-w-0 ${size === "lg" ? "mt-3" : "mt-4"}`}>
      <TitleTag className={titleClass}>{title}</TitleTag>
      <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-500 sm:text-xs">
        {formatDate(date)}
      </p>
      {description ? (
        <p className="mt-2 line-clamp-2 text-sm leading-snug text-neutral-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}
