import Image from "next/image";
import Link from "next/link";
import { artworks } from "@/lib/data";
import ArtworkCardMeta from "@/components/ArtworkCardMeta";
import { hasMultipleImages } from "@/lib/artworks";
import type { Artwork } from "@/lib/types";

type Props = {
  items?: Artwork[];
  basePath?: string;
};

export default function OeuvresGrid({
  items = artworks,
  basePath = "/oeuvres",
}: Props) {
  return (
    <div className="container-page grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-10">
      {items.map((art, index) => (
        <Link
          key={art.id}
          href={`${basePath}/${art.id}`}
          className="group flex min-w-0 flex-col"
        >
          <article className="flex min-w-0 flex-col">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
              <Image
                src={art.imageUrl}
                alt={art.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                quality={70}
                priority={index < 4}
                loading={index < 4 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {hasMultipleImages(art) && (
                <span className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-wide-xl text-white">
                  + photos
                </span>
              )}
            </div>
            <ArtworkCardMeta
              title={art.title}
              date={art.date}
              description={art.shortDescription}
            />
          </article>
        </Link>
      ))}
    </div>
  );
}
