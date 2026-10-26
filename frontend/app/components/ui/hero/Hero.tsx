import type { CSSProperties } from "react";
import Halo from "../halo/Halo";
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
          <p className={styles.presents}>
            <Halo large>SEC, GWC &amp; LAVA present</Halo>
          </p>
          <h1 id="hero-title" className={styles.lockup}>
            <Halo large>
              <Wordmark intro ambient className={styles.name} />
            </Halo>
            <Halo large>
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
            </Halo>
          </h1>
        </div>

        <p className={styles.date}>
          <Halo large>
            <time dateTime="2027-02-20">Feb 20</time>
            <span aria-hidden="true"> – </span>
            <span className="sr-only"> to </span>
            <time dateTime="2027-02-21">21</time>
          </Halo>
        </p>
      </div>
    </section>
  );
}
