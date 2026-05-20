import Image from "next/image";
import Link from "next/link";
import { artworks } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default function WorksPreview() {
  const preview = artworks.slice(0, 4);

  return (
    <section className="section-pad bg-paper">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Quelques œuvres</p>
            <h2 className="section-title mt-2">Sélection récente</h2>
          </div>
          <Link href="/oeuvres" className="btn-line hidden md:inline-flex">
            Voir tout
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {preview.map((art, index) => (
            <Link
              key={art.id}
              href={`/oeuvres/${art.id}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={art.imageUrl}
                  alt={art.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                  quality={70}
                  priority={index < 4}
                  loading={index < 4 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-display text-xl leading-tight">
                  {art.title}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wide-xl text-neutral-500">
                  {formatDate(art.date)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link href="/oeuvres" className="btn-line">
            Voir tout
          </Link>
        </div>
      </div>
    </section>
  );
}
