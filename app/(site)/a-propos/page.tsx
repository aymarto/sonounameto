import Image from "next/image";
import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "À propos — SONOUNAMETO",
  description: "Biographie et démarche artistique de SONOUNAMETO.",
};

export default function AProposPage() {
  return (
    <>
      <PageHeader
        eyebrow="À propos"
        title="À propos de moi"
        description="Quelques mots sur mon parcours, ma démarche et les thèmes qui traversent mon travail."
      />

      <section className="bg-white py-16 md:py-24">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/images/portrait_3.jpeg"
              alt="Portrait de SONOUNAMETO"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover grayscale"
            />
          </div>

          <div className="space-y-6 text-neutral-700 leading-relaxed">
            <p>
              Je suis SONOUNAMETO, artiste peintre. Mon travail s&apos;articule
              autour du portrait, du regard et de la mémoire. Chaque toile
              cherche à saisir un instant suspendu — un visage, un silence, une
              respiration.
            </p>
            <p>
              Travaillant principalement à l&apos;huile, j&apos;intègre parfois
              l&apos;acrylique et le fusain pour construire des séries continues
              de visages. La lumière y joue un rôle central : elle révèle, elle
              cache, elle suggère.
            </p>
            <p>
              Mon parcours s&apos;est construit entre l&apos;Afrique de
              l&apos;Ouest et l&apos;Europe. Cette double appartenance nourrit
              les figures que je peins, à mi-chemin entre intimité et symbole.
            </p>

            <div className="grid grid-cols-2 gap-6 border-t border-black/10 pt-8">
              <div>
                <p className="eyebrow">Médiums</p>
                <p className="mt-2 text-sm">Huile, acrylique, fusain</p>
              </div>
              <div>
                <p className="eyebrow">Basé à</p>
                <p className="mt-2 text-sm">Lomé / Paris</p>
              </div>
              <div>
                <p className="eyebrow">Expositions</p>
                <p className="mt-2 text-sm">Lomé, Cotonou, Paris</p>
              </div>
              <div>
                <p className="eyebrow">Représentation</p>
                <p className="mt-2 text-sm">Indépendant</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
