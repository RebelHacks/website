import type { CSSProperties } from "react";
import Wordmark from "../wordmark/Wordmark";
import styles from "./hero.module.css";

const YEAR_DIGITS = ["2", "0", "2", "7"];

// The full-screen landing view: who's presenting, the name, the year spread
// to the name's width, and the dates.
export default function Hero() {
  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.center}>
        {/* the credit line and the name share a left edge, as in Lauren's design */}
        <div className={styles.titleBlock}>
          <p className={styles.presents}>SEC, GWC &amp; LAVA present</p>
          <h1 id="hero-title" className={styles.lockup}>
            <Wordmark intro ambient className={styles.name} />
            <span className={styles.year}>
              <span className="sr-only"> 2027</span>
              {YEAR_DIGITS.map((digit, index) => (
                <span
                  key={index}
                  className={styles.digit}
                  style={{ "--index": index } as CSSProperties}
                  aria-hidden="true"
                >
                  {digit}
                </span>
              ))}
            </span>
          </h1>
        </div>

        <p className={styles.date}>
          <time dateTime="2027-02-20">Feb 20</time>
          <span aria-hidden="true"> – </span>
          <span className="sr-only"> to </span>
          <time dateTime="2027-02-21">21</time>
        </p>
      </div>
    </section>
  );
}
