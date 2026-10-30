import type { CSSProperties } from "react";
import styles from "./hexGlyph.module.css";

export type GlyphName = "?" | "heart" | "1";

// track thumbnail hexgrid, where "#" = a filled cell. Most glyphs are 7 rows tall.
// Rows marked "shifted" are offset half a cell to the right. A vertical
// stroke is two cells wide on plain rows and one cell on shifted rows.
const GLYPHS: Record<GlyphName, string[]> = {
  "?": [
    ".###.",
    "#..#.", // shifted
    "...#.",
    "..#..", // shifted
    "..#..",
    ".....", // shifted
    "..#..",
  ],
  // symmetric shapes look best, since shifted rows sit between cells
  heart: [
    ".##.##.",
    "######.", // shifted
    ".#####.",
    ".####..", // shifted
    "..###..",
    "..##...", // shifted
    "...#...",
  ],
  // the grand prize: a solid block, full height, with the 1 cut out of it.
  // The first column is the half cells along the card's left edge.
  "1": [
    "#########",
    "###..####", // shifted
    "###..####",
    "##...####", // shifted
    "####.####",
    "###..####", // shifted
    "####.####",
    "###..####", // shifted
    "##.....##",
    "#########", // shifted
    "#########",
  ],
};

// Glyphs that keep moving after they fill in. The rest stay still.
// - emit: sits at the left edge and sends solid lines out to the right
type Motion = "emit";
const MOTIONS: Partial<Record<GlyphName, Motion>> = {
  "1": "emit",
};

// how long an emitted line takes to move one column. The line keyframes in
// hexGlyph.module.css are timed for this.
const LINE_STEP_MS = 110;

// Bigger than any card. The SVG crops it (slice), keeping the glyph centered.
const COLUMNS = 21;
const ROWS = 11;
// pointy-top hexagons with a radius of 1
const CELL_WIDTH = Math.sqrt(3);
const ROW_HEIGHT = 1.5;
const CELL_SCALE = 0.86; // below 1 leaves gaps between cells

// Card art: a glyph drawn in hexagon cells.
export default function HexGlyph({ glyph }: { glyph: GlyphName }) {
  const bitmap = GLYPHS[glyph];
  const motion = MOTIONS[glyph];
  // start on an even row so the shifted rows match GLYPHS
  const top = Math.floor((ROWS - bitmap.length) / 4) * 2;
  // emitting glyphs sit at the left edge, so their lines have room to travel
  const left =
    motion === "emit" ? -1 : Math.floor((COLUMNS - bitmap[0].length) / 2);
  const lastColumn = left + bitmap[0].length - 1;

  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    // one extra column on each side, so the edges show half cells instead of gaps
    for (let column = -1; column <= COLUMNS; column++) {
      const isFilled = bitmap[row - top]?.[column - left] === "#";
      const style: Record<string, string> = {};
      if (isFilled) style["--fill-delay"] = fillDelay(row, column);
      // emitted lines copy the block's right edge, one column further out each step
      const lineStep = motion === "emit" ? column - lastColumn : 0;
      if (lineStep > 0) style["--wave"] = `${lineStep * LINE_STEP_MS}ms`;

      cells.push(
        <polygon
          key={`${row}-${column}`}
          points={hexPoints(row, column)}
          className={isFilled ? styles.filled : styles.empty}
          style={style as CSSProperties}
          data-line={lineStep > 0 || undefined}
        />,
      );
    }
  }

  const width = COLUMNS * CELL_WIDTH + CELL_WIDTH / 2;
  const height = (ROWS - 1) * ROW_HEIGHT + 2;
  return (
    <svg
      className={styles.glyph}
      viewBox={`0 0 ${width.toFixed(3)} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      data-motion={motion}
    >
      {cells}
    </svg>
  );
}

// SVG polygon points for one cell. Odd rows are offset half a cell.
function hexPoints(row: number, column: number) {
  const shift = row % 2 === 1 ? CELL_WIDTH / 2 : 0;
  const cx = column * CELL_WIDTH + CELL_WIDTH / 2 + shift;
  const cy = row * ROW_HEIGHT + 1;

  return [-90, -30, 30, 90, 150, 210]
    .map((degrees) => {
      const radians = (degrees * Math.PI) / 180;
      const x = cx + Math.cos(radians) * CELL_SCALE;
      const y = cy + Math.sin(radians) * CELL_SCALE;
      return `${x.toFixed(3)},${y.toFixed(3)}`;
    })
    .join(" ");
}

// Fill-in order when the card appears. Not Math.random(), so the server and
// browser render the same thing. The multipliers just scatter the values.
function fillDelay(row: number, column: number) {
  const scatter = (((column * 7 + row * 13) % 9) + 9) % 9; // stays 0-8 for column -1
  return `${scatter * 22}ms`;
}
