"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "./navLinks";

// "home" is the hero, which has no nav link of its own
const SECTION_IDS = ["home", ...NAV_LINKS.map((link) => link.section)];

// Id of the section at 45% of the way down the screen.
// Past the last section (the footer), the last one stays active.
export function useActiveSection() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );

    for (const id of SECTION_IDS) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}
