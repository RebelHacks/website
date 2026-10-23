"use client";

import { useEffect, useState } from "react";

// Ids of the page sections the nav tracks, top to bottom.
// "home" is the hero, which has no nav link of its own.
const SECTION_IDS = [
  "home",
  "about",
  "schedule",
  "tracks",
  "photos",
  "faq",
  "contact",
];

// Returns the id of the section currently in the middle of the screen.
// It watches a thin strip 45% of the way down the viewport; whichever
// section crosses that strip becomes active. Past the last section (the
// footer), the last one stays active.
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
