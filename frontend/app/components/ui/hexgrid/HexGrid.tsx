"use client";

import { useEffect, useRef } from "react";
import { startHexGrid } from "./hexGridAnimation";
import styles from "./hexgrid.module.css";

interface HexGridProps {
  // no intro animation and fainter lines, for text-heavy pages
  quiet?: boolean;
}

// Background honeycomb. The drawing code is in hexGridAnimation.ts.
export default function HexGrid({ quiet = false }: HexGridProps) {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return startHexGrid(baseRef.current!, trailRef.current!, liveRef.current!, {
      quiet,
    });
  }, [quiet]);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <canvas ref={baseRef} className={styles.canvas} />
      <canvas ref={trailRef} className={styles.canvas} />
      <canvas ref={liveRef} className={styles.canvas} />
    </div>
  );
}
