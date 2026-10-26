"use client";

import { useSyncExternalStore } from "react";
import {
  isMotionPaused,
  setMotionPaused,
  subscribeToMotion,
} from "@/lib/motion";
import styles from "./footer.module.css";

export default function MotionToggle() {
  // false on the server, which can't see localStorage
  const isPaused = useSyncExternalStore(
    subscribeToMotion,
    isMotionPaused,
    () => false,
  );

  const handleToggle = () => setMotionPaused(!isPaused);

  return (
    <button
      type="button"
      className={styles.motionToggle}
      onClick={handleToggle}
    >
      {isPaused ? "Play animations" : "Pause animations"}
    </button>
  );
}
