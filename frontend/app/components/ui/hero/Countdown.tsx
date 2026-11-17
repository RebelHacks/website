"use client";

import { useSyncExternalStore } from "react";
import Halo from "../halo/Halo";
import { milestones } from "./countdownData";
import styles from "./hero.module.css";

function subscribeToClock(onChange: () => void) {
  const timer = setInterval(onChange, 1000);
  return () => clearInterval(timer);
}

// in whole seconds, so it only changes once per tick
function getNow() {
  return Math.floor(Date.now() / 1000);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

// Counts down to the next milestone in countdownData.ts.
export default function Countdown() {
  const now = useSyncExternalStore<number | null>(
    subscribeToClock,
    getNow,
    // unknown on the server, since the page is built ahead of time
    () => null,
  );

  // an empty line until the browser knows the time, so the hero doesn't jump
  if (now === null) return <p className={styles.countdown} />;

  const next = milestones.find(({ at }) => Date.parse(at) / 1000 > now);
  if (!next) return null;

  const secondsLeft = Date.parse(next.at) / 1000 - now;
  const days = Math.floor(secondsLeft / 86_400);
  const hours = Math.floor((secondsLeft % 86_400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <p className={styles.countdown}>
      <Halo large>
        {next.label}{" "}
        <span className={styles.timeLeft} role="timer">
          {days}d {pad(hours)}h {pad(minutes)}m
          <span className={styles.seconds}> {pad(seconds)}s</span>
        </span>
      </Halo>
    </p>
  );
}
