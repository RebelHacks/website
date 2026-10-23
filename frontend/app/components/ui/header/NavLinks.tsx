"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, sectionHref } from "./navLinks";
import { useActiveSection } from "./useActiveSection";
import styles from "./header.module.css";

// Desktop nav. One red underline slides between the links: it sits under
// the section you've scrolled to, and previews whichever link you hover.
export default function NavLinks() {
  const navRef = useRef<HTMLElement>(null);
  const activeSection = useActiveSection();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const underlined = hoveredSection ?? activeSection;

  // Move the underline by writing its position into CSS variables; the CSS
  // animates the change. It's placed again whenever the nav changes size
  // (for example once the font loads and the links get wider).
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const placeUnderline = () => {
      const link = nav.querySelector<HTMLAnchorElement>(
        `a[href="${sectionHref(underlined)}"]`,
      );
      if (!link) {
        delete nav.dataset.underline;
        return;
      }
      nav.style.setProperty("--underline-x", `${link.offsetLeft}px`);
      nav.style.setProperty("--underline-width", `${link.offsetWidth}px`);
      nav.dataset.underline = "on";
    };

    const observer = new ResizeObserver(placeUnderline);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [underlined]);

  return (
    <nav
      ref={navRef}
      className={styles.nav}
      aria-label="Main"
      onMouseLeave={() => setHoveredSection(null)}
    >
      {NAV_LINKS.map(({ label, section }) => {
        return (
          <a
            key={section}
            href={sectionHref(section)}
            className={styles.navLink}
            aria-current={section === activeSection ? "location" : undefined}
            onMouseEnter={() => setHoveredSection(section)}
          >
            {label}
          </a>
        );
      })}
      <span className={styles.underline} aria-hidden="true" />
    </nav>
  );
}
