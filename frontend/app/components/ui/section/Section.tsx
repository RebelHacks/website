import type { ReactNode } from "react";
import Halo from "../halo/Halo";
import styles from "./section.module.css";

interface SectionProps {
  // the anchor the nav links to, like "about" for /#about
  id: string;
  title: ReactNode;
  // paragraph under the title
  lead?: ReactNode;
  // heading in the left column with position: sticky (wide screens only)
  stickyHeading?: boolean;
  children: ReactNode;
}

// A home page section. The layout is in section.module.css.
export default function Section({
  id,
  title,
  lead,
  stickyHeading = false,
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      className={`${styles.section} ${stickyHeading ? styles.stickyHeading : ""}`}
      aria-labelledby={headingId}
    >
      <header className={styles.heading}>
        <h2 id={headingId} className={styles.title}>
          <Halo>{title}</Halo>
        </h2>
        {lead && (
          <p className={styles.lead}>
            <Halo>{lead}</Halo>
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
