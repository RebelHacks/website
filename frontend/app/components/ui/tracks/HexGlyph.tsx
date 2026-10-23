import type { CSSProperties } from "react";
import styles from "./hexGlyph.module.css";

// Glyphs drawn for a honeycomb, 7 rows tall. "#" = a filled cell.
// Every second row (marked "shifted") sits half a cell to the right, so a
// straight up-and-down stroke is two cells wide on the plain rows and one
// cell wide on the shifted rows.
const GLYPHS: Record<string, string[]> = {
  "?": [
    ".###.",
    "#..#.", // shifted
    "...#.",
    "..#..", // shifted
    "..#..",
    ".....", // shifted
    "..#..",
  ],
  // symmetric shapes suit the honeycomb best, since each shifted row sits
  // exactly between the cells of the rows around it
  heart: [
    ".##.##.",
    "######.", // shifted
    ".#####.",
    ".####..", // shifted
    "..###..",
    "..##...", // shifted
    "...#...",
  ],
};

// Size of the honeycomb the glyph sits in. It's wider than any card, and
// the SVG crops to fit, so the glyph always stays centered.
const COLUMNS = 21;
const ROWS = 11;
const CELL_WIDTH = Math.sqrt(3); // pointy-top hexagon with a radius of 1
const CELL_SCALE = 0.86; // drawn a bit smaller than the grid, to leave gaps

// the six corners of a pointy-top hexagon around (cx, cy)
function hexPoints(cx: number, cy: number) {
  return [-90, -30, 30, 90, 150, 210]
    .map((degrees) => {
      const radians = (degrees * Math.PI) / 180;
      const x = cx + Math.cos(radians) * CELL_SCALE;
      const y = cy + Math.sin(radians) * CELL_SCALE;
      return `${x.toFixed(3)},${y.toFixed(3)}`;
    })
    .join(" ");
}

interface HexGlyphProps {
  glyph: string;
  // varies which cells blink and when, so cards showing the same glyph
  // don't blink in sync
  seed?: number;
}

// A dot-matrix display made of honeycomb cells, showing one glyph. Every so
// often one of its cells blinks red, like the flicker in the hero name.
export default function HexGlyph({ glyph, seed = 0 }: HexGlyphProps) {
  const bitmap = GLYPHS[glyph] ?? GLYPHS["?"];
  // start on an unshifted (even) row so the shapes above line up as drawn
  const top = Math.floor((ROWS - bitmap.length) / 4) * 2;
  const left = Math.floor((COLUMNS - bitmap[0].length) / 2);

  const cells = [];
  let filledCount = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      // odd rows shift half a cell right, like a honeycomb
      const cx =
        column * CELL_WIDTH +
        CELL_WIDTH / 2 +
        (row % 2 === 1 ? CELL_WIDTH / 2 : 0);
      const cy = row * 1.5 + 1;
      const isFilled = bitmap[row - top]?.[column - left] === "#";
      if (!isFilled) {
        cells.push(
          <polygon
            key={`${row}-${column}`}
            points={hexPoints(cx, cy)}
            className={styles.empty}
          />,
        );
        continue;
      }

      // Fixed (not random) numbers, so the server and browser match.
      // delay: a scattered order for the cells filling in on reveal
      const delay = ((column * 7 + row * 13) % 9) * 22;
      // about one filled cell in eight blinks, each on its own slow cycle
      const index = filledCount++;
      const blinks = (index * 5 + seed * 3) % 8 === 0;
      const timing: Record<string, string> = { "--delay": `${delay}ms` };
      if (blinks) {
        timing["--blink-period"] = `${19 + ((index * 7 + seed * 11) % 23)}s`;
        timing["--blink-delay"] = `${2 + ((index * 3 + seed * 5) % 13)}s`;
      }

      cells.push(
        <polygon
          key={`${row}-${column}`}
          points={hexPoints(cx, cy)}
          className={styles.filled}
          data-blink={blinks || undefined}
          style={timing as CSSProperties}
        />,
      );
    }
  }

  const width = COLUMNS * CELL_WIDTH + CELL_WIDTH / 2;
  const height = (ROWS - 1) * 1.5 + 2;
  return (
    <svg
      className={styles.glyph}
      viewBox={`0 0 ${width.toFixed(3)} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {cells}
    </svg>
  );
}
