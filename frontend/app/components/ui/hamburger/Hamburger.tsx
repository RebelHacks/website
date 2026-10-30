"use client";

import type { CSSProperties, MouseEvent } from "react";
import { NAV_LINKS, sectionHref } from "../header/navLinks";
import styles from "./hamburger.module.css";

interface HamburgerProps {
  activeSection: string;
}

// Phone menu. Uses the popover attribute, so the browser handles opening,
// closing, Esc and outside taps.
export default function Hamburger({ activeSection }: HamburgerProps) {
  // popovers don't close on in-page navigation
  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const menu = event.currentTarget.closest<HTMLElement>("[popover]")!;
    menu.hidePopover();
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
                onClick={handleLinkClick}
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
