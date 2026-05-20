import { redirect } from "next/navigation";

type Props = {
  params: { id: string };
};

export default function GalerieIdRedirectPage({ params }: Props) {
  redirect(`/oeuvres/${params.id}`);
}
