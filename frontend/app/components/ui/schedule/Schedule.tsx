import type { CSSProperties } from "react";
import SectionHeading from "../section/SectionHeading";
import Reveal from "../reveal/Reveal";
import styles from "./schedule.module.css";

// The weekend at a glance. Exact times live in the portal, so keep this to
// the big moments.
const STEPS = [
  {
    when: "Saturday Morning",
    what: "Check in at the SEB Auditorium for the opening ceremony!",
  },
  {
    when: "Saturday Night",
    what: "Keep building through the night on the first floor of AEB.",
    isNight: true,
  },
  {
    when: "Sunday Morning",
    what: "Projects are due! Wrap it up!",
  },
  {
    when: "Sunday Afternoon",
    what: "Judging, then the closing ceremony and - finally - awards!",
  },
];

export default function Schedule() {
  return (
    <div className="columns">
      <SectionHeading id="schedule-heading" title="Schedule">
        TODO
      </SectionHeading>

      <Reveal className="full">
        <ol className={styles.timeline}>
          {STEPS.map(({ when, what, isNight }, index) => (
            <li
              key={when}
              className={styles.step}
              data-night={isNight || undefined}
              style={{ "--i": index } as CSSProperties}
            >
              {/* a hexagon on the line; the overnight one is filled in */}
              <svg
                className={styles.marker}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2.5 20.2 7.25v9.5L12 21.5 3.8 16.75v-9.5Z" />
              </svg>
              <div className={`card ${styles.details}`}>
                <h3 className={styles.when}>{when}</h3>
                <p className={styles.what}>{what}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}
