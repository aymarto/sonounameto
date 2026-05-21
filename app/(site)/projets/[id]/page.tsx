import type { Metadata } from "next";
import ProjetDetailContent from "@/components/ProjetDetailContent";
import { pageTitle } from "@/lib/brand";

type Props = {
  params: { id: string };
};

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: pageTitle("Projet"),
    description: `Œuvres du projet.`,
  };
}

export default function ProjetDetailPage({ params }: Props) {
  return <ProjetDetailContent id={params.id} />;
}
