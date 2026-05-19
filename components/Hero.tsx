import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-hero-fixed text-white">
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="container-page relative z-10 pb-16 md:pb-24">
        <p className="eyebrow text-white/80">Galerie de l&apos;artiste</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
          SONOUNAMETO
          <span className="block text-white/80">Portraits & expositions</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
          Une exploration des visages, du silence et de la lumière. Découvrez
          les œuvres et les évènements à venir.
        </p>
        <div className="mt-10 flex flex-wrap gap-6">
          <Link
            href="/galerie"
            className="inline-flex items-center gap-2 border-b border-white pb-1 text-sm uppercase tracking-wide-xl text-white transition-opacity hover:opacity-70"
          >
            Voir la galerie
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm uppercase tracking-wide-xl text-white/80 transition-opacity hover:opacity-70"
          >
            Me contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
