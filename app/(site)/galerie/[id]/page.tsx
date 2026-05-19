import type { Metadata } from "next";
import ArtworkDetail from "@/components/ArtworkDetail";
import { getStaticArtwork } from "@/lib/data";

type Props = {
  params: { id: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const art = getStaticArtwork(params.id);
  if (!art) {
    return { title: "Œuvre — SONOUNAMETO" };
  }
  return {
    title: `${art.title} — SONOUNAMETO`,
    description: art.shortDescription || art.description,
  };
}

export default function ArtworkPage({ params }: Props) {
  return <ArtworkDetail id={params.id} />;
}
