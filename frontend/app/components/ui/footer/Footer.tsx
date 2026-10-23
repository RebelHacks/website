import Wordmark from "../wordmark/Wordmark";
import { NAV_LINKS, sectionHref } from "../header/navLinks";
import styles from "./footer.module.css";

// TODO: placeholders until the team confirms the real accounts
const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "Discord", href: "#" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <a
            href={sectionHref("home")}
            className={styles.brand}
            aria-label="RebelHacks home"
          >
            <Wordmark />
          </a>

          <div className={styles.linkGroups}>
            <nav className={styles.links} aria-label="Footer">
              {NAV_LINKS.map(({ label, section }) => (
                <a key={section} href={sectionHref(section)}>
                  {label}
                </a>
              ))}
              <a href="/code-of-conduct">Code of Conduct</a>
            </nav>

            <ul className={styles.links} aria-label="Social media">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2027 RebelHacks. Presented by SEC, GWC &amp; LAVA at UNLV.</p>
          {/* "#" scrolls to the top of whichever page you're on */}
          <a href="#" className={styles.backToTop}>
            Back to top
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
