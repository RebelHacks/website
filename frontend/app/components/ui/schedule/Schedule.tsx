import type { CSSProperties } from "react";
import Section from "../section/Section";
import Reveal from "../reveal/Reveal";
import Tick from "./Tick";
import styles from "./schedule.module.css";

// The weekend at a glance. exact times are in the portal
// doneAt is in Las Vegas time (-08:00 in February).
const STEPS = [
  {
    when: "Saturday Morning",
    what: "Check in at the SEB Auditorium for the opening ceremony!",
    doneAt: "2027-02-20T12:00:00-08:00",
  },
  {
    when: "Saturday Night",
    what: "Keep building through the night on the first floor of AEB.",
    doneAt: "2027-02-21T07:00:00-08:00",
    isNight: true,
  },
  {
    when: "Sunday Morning",
    what: "Projects are due! Wrap it up!",
    doneAt: "2027-02-21T12:00:00-08:00",
  },
  {
    when: "Sunday Afternoon",
    what: "Judging, then the closing ceremony and - finally - awards!",
    doneAt: "2027-02-21T18:00:00-08:00",
  },
];

export default function Schedule() {
  return (
    <Section
      id="schedule"
      title="Schedule"
      lead={
        <>
          You&apos;ll be hacking for twenty-four hours. Here are the events you
          should be looking at!
        </>
      }
    >
      <Reveal className="full">
        <ol className={styles.timeline}>
          {STEPS.map(({ when, what, doneAt, isNight }, index) => (
            <li
              key={when}
              className={styles.step}
              data-night={isNight || undefined}
              style={{ "--index": index } as CSSProperties}
            >
              <div className={styles.marker}>
                <svg
                  className={styles.hex}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.5 20.2 7.25v9.5L12 21.5 3.8 16.75v-9.5Z" />
                </svg>
                <Tick doneAt={doneAt} />
              </div>
              <div className={`card ${styles.details}`}>
                <h3 className={styles.when}>{when}</h3>
                <p className={styles.what}>{what}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
