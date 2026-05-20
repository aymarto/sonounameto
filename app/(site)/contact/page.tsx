import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import SocialLinks from "@/components/SocialLinks";
import { ARTIST_NAME, pageTitle } from "@/lib/brand";
import { SOCIAL_LINKS } from "@/lib/social";

export const metadata: Metadata = {
  title: pageTitle("Contact"),
  description: `Contactez ${ARTIST_NAME}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Prenons contact"
        description="Pour une acquisition, une collaboration, une exposition ou simplement échanger autour du travail."
      />

      <section className="page-content">
        <div className="container-page grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-12">
          <div className="space-y-6">
            <div>
              <p className="eyebrow">Réseaux & email</p>
              <SocialLinks variant="page" className="mt-4" />
            </div>
            <div>
              <p className="eyebrow">Email</p>
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="mt-2 block text-lg hover:opacity-70"
              >
                {SOCIAL_LINKS.email}
              </a>
            </div>
            <div>
              <p className="eyebrow">Atelier</p>
              <p className="mt-2 text-neutral-600">Lomé — sur rendez-vous</p>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
