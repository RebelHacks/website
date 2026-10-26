import type { ReactNode } from "react";
import styles from "./halo.module.css";

interface HaloProps {
  children: ReactNode;
  // a wider halo, for the very large hero text
  large?: boolean;
}

/*
  Wrap text that sits on the honeycomb in <Halo> so the grid fades out behind
  the letters instead of crossing them.

  How it works: an invisible copy of the text sits right underneath it, with a
  glow (text-shadow) in the page color. The copy is pushed below everything
  else in its section (z-index: -1), so a glow can never fog the real text
  next to it. Sections are isolated stacking contexts (see .columns in
  globals.css), which keeps the copy above the honeycomb.

  Why not a CSS filter: a blur filter is recalculated every frame while the
  honeycomb animates behind it, which is very slow on weaker devices. A
  text-shadow is drawn once and reused.
*/
export default function Halo({ children, large = false }: HaloProps) {
  return (
    <span className={styles.halo}>
      {/* inert: the copy can't be focused, clicked or read out, even if it
          contains a link */}
      <span className={`${styles.copy} ${large ? styles.large : ""}`} inert>
        {children}
      </span>
      {children}
    </span>
  );
}
