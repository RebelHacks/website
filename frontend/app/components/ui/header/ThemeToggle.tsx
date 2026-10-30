"use client";

import { useSyncExternalStore } from "react";
import { isDarkTheme, subscribeToTheme, toggleTheme } from "@/lib/theme";
import styles from "./header.module.css";

export default function ThemeToggle() {
  // false on the server, which can't know the theme
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    isDarkTheme,
    () => false,
  );

  return (
    <button
      type="button"
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label="Dark theme"
      aria-pressed={isDark}
    >
      {/* half-filled circle, rotated 180° in the dark theme */}
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="7.25" />
        <path d="M10 2.75a7.25 7.25 0 0 1 0 14.5z" />
      </svg>
    </button>
  );
}
