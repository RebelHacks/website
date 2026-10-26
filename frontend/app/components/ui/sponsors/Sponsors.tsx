import Image from "next/image";
import { sectionHref } from "../header/navLinks";
import Section from "../section/Section";
import { sponsors } from "./sponsorData";
import styles from "./sponsors.module.css";

export default function Sponsors() {
  if (sponsors.length === 0) {
    return (
      <Section
        id="sponsors"
        title="Sponsors"
        lead={
          <>
            RebelHacks is free for every student because of the organizations
            that back it.
          </>
        }
        stickyHeading
      >
        <div className={`card ${styles.invite}`}>
          <h3 className={styles.inviteTitle}>Sponsor RebelHacks 2027</h3>
          <p>
            Help a weekend of university students build something new at UNLV,
            and meet them while they do. We&apos;d love to hear from you.
          </p>
          <a
            href={sectionHref("contact")}
            className={`button ${styles.inviteButton}`}
          >
            Get in touch
          </a>
        </div>
      </Section>
    );
  }

  return (
    <Section
      id="sponsors"
      title="Sponsors"
      lead="RebelHacks is made possible by these organizations."
    >
      <ul className={`full ${styles.grid}`}>
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
                sizes="240px"
                className={styles.logo}
              />
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
