import type { CSSProperties } from "react";
import styles from "./wordmark.module.css";

const LETTERS = "REBELHACKS".split("");

// Per-letter timings for the "*" -> letter flips. They're fixed lists instead
// of Math.random() so the server and the browser render the same HTML.
// intro (ms): when each letter first appears on page load
const INTRO_DELAYS = [970, 500, 1680, 660, 2000, 1320, 820, 1840, 1130, 1530];
// ambient: each letter briefly flickers back to "*" once per period (in
// seconds), starting at its own offset (in ms) so flickers stay scattered
// instead of landing all at once
const AMBIENT_PERIODS = [21, 31, 42, 52, 21, 42, 31, 52, 42, 31];
const AMBIENT_OFFSETS = [
  0, 2300, 4100, 1200, 5600, 3400, 6200, 800, 4900, 2700,
];

interface WordmarkProps {
  // play the letter-by-letter reveal when the page loads
  intro?: boolean;
  // let letters flicker every so often while the page sits open
  ambient?: boolean;
  className?: string;
}

// The RebelHacks name, set in the mono font with REBEL in red. Letters flip
// to asterisks as the cursor passes over them. The animation is plain CSS
// (see wordmark.module.css); this component only sets the timings.
export default function Wordmark({
  intro = false,
  ambient = false,
  className = "",
}: WordmarkProps) {
  let rootClassName = styles.wordmark;
  if (intro) rootClassName += ` ${styles.intro}`;
  if (ambient) rootClassName += ` ${styles.ambient}`;
  if (className) rootClassName += ` ${className}`;

  return (
    <span className={rootClassName}>
      <span className="sr-only">RebelHacks</span>
      <span className={styles.letters} aria-hidden="true">
        {LETTERS.map((letter, index) => {
          const timings = {
            "--intro-delay": `${INTRO_DELAYS[index]}ms`,
            "--ambient-period": `${AMBIENT_PERIODS[index]}s`,
            // ambient flickers start after the intro has finished
            "--ambient-delay": `${3500 + AMBIENT_OFFSETS[index]}ms`,
          } as CSSProperties;

          return (
            <span
              key={index}
              className={`${styles.cell} ${index < 5 ? styles.rebel : styles.hacks}`}
              style={timings}
            >
              <span className={styles.letter}>{letter}</span>
              <span className={styles.mask}>*</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
