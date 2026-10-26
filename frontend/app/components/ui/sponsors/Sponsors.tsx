import Image from "next/image";
import SectionHeading from "../section/SectionHeading";
import { sponsors } from "./sponsorData";
import styles from "./sponsors.module.css";

// A grid of sponsor logos. Logos sit in grayscale and come into color on hover.
export default function Sponsors() {
  return (
    <div className="columns">
      <SectionHeading id="sponsors-heading" title="Sponsors">
        RebelHacks is made possible by these organizations.
      </SectionHeading>

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
    </div>
  );
}
