import type { CSSProperties } from "react";
import styles from "./hexGlyph.module.css";

export type GlyphName = "?" | "heart";

// track thumbnail hexgrid, 7 rows tall, where "#" = a filled cell
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
};

// Bigger than any card. The SVG crops it (slice), keeping the glyph centered.
const COLUMNS = 21;
const ROWS = 11;
// pointy-top hexagons with a radius of 1
const CELL_WIDTH = Math.sqrt(3);
const ROW_HEIGHT = 1.5;
const CELL_SCALE = 0.86; // below 1 leaves gaps between cells

interface HexGlyphProps {
  glyph: GlyphName;
  // so cards with the same glyph don't blink in sync
  seed?: number;
}

// Card art: a glyph drawn in hexagon cells. A few cells blink red now and then.
export default function HexGlyph({ glyph, seed = 0 }: HexGlyphProps) {
  const bitmap = GLYPHS[glyph];
  // start on an even row so the shifted rows match GLYPHS
  const top = Math.floor((ROWS - bitmap.length) / 4) * 2;
  const left = Math.floor((COLUMNS - bitmap[0].length) / 2);

  const cells = [];
  let filledCount = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const key = `${row}-${column}`;
      const points = hexPoints(row, column);
      const isFilled = bitmap[row - top]?.[column - left] === "#";
      if (!isFilled) {
        cells.push(
          <polygon key={key} points={points} className={styles.empty} />,
        );
        continue;
      }

      const { blinks, style } = cellAnimation(row, column, filledCount, seed);
      filledCount++;
      cells.push(
        <polygon
          key={key}
          points={points}
          className={styles.filled}
          data-blink={blinks || undefined}
          style={style}
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

// Animation timing for a filled cell. Not Math.random(), so the server and
// browser render the same thing. The multipliers just scatter the values.
function cellAnimation(
  row: number,
  column: number,
  filledIndex: number,
  seed: number,
) {
  const style: Record<string, string> = {
    // fill-in order when the card appears
    "--fill-delay": `${((column * 7 + row * 13) % 9) * 22}ms`,
  };
  // about 1 in 8 filled cells blinks
  const blinks = (filledIndex * 5 + seed * 3) % 8 === 0;
  if (blinks) {
    style["--blink-period"] = `${19 + ((filledIndex * 7 + seed * 11) % 23)}s`;
    style["--blink-delay"] = `${2 + ((filledIndex * 3 + seed * 5) % 13)}s`;
  }
  return { blinks, style: style as CSSProperties };
}
