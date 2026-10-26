"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_LINKS, sectionHref } from "./navLinks";
import styles from "./header.module.css";

interface NavLinksProps {
  activeSection: string;
}

// desktop nav and the active tab underlines
export default function NavLinks({ activeSection }: NavLinksProps) {
  const navRef = useRef<HTMLElement>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const underlined = hoveredSection ?? activeSection;

  useEffect(() => {
    const nav = navRef.current!;
    const place = () => placeUnderline(nav, underlined);
    place();
    // re-measure when the web font loads and the links change width
    const observer = new ResizeObserver(place);
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
      {NAV_LINKS.map(({ label, section }) => (
        <a
          key={section}
          href={sectionHref(section)}
          className={styles.navLink}
          aria-current={section === activeSection ? "location" : undefined}
          onMouseEnter={() => setHoveredSection(section)}
        >
          {label}
        </a>
      ))}
      <span className={styles.underline} aria-hidden="true" />
    </nav>
  );
}

// Moves the underline to the link for `section` by setting CSS variables.
function placeUnderline(nav: HTMLElement, section: string) {
  const link = nav.querySelector<HTMLAnchorElement>(
    `a[href="${sectionHref(section)}"]`,
  );
  if (!link) {
    delete nav.dataset.underline;
    return;
  }
  nav.style.setProperty("--underline-x", `${link.offsetLeft}px`);
  nav.style.setProperty("--underline-width", `${link.offsetWidth}px`);
  nav.dataset.underline = "on";
}
