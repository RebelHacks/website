import Image from "next/image";
import { sectionHref } from "../header/navLinks";
import Section from "../section/Section";
import { DONATE_URL, sponsors } from "./sponsorData";
import styles from "./sponsors.module.css";

export default function Sponsors() {
  return (
    <Section
      id="sponsors"
      title="Sponsors"
      lead={
        <>
          RebelHacks is free for every student because of the organizations that
          back it.
        </>
      }
      stickyHeading
    >
      {sponsors.length > 0 && (
        <ul className={styles.logos}>
          {sponsors.map(({ name, logo, url }) => (
            <li key={name}>
              <a
                href={url}
                className={`card ${styles.sponsor}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={logo}
                  alt={name}
                  fill
                  sizes="180px"
                  className={styles.logo}
                />
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className={`card ${styles.callout}`}>
        <h3 className={styles.calloutTitle}>Sponsor RebelHacks 2027</h3>
        <p>
          Help a weekend of university students build something new at UNLV, and
          meet them while they do. We&apos;d love to hear from you.
        </p>
        <p>
          Not a company? You can still help. Donations go through Rebel Raiser,
          UNLV&apos;s official crowdfunding site.
        </p>
        <div className={styles.calloutButtons}>
          <a
            href={sectionHref("contact")}
            className={`button ${styles.calloutButton}`}
          >
            Get in touch
          </a>
          <a
            href={DONATE_URL}
            className={`button ${styles.calloutButton}`}
            target="_blank"
            rel="noreferrer"
          >
            Donate
          </a>
        </div>
      </div>
    </Section>
  );
}
