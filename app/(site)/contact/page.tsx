import type { Metadata } from "next";
import ContactPageContent from "@/components/ContactPageContent";
import { ARTIST_NAME, pageTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: pageTitle("Contact"),
  description: `Contactez ${ARTIST_NAME}.`,
};

export default function ContactPage() {
  return <ContactPageContent />;
}
