"use client";

import { useSyncExternalStore } from "react";
import styles from "./schedule.module.css";

function subscribeToClock(onChange: () => void) {
  const timer = setInterval(onChange, 60_000);
  return () => clearInterval(timer);
}

interface TickProps {
  // when the step is over, like "2027-02-20T12:00:00-08:00"
  doneAt: string;
}

// Shows a tick once `doneAt` has passed. Checked once a minute.
export default function Tick({ doneAt }: TickProps) {
  const isDone = useSyncExternalStore(
    subscribeToClock,
    () => Date.now() >= Date.parse(doneAt),
    // always false on the server, since the page is built ahead of time
    () => false,
  );

  if (!isDone) return null;
  return (
    <svg className={styles.tick} viewBox="0 0 24 24" role="img">
      <title>Done</title>
      <path d="M4 12.5 9.5 18 22 3" pathLength={1} />
    </svg>
  );
}
