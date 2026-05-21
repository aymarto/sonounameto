import type { Metadata } from "next";
import ArtworkDetail from "@/components/ArtworkDetail";
import { pageTitle } from "@/lib/brand";

type Props = {
  params: { id: string };
};

export function generateMetadata({ params }: Props): Metadata {
  return { title: pageTitle("Œuvre") };
}

export default function OeuvrePage({ params }: Props) {
  return <ArtworkDetail id={params.id} />;
}
