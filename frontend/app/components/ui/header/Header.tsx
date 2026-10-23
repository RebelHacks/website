import Wordmark from "../wordmark/Wordmark";
import Hamburger from "../hamburger/Hamburger";
import NavLinks from "./NavLinks";
import { REGISTER_URL, sectionHref } from "./navLinks";
import styles from "./header.module.css";

interface HeaderProps {
  // On the homepage the small name fades in once the big hero name has
  // scrolled away. Other pages have no hero, so they show it right away.
  alwaysShowBrand?: boolean;
}

export default function Header({ alwaysShowBrand = false }: HeaderProps) {
  let headerClassName = styles.header;
  if (alwaysShowBrand) headerClassName += ` ${styles.plain}`;

  return (
    <header className={headerClassName}>
      {/* first thing a keyboard user reaches; hidden until focused */}
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

        <NavLinks />

        <div className={styles.actions}>
          <a
            className={`button ${styles.register}`}
            href={REGISTER_URL}
            target="_blank"
            rel="noreferrer"
          >
            Register
            {/* arrow = opens in a new tab */}
            <svg
              className={styles.registerArrow}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M5 11 11 5M6 5h5v5" />
            </svg>
          </a>
          <Hamburger />
        </div>
      </div>
    </header>
  );
}
