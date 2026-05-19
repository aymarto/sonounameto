import Image from "next/image";
import Link from "next/link";
import { artworks } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default function WorksPreview() {
  const preview = artworks.slice(0, 4);

  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="container-page">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Quelques œuvres</p>
            <h2 className="section-title mt-3">Sélection récente</h2>
          </div>
          <Link href="/galerie" className="btn-line hidden md:inline-flex">
            Voir tout
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((art) => (
            <Link
              key={art.id}
              href={`/galerie#${art.id}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
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

        <div className="mt-12 md:hidden">
          <Link href="/galerie" className="btn-line">
            Voir tout
          </Link>
        </div>
      </div>
    </section>
  );
}
