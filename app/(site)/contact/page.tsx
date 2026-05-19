import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — SONOUNAMETO",
  description: "Contactez l'artiste SONOUNAMETO.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Prenons contact"
        description="Pour une acquisition, une collaboration, une exposition ou simplement échanger autour du travail."
      />

      <section className="bg-white py-16 md:py-24">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div className="space-y-8">
            <div>
              <p className="eyebrow">Email</p>
              <a
                href="mailto:contact@sonounameto.art"
                className="mt-2 block text-lg hover:opacity-70"
              >
                contact@sonounameto.art
              </a>
            </div>
            <div>
              <p className="eyebrow">Réseaux</p>
              <ul className="mt-2 space-y-1 text-lg">
                <li>
                  <a href="#" className="hover:opacity-70">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:opacity-70">
                    Facebook
                  </a>
                </li>
              </ul>
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
