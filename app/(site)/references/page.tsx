import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ReferencesGrid from "@/components/ReferencesGrid";
import { ARTIST_NAME, pageTitle } from "@/lib/brand";
import { references } from "@/lib/site-content";

export const metadata: Metadata = {
  title: pageTitle("Références"),
  description: `Références et parcours de ${ARTIST_NAME}.`,
};

export default function ReferencesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Références"
        title="Références"
        description="Expositions, résidences et collaborations — images accompagnées d'un titre et d'une courte description."
      />
      <section className="page-content">
        <ReferencesGrid items={references} />
      </section>
    </>
  );
}
