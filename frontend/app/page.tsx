"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";

import styles from "./styles.module.css";

// import Header from "./components/ui/Header";
import FAQ from "./components/ui/faq/Faq";
import About from "./components/ui/about/About";

interface Question {
  question: string;
  answer: string;
}

const faqQuestions: Question[] = [
  {
    question: "What is a hackathon?",
    answer:
      "A hackathon is an event where individuals come together to collaborate on software or hardware projects within a set time frame.",
  },
  {
    question: "Is there a theme?",
    answer:
      "Yes, each hackathon may have a specific theme or focus area, such as healthcare, education, or sustainability.",
  },
  {
    question: "How many people can be in a group?",
    answer:
      "Group sizes can vary, but typically teams consist of 2 to 5 members.",
  },
  {
    question: "Who can join?",
    answer:
      "Any UNLV and CSN student enrolled during the spring semester can attend. All majors are welcome.",
  },
];

export default function Home() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post("/sample", {
        key: "value",
      });
      setData(response.data);
      console.log("Data: ", data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <section id="home" className={styles.heroSection}>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <div className={styles.secLogo}>
              <Image
                src="/images/sec-logo.png"
                alt="sec logo"
                width={70}
                height={70}
              ></Image>
            </div>
            <a href="#home" className={styles.navLink}>
              Home
            </a>
            <a href="#about" className={styles.navLink}>
              About
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

      <section id="about">
       <About />
      </section>

      <section id="faq">
        <FAQ questions={faqQuestions} allowMultiple={true} />
      </section>
    </main>
  );
}
