import type { ReactNode } from "react";
import styles from "./styles.module.css";
import HexGrid from "./components/ui/hexgrid/HexGrid";
import Header from "./components/ui/header/Header";
import Hero from "./components/ui/hero/Hero";
import About from "./components/ui/about/About";
import Schedule from "./components/ui/schedule/Schedule";
import Tracks from "./components/ui/tracks/Tracks";
import Photos from "./components/ui/photos/Photos";
import Sponsors from "./components/ui/sponsors/Sponsors";
import { sponsors } from "./components/ui/sponsors/sponsorData";
import FAQ from "./components/ui/faq/Faq";
import Contact from "./components/ui/contact/page";
import Footer from "./components/ui/footer/Footer";
import { faqQuestions } from "./components/ui/faq/faqData";

// A page section. Each one's heading has the id "<section id>-heading".
function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className={styles.section}
      aria-labelledby={`${id}-heading`}
    >
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HexGrid />
      <Header />
      <main id="main">
        <Hero />
        <Section id="about">
          <About />
        </Section>
        <Section id="schedule">
          <Schedule />
        </Section>
        <Section id="tracks">
          <Tracks />
        </Section>
        <Section id="photos">
          <Photos />
        </Section>
        {/* hidden until sponsors are added to sponsorData.ts */}
        {sponsors.length > 0 && (
          <Section id="sponsors">
            <Sponsors />
          </Section>
        )}
        <Section id="faq">
          <FAQ questions={faqQuestions} allowMultiple={true} />
        </Section>
        <Section id="contact">
          <Contact />
        </Section>
      </main>
      <Footer />
    </>
  );
}
