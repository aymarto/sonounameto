import Image from "next/image";
import type { ReferenceItem } from "@/lib/site-content";

type Props = {
  items: ReferenceItem[];
};

export default function ReferencesGrid({ items }: Props) {
  return (
    <div className="container-page grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((ref) => (
        <article key={ref.id} className="flex flex-col">
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
            <Image
              src={ref.imageUrl}
              alt={ref.title}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <h2 className="mt-4 font-display text-xl leading-tight">{ref.title}</h2>
          {ref.description && (
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {ref.description}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
