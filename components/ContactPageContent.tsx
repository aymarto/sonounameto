"use client";

import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import SocialLinks from "@/components/SocialLinks";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

export default function ContactPageContent() {
  const { settings, loading, loaded } = useSiteSettings();

  if (loading || !loaded) {
    return (
      <div className="container-page animate-pulse py-8 text-sm text-neutral-500">
        Chargement…
      </div>
    );
  }

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
              <SocialLinks
                variant="page"
                className="mt-4"
                email={settings.contactEmail}
                instagram={settings.contactInstagram}
                facebook={settings.contactFacebook}
                portfolio={settings.portfolioUrl}
              />
            </div>
            <div>
              <p className="eyebrow">Email</p>
              {settings.contactEmail ? (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="mt-2 block text-lg hover:opacity-70"
                >
                  {settings.contactEmail}
                </a>
              ) : (
                <p className="mt-2 text-sm text-neutral-500">—</p>
              )}
            </div>
            <div>
              <p className="eyebrow">Atelier</p>
              <p className="mt-2 text-neutral-600">
                {settings.contactLocation || "—"}
              </p>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
