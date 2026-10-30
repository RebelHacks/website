import { NAV_LINKS, sectionHref } from "../header/navLinks";
import Logo from "../logo/Logo";
import MotionToggle from "./MotionToggle";
import styles from "./footer.module.css";

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
            <Logo className={styles.logo} />
          </a>

          <nav className={styles.links} aria-label="Footer">
            {NAV_LINKS.map(({ label, section }) => (
              <a key={section} href={sectionHref(section)}>
                {label}
              </a>
            ))}
            <a href="/code-of-conduct">Code of Conduct</a>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p>© 2027 RebelHacks. Presented by SEC, GWC &amp; LAVA at UNLV.</p>
          <div className={styles.bottomLinks}>
            <MotionToggle />
            {/* "#" goes to the top of the current page */}
            <a href="#" className={styles.backToTop}>
              Back to top
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
