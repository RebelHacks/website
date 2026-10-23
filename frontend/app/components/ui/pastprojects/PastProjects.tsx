import styles from "./pastprojects.module.css";

interface PastProject {
  project: string;
  winners: string[];
  award: string;
  devpostUrl: string; // leave "" until the link is added; the link is hidden
  year: number;
}

// To add new winners, add objects to this array (newest first).
const pastProjects: PastProject[] = [
  {
    project: "Hotel Guard",
    winners: [
      "Ruben Fernandez",
      "Daniel Valdecantos",
      "Issa Alkhoury",
      "Randy Pahang",
      "Robert Porchas",
    ],
    award: "Grand Prize: $1,500",
    devpostUrl: "https://devpost.com/software/hotel-guard",
    year: 2026,
  },
  {
    project: "Bad Decisions Inc.",
    winners: ["Nefeli Georgilas", "T Nguyen"],
    award: "Software Advanced: $500",
    devpostUrl: "https://devpost.com/software/bad-decisions-inc",
    year: 2026,
  },
  {
    project: "Bags",
    winners: ["Roy Margallo", "Cris Rosales"],
    award: "Hardware: $250",
    devpostUrl: "",
    year: 2026,
  },
  {
    project: "SOBR",
    winners: ["Marc Hosana", "Aymen Awol"],
    award: "Software Beginner: $250",
    devpostUrl: "https://devpost.com/software/sobr-hc4ve2",
    year: 2026,
  },
];

export default function PastProjects() {
  return (
    <div className={styles.pastContainer}>
      <header className={styles.pastHeader}>
        <h1 className={styles.pastTitle}>Past Projects</h1>
        <p className={styles.pastSubtitle}>
          Check out what previous RebelHacks winners built!
        </p>
      </header>

      <div className={styles.grid}>
        {pastProjects.map((entry) => (
          <article
            key={`${entry.year}-${entry.project}`}
            className={styles.card}>
            <p className={styles.award}>{entry.award}</p>
            <h2 className={styles.projectName}>{entry.project}</h2>
            <hr className={styles.lineBreak} />
            <p className={styles.winners}>{entry.winners.join(", ")}</p>
            {entry.devpostUrl && (
              <a
                href={entry.devpostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                View on Devpost →
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}