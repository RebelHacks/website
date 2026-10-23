"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

// Marks its wrapper with data-revealed the first time it scrolls into view.
// The animation itself lives in the CSS of whatever is inside; this only
// says "now". After that it stops watching.
export default function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      // fire once the top edge is 15% of the way up the screen, so tall
      // blocks on phones don't sit empty while you scroll into them
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-revealed={revealed || undefined}>
      {children}
    </div>
  );
}
