"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import styles from "./styles.module.css";
import FAQ from "./components/ui/faq/Faq";
import Contact from "./components/ui/contact/page";
import Hamburger from "./components/ui/hamburger/Hamburger";
import Tracks from "./components/ui/tracks/Tracks";
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
    answer:
      "Teams will range from 1 - 5 people",
  },
  {
    question: "Who can join?",
    answer:
      "Any UNLV and CSN student enrolled during the spring semester can attend. All majors are welcome.",
  },
  {
    question: "Will there be food?",
    answer: "Yes! We will be serving breakfast, lunch, and dinner for free. We will also provide caffeinated drinks"
  },
  {
    question: "How much does it cost to join?",
    answer: "RebelHacks is 100% free to join"
  }
];

export default function Home() {
  return (
    <main>
      <section id="home" className={styles.heroSection}>
        <header className={styles.header}>
          <Hamburger />

          <nav className={styles.nav}>
            <a href="#home" className={styles.navLink}>
              Home
            </a>
            <a href="#tracks" className={styles.navLink}>
              Tracks
            </a>
            <a href="#faq" className={styles.navLink}>
              FAQ
            </a>
          </nav>
          <div className={styles.buttonWrapper}>
            <button className={styles.loginBtn}>
              <Link href="#">Login</Link>
            </button>

            <button className={styles.registerBtn}>
              <Link href="#">Register</Link>
            </button>
          </div>
        </header>

        <div className={styles.heroTitle}>
          <div className={styles.titleOrgWrapper}>
            <h1 className={styles.titleOrg}>REBEL HACKS</h1>
            <Image
              src="/images/org-heart.svg"
              alt="orange heart"
              width={120}
              height={40}
              className={styles.orangeHeart}
            />
          </div>

          <div className={styles.titleSchoolLogoWrapper}>
            <h1 className={styles.titleSchoolText}>UNLV 2026</h1>

            <Image
              src="/images/red-diamond.svg"
              alt="red diamond"
              width={120}
              height={40}
              className={styles.redDiamond}
            />

            <Image
              src="/images/vegas-sign.png"
              alt="Las Vegas Neon Sign"
              width={400}
              height={100}
              className={styles.vegasSign}
            />
          </div>

          <div className={styles.descriptionDateWrapper}>
            <Image
              src="/images/org-diamond.svg"
              alt="orange diamond"
              width={100}
              height={40}
              className={styles.orangeDiamond}
            />

            <p className={styles.heroDescription}>
              Come together to design, develop, and present projects that tackle
              real-world problems!
            </p>
            {/* make this a countdown */}
            <p className={styles.heroDate}>FRI & SAT February 20–21, 2026</p>

            <Image
              src="/images/blue-ace.svg"
              alt="blue ace"
              width={120}
              height={40}
              className={styles.blueAce}
            />
          </div>
        </div>

        <div className={styles.heroImageWrapper}>
          <Image
            src="/images/hero-image.svg"
            alt="Las Vegas neon sign"
            width={600}
            height={100}
            className={styles.heroImage}
          />
        </div>
      </section>
      {/* <section id="about">
        <About />
      </section> */}
      <section id="tracks">
        <Tracks />
      </section>
      <section id="faq">
        <FAQ questions={faqQuestions} allowMultiple={true} />
      </section>
      <section id="contact">
      <Contact />
      </section>  

      <Footer />
    </main>
  );
}
