/*
  The background honeycomb's geometry: flat-topped hexagons with sides of
  SIDE css pixels, in columns. Odd columns sit half a row lower, so the
  hexagons.
*/

export const SIDE = 28;
export const ROW_STEP = Math.sqrt(3) * SIDE; // between centers in a column
export const COLUMN_STEP = 1.5 * SIDE; // between columns

export interface Point {
  x: number;
  y: number;
}

// The six directions an edge can point,
export const DIRECTIONS: Point[] = [0, 60, 120, 180, 240, 300].map(
  (degrees) => {
    const radians = (degrees * Math.PI) / 180;
    return { x: Math.cos(radians) * SIDE, y: Math.sin(radians) * SIDE };
  },
);

// Every corner has 3 edges. Kind 0 corners have edges at 0°/120°/240°, kind 1
// at 60°/180°/300°. Following an edge always goes to the other kind.
export type CornerKind = 0 | 1;
export const CORNER_DIRECTIONS = [
  [0, 2, 4],
  [1, 3, 5],
];

export interface Corner extends Point {
  kind: CornerKind;
}

export function hexCenter(column: number, row: number): Point {
  const isOddColumn = Math.abs(column % 2) === 1;
  return {
    x: column * COLUMN_STEP,
    y: row * ROW_STEP + (isOddColumn ? ROW_STEP / 2 : 0),
  };
}

export function traceHex(path: CanvasPath, center: Point) {
  const [first, ...rest] = DIRECTIONS;
  path.moveTo(center.x + first.x, center.y + first.y);
  for (const corner of rest) {
    path.lineTo(center.x + corner.x, center.y + corner.y);
  }
  path.closePath();
}

// Random left or right corner of the hexagon nearest (x, y).
export function cornerNear(x: number, y: number): Corner {
  const center = hexCenter(
    Math.round(x / COLUMN_STEP),
    Math.round(y / ROW_STEP),
  );
  // right corner is kind 0, left corner is kind 1
  const kind: CornerKind = Math.random() < 0.5 ? 0 : 1;
  const offset = kind === 0 ? DIRECTIONS[0] : DIRECTIONS[3];
  return { x: center.x + offset.x, y: center.y + offset.y, kind };
}
