import type { ReactNode } from "react";
import Halo from "../halo/Halo";
import styles from "./section.module.css";

interface SectionHeadingProps {
  // id for the <h2>, so the section can point to it with aria-labelledby
  id: string;
  // usually plain text, but can hold elements (like the animated name)
  title: ReactNode;
  // optional short paragraph under the title
  children?: ReactNode;
}

// The title + intro line at the top of each page section.
export default function SectionHeading({
  id,
  title,
  children,
}: SectionHeadingProps) {
  return (
    <header className={styles.heading}>
      <h2 id={id} className={styles.title}>
        <Halo>{title}</Halo>
      </h2>
      {children && (
        <p className={styles.lead}>
          <Halo>{children}</Halo>
        </p>
      )}
    </header>
  );
}
