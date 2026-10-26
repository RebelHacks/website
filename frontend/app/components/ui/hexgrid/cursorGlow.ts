import {
  COLUMN_STEP,
  ROW_STEP,
  hexCenter,
  traceHex,
  type Point,
} from "./honeycomb";

// Highlights the hexagons near the mouse cursor.

const RADIUS = 150; // css px
const STRENGTH = 0.45; // max opacity of a lit cell, 0..1
const LEVELS = 8; // brightness steps, each drawn as one path

interface LitCell {
  center: Point;
  heat: number; // current brightness, 0..1
  target: number; // brightness it's easing toward
}

export class CursorGlow {
  private pointer: Point | null = null;
  private cells = new Map<string, LitCell>();

  setPointer(pointer: Point | null) {
    this.pointer = pointer;
  }

  clear() {
    this.cells.clear();
  }

  update(elapsed: number) {
    for (const cell of this.cells.values()) cell.target = 0;
    if (this.pointer) this.lightCellsNear(this.pointer);

    // fast fade in, slow fade out. Rates are per 60fps frame.
    const frames = elapsed / (1000 / 60);
    for (const [key, cell] of this.cells) {
      const rate = cell.target > cell.heat ? 0.3 : 0.05;
      cell.heat += (cell.target - cell.heat) * Math.min(1, rate * frames);
      if (cell.target === 0 && cell.heat < 0.01) this.cells.delete(key);
    }
  }

  draw(
    context: CanvasRenderingContext2D,
    fillColor: string,
    lineColor: string,
  ) {
    const shades = Array.from({ length: LEVELS + 1 }, () => new Path2D());
    for (const cell of this.cells.values()) {
      const level = Math.round(cell.heat * LEVELS);
      if (level > 0) traceHex(shades[level], cell.center);
    }

    context.lineWidth = 1;
    context.fillStyle = fillColor;
    context.strokeStyle = lineColor;
    for (let level = 1; level <= LEVELS; level++) {
      const glow = (level / LEVELS) * STRENGTH;
      context.globalAlpha = glow * 0.75;
      context.fill(shades[level]);
      context.globalAlpha = glow;
      context.stroke(shades[level]);
    }
  }

  private lightCellsNear(pointer: Point) {
    const firstColumn = Math.floor((pointer.x - RADIUS) / COLUMN_STEP);
    const lastColumn = Math.ceil((pointer.x + RADIUS) / COLUMN_STEP);
    // extra row because odd columns are offset by half a row
    const firstRow = Math.floor((pointer.y - RADIUS) / ROW_STEP) - 1;
    const lastRow = Math.ceil((pointer.y + RADIUS) / ROW_STEP);

    for (let column = firstColumn; column <= lastColumn; column++) {
      for (let row = firstRow; row <= lastRow; row++) {
        const center = hexCenter(column, row);
        const distance = Math.hypot(center.x - pointer.x, center.y - pointer.y);
        if (distance >= RADIUS) continue;

        const key = `${column},${row}`;
        const cell = this.cells.get(key) ?? { center, heat: 0, target: 0 };
        cell.target = (1 - distance / RADIUS) ** 1.5;
        this.cells.set(key, cell);
      }
    }
  }
}
