import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src="/images/portrait_3_1.jpeg"
            alt="Portrait de l'artiste SONOUNAMETO"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover grayscale"
            priority={false}
          />
        </div>
        <div>
          <p className="eyebrow">À propos</p>
          <h2 className="section-title mt-3">
            L&apos;art comme un regard tendu vers l&apos;autre.
          </h2>
          <div className="mt-6 space-y-4 text-neutral-700 leading-relaxed">
            <p>
              SONOUNAMETO est un artiste peintre dont le travail s&apos;articule
              autour du portrait, de la mémoire et de la lumière. Chaque toile
              cherche à saisir un instant suspendu, un regard, une présence.
            </p>
            <p>
              Mêlant huile, acrylique et fusain, l&apos;artiste construit une
              série continue de visages où le silence devient matière.
            </p>
          </div>
          <Link href="/a-propos" className="btn-line mt-8">
            En savoir plus
          </Link>
        </div>
      </div>
    </section>
  );
}
