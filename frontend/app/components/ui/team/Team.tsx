import Halo from "../halo/Halo";
import Section from "../section/Section";
import TeamCard, { type TeamMember } from "./TeamCard";
import styles from "./team.module.css";

// Temporary sample members let us test full and incomplete rows before
// members, photos, and LinkedIn URLs are available.
const members: TeamMember[] = [
  {
    name: "Sample Programmer One",
    group: "programmer",
    role: "Programmer",
    contributions: "Placeholder contributions for layout testing.",
  },
  {
    name: "Sample Programmer Two",
    group: "programmer",
    role: "Programmer",
    contributions: "Placeholder contributions for layout testing.",
  },
  {
    name: "Sample Programmer Three",
    group: "programmer",
    role: "Programmer",
    contributions:
      "A longer placeholder contribution to check that cards remain the same height when content wraps.",
  },
  {
    name: "Sample Programmer Four",
    group: "programmer",
    role: "Programmer",
    contributions: "Placeholder contributions for layout testing.",
  },
  {
    name: "Sample Organizer One",
    group: "organizer",
    role: "Organizer",
    contributions: "Placeholder contributions for layout testing.",
  },
  {
    name: "Sample Organizer Two",
    group: "organizer",
    role: "Organizer",
    contributions: "Placeholder contributions for layout testing.",
  },
];

// Shared markup keeps both groups consistent as the roster changes.
const groups = [
  { group: "organizer", title: "Organizers" },
  { group: "programmer", title: "Programmers" },
] as const;

export default function Team() {
  return (
    <Section id="team" title="Meet the Team">
      {groups.map(({ group, title }) => (
        <section
          key={group}
          className={`full ${styles.group}`}
          aria-labelledby={`team-${group}-heading`}
        >
          <h3
            id={`team-${group}-heading`}
            className={styles.groupTitle}
          >
            <Halo>{title}</Halo>
          </h3>

          <div className={styles.grid}>
            {members
              .filter((member) => member.group === group)
              .map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
          </div>
        </section>
      ))}
    </Section>
  );
}