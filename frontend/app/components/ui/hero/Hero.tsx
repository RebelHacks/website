import type { CSSProperties } from "react";
import Halo from "../halo/Halo";
import Wordmark from "../wordmark/Wordmark";
import styles from "./hero.module.css";

const YEAR = "2027";

export default function Hero() {
  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.center}>
        {/* credit line left-aligned with the name, per Lauren's design */}
        <div className={styles.titleBlock}>
          <p className={styles.presents}>
            <Halo large>SEC, GWC &amp; LAVA present</Halo>
          </p>
          <h1 id="hero-title" className={styles.lockup}>
            <Halo large>
              <Wordmark intro flickers className={styles.name} />
            </Halo>
            <Halo large>
              <span className={styles.year}>
                <span className="sr-only"> {YEAR}</span>
                {[...YEAR].map((digit, index) => (
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
