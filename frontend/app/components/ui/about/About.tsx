import Section from "../section/Section";
import Wordmark from "../wordmark/Wordmark";
import styles from "./about.module.css";

// confirmed details only
const FACTS = [
  { label: "When", value: "Sat–Sun, Feb 20–21, 2027", isDate: true },
  { label: "Where", value: "SEB Auditorium, UNLV" },
  { label: "Overnight", value: "AEB, first floor" },
  { label: "Who", value: "University students, any major" },
  { label: "Cost", value: "Free!" },
  { label: "Teams", value: "1 to 5 people" },
  { label: "Hosted by", value: "SEC, GWC and LAVA" },
];

export default function About() {
  return (
    <Section
      id="about"
      title={
        <>
          What is <Wordmark className={styles.name} />?
        </>
      }
      lead={
        <>
          RebelHacks is UNLV&apos;s first large-scale student hackathon and
          we&apos;re still continuing - bigger and better! You&apos;ve only 24
          hours to team up for a prize, build something new, and show your
          project to the judges.
        </>
      }
    >
      <div className={`card ${styles.story}`}>
        <p>
          The theme drops at the opening ceremony. From there, you have until
          Sunday to turn the theme into something that works, building through
          the night if you want, then demo it for a panel of judges with over
          $5,000 in prizes on the line.
        </p>
        <p>
          It&apos;s free, every major is welcome, and food&apos;s going to be on
          us! First time at a hackathon? You&apos;re eligible for the Beginner
          track!
        </p>
      </div>

      <dl className={`card ${styles.facts}`}>
        {FACTS.map(({ label, value, isDate }) => (
          <div key={label} className={styles.fact}>
            <dt>{label}</dt>
            <dd className={isDate ? styles.date : undefined}>{value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
