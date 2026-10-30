import type { ReactNode } from "react";
import styles from "./halo.module.css";

interface HaloProps {
  children: ReactNode;
  // for the big hero text
  large?: boolean;
}

/*
  Fades the honeycomb out behind text that sits on it, so grid lines never
  cross the letters.

  The glow's actually a copy of the text so that we may change the radius of the shadow. 
  Search engines still see it, but who cares?
*/
export default function Halo({ children, large = false }: HaloProps) {
  return (
    <span className={styles.halo}>
      <span className={`${styles.glow} ${large ? styles.large : ""}`} inert>
        {children}
      </span>
      {children}
    </span>
  );
}
