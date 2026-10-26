"use client";

import { useEffect, useState } from "react";
import styles from "./FlashMessage.module.css";

interface FlashMessageProps {
  message: string;
  type: "success" | "error";
  onClose?: () => void;
  // on by default for success only, so errors aren't missed
  autoClose?: boolean;
  duration?: number;
}

const TICK = "M5 13l4 4L19 7";
const CROSS = "M6 18L18 6M6 6l12 12";

// Give each new message a new `key` so the entrance animation replays.
export default function FlashMessage({
  message,
  type,
  onClose,
  autoClose = type === "success",
  duration = 5000,
}: FlashMessageProps) {
  // set on dismiss. onClose runs after the exit animation.
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!autoClose) return;
    const timer = setTimeout(() => setIsLeaving(true), duration);
    return () => clearTimeout(timer);
  }, [autoClose, duration]);

  return (
    <div
      className={`${styles.flashMessage} ${styles[type]} ${isLeaving ? styles.animateOut : styles.animateIn}`}
      role={type === "success" ? "status" : "alert"}
      onAnimationEnd={() => {
        if (isLeaving) onClose?.();
      }}
    >
      <div className={styles.iconWrapper}>
        <Icon
          path={type === "success" ? TICK : CROSS}
          className={styles.icon}
        />
      </div>

      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>

      <button
        type="button"
        className={styles.closeButton}
        onClick={() => setIsLeaving(true)}
        aria-label="Close notification"
      >
        <Icon path={CROSS} />
      </button>
    </div>
  );
}

interface IconProps {
  // SVG path in a 24x24 viewBox
  path: string;
  className?: string;
}

function Icon({ path, className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}
