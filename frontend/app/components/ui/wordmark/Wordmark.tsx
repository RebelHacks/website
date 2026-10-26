import type { CSSProperties } from "react";
import styles from "./wordmark.module.css";

const REBEL = "REBEL";
const LETTERS = [...`${REBEL}HACKS`];

// fixed lists, not Math.random(), so the server and browser HTML match
// when each letter appears on load
const INTRO_DELAYS_MS = [
  970, 500, 1680, 660, 2000, 1320, 820, 1840, 1130, 1530,
];
// each letter shows "*" briefly once per period. The offsets keep them from
// lining up.
const FLICKER_PERIODS_S = [21, 31, 42, 52, 21, 42, 31, 52, 42, 31];
const FLICKER_OFFSETS_MS = [
  0, 2300, 4100, 1200, 5600, 3400, 6200, 800, 4900, 2700,
];
// after the intro is done
const FLICKERS_START_MS = 3500;

interface WordmarkProps {
  // letters appear one by one on page load
  intro?: boolean;
  // letters briefly show "*" now and then while the page is open
  flickers?: boolean;
  className?: string;
}

// The RebelHacks name. The animation is in wordmark.module.css. This only
// sets each letter's timings.
export default function Wordmark({
  intro = false,
  flickers = false,
  className = "",
}: WordmarkProps) {
  let rootClassName = styles.wordmark;
  if (intro) rootClassName += ` ${styles.intro}`;
  if (flickers) rootClassName += ` ${styles.flickers}`;
  if (className) rootClassName += ` ${className}`;

  return (
    <span className={rootClassName}>
      <span className="sr-only">RebelHacks</span>
      <span className={styles.letters} aria-hidden="true">
        {LETTERS.map((letter, index) => {
          const word = index < REBEL.length ? styles.rebel : styles.hacks;
          const timings = {
            "--intro-delay": `${INTRO_DELAYS_MS[index]}ms`,
            "--flicker-period": `${FLICKER_PERIODS_S[index]}s`,
            "--flicker-delay": `${FLICKERS_START_MS + FLICKER_OFFSETS_MS[index]}ms`,
          } as CSSProperties;

          return (
            <span
              key={index}
              className={`${styles.cell} ${word}`}
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
