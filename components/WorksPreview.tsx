import Link from "next/link";
import ContentUnavailable from "@/components/ContentUnavailable";

export default function WorksPreview() {
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

        <ContentUnavailable className="py-12" />

        <div className="mt-8 md:hidden">
          <Link href="/oeuvres" className="btn-line">
            Voir tout
          </Link>
        </div>
      </div>
    </section>
  );
}
