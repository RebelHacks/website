import type { Metadata } from "next";
import Link from "next/link";
import HexGrid from "../components/ui/hexgrid/HexGrid";
import Header from "../components/ui/header/Header";
import Footer from "../components/ui/footer/Footer";
import styles from "./code-of-conduct.module.css";

export const metadata: Metadata = {
  title: "Code of Conduct · RebelHacks 2027",
  description:
    "The rules everyone at RebelHacks agrees to: be respectful, no harassment, build fairly, and how to report a problem.",
};

// First draft, written for the organizers to review before launch.
export default function CodeOfConductPage() {
  return (
    <>
      <HexGrid quiet />
      <Header alwaysShowBrand />
      <main id="main" className={styles.page}>
        <article className={`card ${styles.document}`}>
          <header className={styles.intro}>
            <h1 className={styles.title}>Code of Conduct</h1>
            <p className={styles.lead}>
              RebelHacks is for everyone. We want every hacker, mentor, judge,
              sponsor and volunteer to have a welcoming, harassment-free
              weekend, whatever their background or experience. By taking part,
              you agree to follow this code at the event and in any RebelHacks
              online spaces.
            </p>
          </header>

          <section className={styles.rule}>
            <h2>Be kind and respectful</h2>
            <p>
              Treat everyone with respect. Welcome beginners, share what you
              know, and keep feedback constructive. Disagreements happen; work
              through them politely.
            </p>
          </section>

          <section className={styles.rule}>
            <h2>Harassment isn&apos;t tolerated</h2>
            <p>Harassment includes, but isn&apos;t limited to:</p>
            <ul>
              <li>
                Offensive comments about gender, gender identity or expression,
                sexual orientation, disability, appearance, body size, race,
                ethnicity, religion or nationality
              </li>
              <li>Deliberate intimidation, stalking or following</li>
              <li>
                Photographing or recording someone who has asked you not to
              </li>
              <li>
                Sustained disruption of talks, presentations or other teams
              </li>
              <li>Unwelcome physical contact or sexual attention</li>
            </ul>
            <p>
              Sexual language and imagery aren&apos;t appropriate anywhere at
              RebelHacks, including in projects, presentations and team names.
            </p>
          </section>

          <section className={styles.rule}>
            <h2>Build fairly</h2>
            <p>
              Projects must be built during the event. The theme is revealed at
              the opening ceremony, so no one starts early. Submit work your
              team created at RebelHacks, and give credit for anything you
              didn&apos;t make yourselves.
            </p>
          </section>

          <section className={styles.rule}>
            <h2>Respect the space</h2>
            <p>
              Look after the SEB Auditorium, AEB and everything in them. Follow
              UNLV&apos;s campus policies and the directions of organizers and
              venue staff, including overnight.
            </p>
          </section>

          <section className={styles.rule}>
            <h2>Reporting a problem</h2>
            <p>
              If you experience or witness behavior that breaks this code, or
              anything else makes you feel unsafe, tell any organizer right
              away. You can also reach us through the{" "}
              <Link href="/#contact">contact form</Link>. We&apos;ll handle
              every report discreetly.
            </p>
            <p>In an emergency, call 911.</p>
          </section>

          <section className={styles.rule}>
            <h2>What happens next</h2>
            <p>
              Organizers may take any action they think is appropriate,
              including a warning, disqualification from prizes, or removal from
              the event. Where needed, we may involve UNLV staff or campus
              police.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
