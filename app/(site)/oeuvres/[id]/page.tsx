import type { Metadata } from "next";
import ArtworkDetail from "@/components/ArtworkDetail";
import { pageTitle } from "@/lib/brand";
import { getStaticArtwork } from "@/lib/data";

type Props = {
  params: { id: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const art = getStaticArtwork(params.id);
  if (!art) {
    return { title: pageTitle("Œuvre") };
  }
  return {
    title: pageTitle(art.title),
    description: art.shortDescription || art.description,
  };
}

export default function OeuvrePage({ params }: Props) {
  const initialArtwork = getStaticArtwork(params.id) ?? null;
  return <ArtworkDetail id={params.id} initialArtwork={initialArtwork} />;
}
