"use client";

import { useEffect, useRef } from "react";
import { startHexGrid } from "./hexGridAnimation";
import styles from "./hexgrid.module.css";

interface HexGridProps {
  // no opening burst, and lines stay faint: for text-heavy pages
  quiet?: boolean;
}

// The animated honeycomb behind the whole page. All the drawing lives in
// hexGridAnimation.ts; this component just gives it its three canvases.
export default function HexGrid({ quiet = false }: HexGridProps) {
  const baseRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!baseRef.current || !trailRef.current || !liveRef.current) return;
    return startHexGrid(baseRef.current, trailRef.current, liveRef.current, {
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
