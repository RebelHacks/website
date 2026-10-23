"use client";

import type { CSSProperties, MouseEvent } from "react";
import { NAV_LINKS, sectionHref } from "../header/navLinks";
import { useActiveSection } from "../header/useActiveSection";
import styles from "./hamburger.module.css";

// Phone menu. It uses the browser's built-in popover: the button opens and
// closes it, and Esc or a tap outside closes it, with no React state needed.
export default function Hamburger() {
  const activeSection = useActiveSection();

  // jumping to a section doesn't close a popover by itself, so close it here
  const closeMenu = (event: MouseEvent<HTMLAnchorElement>) => {
    const menu = event.currentTarget.closest<HTMLElement>("[popover]");
    menu?.hidePopover();
  };

  return (
    <>
      <button
        type="button"
        className={styles.menuButton}
        popoverTarget="site-menu"
        aria-label="Menu"
      >
        <span className={styles.bars} aria-hidden="true" />
      </button>

      <nav
        id="site-menu"
        popover="auto"
        className={styles.menu}
        aria-label="Main"
      >
        <ul className={styles.list}>
          {NAV_LINKS.map(({ label, section }, index) => (
            <li key={section} style={{ "--index": index } as CSSProperties}>
              <a
                href={sectionHref(section)}
                className={styles.link}
                aria-current={
                  section === activeSection ? "location" : undefined
                }
                onClick={closeMenu}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
