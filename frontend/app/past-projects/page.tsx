import Link from "next/link";
import styles from "../styles.module.css";
import Hamburger from "../components/ui/hamburger/Hamburger";
import PastProjects from "../components/ui/pastprojects/PastProjects";
import Footer from "../components/ui/footer/Footer";

export const metadata = {
  title: "Past Projects",
};

export default function PastProjectsPage() {
  return (
    <main>
      <header className={styles.header}>
        <Hamburger />
        <nav className={styles.nav}>
          {/* "/#..." links go back to the home page, then scroll to the section */}
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/#tracks" className={styles.navLink}>
            Tracks
          </Link>
          <Link href="/#photos" className={styles.navLink}>
            Photos
          </Link>
          <Link href="/#faq" className={styles.navLink}>
            FAQ
          </Link>
          <Link href="/#contact" className={styles.navLink}>
            Contact
          </Link>
          <Link href="/past-projects" className={styles.navLink}>
            Past Projects
          </Link>
        </nav>
        <div className={styles.buttonWrapper}>
          <a
            className={styles.registerBtn}
            target="_blank"
            rel="noreferrer"
            href="https://docs.google.com/forms/d/e/1FAIpQLScotK89gO_uAouUM7qMJhMtDo7vux1IHj0iIVFiT0UT3AwMBQ/viewform?usp=header"
          >
            Register
          </a>
        </div>
      </header>

      <PastProjects />

      <section>
        <Footer />
      </section>
    </main>
  );
}