"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

// Sets data-revealed the first time it scrolls into view. The CSS inside uses
// it to start entrance animations.
export default function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      // triggers 15% up from the bottom of the screen, so the animation plays
      // where it can be seen
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-revealed={revealed || undefined}>
      {children}
    </div>
  );
}
