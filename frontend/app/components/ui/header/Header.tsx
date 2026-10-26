"use client";

import Wordmark from "../wordmark/Wordmark";
import Hamburger from "../hamburger/Hamburger";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import { REGISTER_URL, sectionHref } from "./navLinks";
import { useActiveSection } from "./useActiveSection";
import styles from "./header.module.css";

export default function Header() {
  // shared by NavLinks and Hamburger so the observer only runs once
  const activeSection = useActiveSection();

  return (
    <header className={styles.header}>
      <a href="#main" className={styles.skipLink}>
        Skip to content
      </a>
      <div className={styles.inner}>
        <a
          href={sectionHref("home")}
          className={styles.brand}
          aria-label="RebelHacks home"
        >
          <Wordmark />
        </a>

        <NavLinks activeSection={activeSection} />

        <div className={styles.actions}>
          <ThemeToggle />
          <a
            className={`button ${styles.register}`}
            href={REGISTER_URL}
            target="_blank"
            rel="noreferrer"
          >
            Register
            <svg
              className={styles.newTabIcon}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M5 11 11 5M6 5h5v5" />
            </svg>
          </a>
          <Hamburger activeSection={activeSection} />
        </div>
      </div>
    </header>
  );
}
