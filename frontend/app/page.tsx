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

interface Question {
  question: string;
  answer: string;
}

const faqQuestions: Question[] = [
  {
    question: "What is a hackathon?",
    answer:
      "A hackathon is an event where teams come together to collaborate on software or hardware projects within a set time frame to be formally judged.",
  },
  {
    question: "Is there a theme?",
    answer:
      "Yes, the theme will be released on-site after the opening ceremony",
  },
  {
    question: "How many people can be in a team?",
    answer: "Teams will range from 1 - 5 people",
  },
  {
    question: "Who can join?",
    answer:
      "Any UNLV and CSN student enrolled during the spring semester can attend. All majors are welcome.",
  },
  {
    question: "Will there be food?",
    answer:
      "Yes! We will be serving breakfast, lunch, and dinner for free. We will also provide caffeinated drinks",
  },
  {
    question: "How much does it cost to join?",
    answer: "RebelHacks is 100% free to join",
  },
];

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
