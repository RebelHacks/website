"use client";

import { useEffect, useState } from "react";
import styles from "./FlashMessage.module.css";

interface FlashMessageProps {
  message: string;
  type: "success" | "error";
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

// line icons (24x24): a tick for success, an X for errors and the close button
const TICK = "M5 13l4 4L19 7";
const CROSS = "M6 18L18 6M6 6l12 12";

function Icon({ path, className }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

// A dismissible message. The parent gives each new message a fresh `key`, so
// every message mounts on its own and plays the entrance animation.
export default function FlashMessage({
  message,
  type,
  onClose,
  autoClose = true,
  duration = 5000,
}: FlashMessageProps) {
  // true once it's been dismissed; it plays the exit animation, and when that
  // ends it asks the parent to remove it
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
