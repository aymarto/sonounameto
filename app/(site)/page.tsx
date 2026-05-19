import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import WorksPreview from "@/components/WorksPreview";
import EventsPreview from "@/components/EventsPreview";
import ContactForm from "@/components/ContactForm";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <WorksPreview />
      <EventsPreview />

      <section className="bg-paper py-20 md:py-28">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="section-title mt-3">
              Une question, un projet, une exposition ?
            </h2>
            <p className="mt-6 max-w-md text-neutral-600">
              Envoyez-moi un message, je vous réponds dans les plus brefs
              délais.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <Newsletter />
    </>
  );
}
