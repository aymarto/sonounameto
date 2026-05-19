import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import WorksPreview from "@/components/WorksPreview";
import EventsPreview from "@/components/EventsPreview";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  return (
    <div className="relative isolate">
      <Hero />
      <div className="relative z-10">
        <AboutSection />
        <WorksPreview />
        <EventsPreview />
        <Newsletter />
      </div>
    </div>
  );
}
