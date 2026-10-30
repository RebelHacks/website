import {
  CORNER_DIRECTIONS,
  DIRECTIONS,
  SIDE,
  cornerNear,
  type Corner,
  type Point,
} from "./honeycomb";

/*
  Lines that grow along the honeycomb edges.

  Finished edges go on the trail canvas, which is only redrawn about once a
  second to fade them. Only the red tips are redrawn every frame, so lots of
  lines stay cheap.
*/

const TRAIL_HOLD_MS = 40_000; // fully visible for this long
const TRAIL_FADE_MS = 20_000; // then fade out over this long
const TRAIL_REDRAW_MS = 1000;
const FADE_LEVELS = 8; // opacity steps, each drawn with one stroke call
const MAX_EDGES = 10_000; // safety cap on stored edges
const TIP_MS = 350; // finished edges stay red this long

// [min, max] ranges. Each line gets a random value in each range.
interface SpeedRange {
  edgeMs: [number, number]; // time to draw one edge
  edges: [number, number]; // line length, in edges
}

// fast is for the intro animation, slow for everything after
export type Speed = "fast" | "slow";
const SPEEDS: Record<Speed, SpeedRange> = {
  fast: { edgeMs: [70, 110], edges: [8, 18] },
  slow: { edgeMs: [150, 230], edges: [14, 36] },
};

interface Grower {
  corner: Corner; // where the current edge starts
  direction: number; // index into DIRECTIONS
  progress: number; // 0..1 along the current edge
  edgeMs: number; // time to draw one edge
  edgesLeft: number;
}

interface Edge {
  from: Point;
  to: Point;
  finishedAt: number;
}

export class GrowingLines {
  private growers: Grower[] = [];
  private edges: Edge[] = []; // finished ones, oldest first
  private trail: CanvasRenderingContext2D;
  private trailColor: string;
  private width = 0;
  private height = 0;
  private lastTrailRedraw = 0;

  constructor(trail: CanvasRenderingContext2D, trailColor: string) {
    this.trail = trail;
    this.trailColor = trailColor;
  }

  get count() {
    return this.growers.length;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.redrawTrail(performance.now());
  }

  setColor(trailColor: string) {
    this.trailColor = trailColor;
    this.redrawTrail(performance.now());
  }

  startAnywhere(speed: Speed) {
    const x = randomBetween(0, this.width);
    const y = randomBetween(0, this.height);
    this.start(cornerNear(x, y), speed);
  }

  startNear(point: Point, radius: number, speed: Speed) {
    const x = point.x + randomBetween(-radius, radius);
    const y = point.y + randomBetween(-radius, radius);
    this.start(cornerNear(x, y), speed);
  }

  update(now: number, elapsed: number) {
    this.growers = this.growers.filter((grower) => {
      grower.progress += elapsed / grower.edgeMs;
      while (grower.progress >= 1) {
        if (!this.finishEdge(grower, now)) return false;
      }
      return true;
    });

    if (now - this.lastTrailRedraw >= TRAIL_REDRAW_MS) this.redrawTrail(now);
  }

  // red tips: edges in progress, plus edges finished in the last TIP_MS
  drawTips(
    live: CanvasRenderingContext2D,
    now: number,
    color: string,
    opacity: number,
  ) {
    const path = new Path2D();
    // newest are last, so loop backwards and stop at the first old one
    for (let i = this.edges.length - 1; i >= 0; i--) {
      const edge = this.edges[i];
      if (now - edge.finishedAt >= TIP_MS) break;
      path.moveTo(edge.from.x, edge.from.y);
      path.lineTo(edge.to.x, edge.to.y);
    }
    for (const grower of this.growers) {
      const step = DIRECTIONS[grower.direction];
      path.moveTo(grower.corner.x, grower.corner.y);
      path.lineTo(
        grower.corner.x + step.x * grower.progress,
        grower.corner.y + step.y * grower.progress,
      );
    }

    live.globalAlpha = opacity;
    live.lineCap = "round";
    live.lineWidth = 1.5;
    live.strokeStyle = color;
    live.stroke(path);
  }

  private start(from: Corner, speed: Speed) {
    const { edgeMs, edges } = SPEEDS[speed];
    this.growers.push({
      corner: from,
      direction: randomItem(CORNER_DIRECTIONS[from.kind]),
      progress: 0,
      edgeMs: randomBetween(...edgeMs),
      edgesLeft: Math.round(randomBetween(...edges)),
    });
  }

  // Saves the edge and picks the next one. Returns false when the line ends.
  private finishEdge(grower: Grower, now: number) {
    const step = DIRECTIONS[grower.direction];
    const end: Corner = {
      x: grower.corner.x + step.x,
      y: grower.corner.y + step.y,
      kind: grower.corner.kind === 0 ? 1 : 0,
    };
    const edge = { from: grower.corner, to: end, finishedAt: now };
    this.edges.push(edge);
    this.drawEdge(edge);

    grower.corner = end;
    grower.progress -= 1;
    grower.edgesLeft -= 1;
    if (grower.edgesLeft <= 0) return false;

    // pick one of the two forward edges that stays on screen
    const cameFrom = (grower.direction + 3) % 6;
    const choices = CORNER_DIRECTIONS[end.kind].filter(
      (direction) =>
        direction !== cameFrom && this.isOnScreen(end, DIRECTIONS[direction]),
    );
    if (choices.length === 0) return false;
    grower.direction = randomItem(choices);
    return true;
  }

  private isOnScreen(from: Point, step: Point) {
    const margin = SIDE * 2;
    const x = from.x + step.x;
    const y = from.y + step.y;
    return (
      x > -margin &&
      x < this.width + margin &&
      y > -margin &&
      y < this.height + margin
    );
  }

  private drawEdge(edge: Edge) {
    this.styleTrail();
    this.trail.globalAlpha = 1;
    this.trail.beginPath();
    this.trail.moveTo(edge.from.x, edge.from.y);
    this.trail.lineTo(edge.to.x, edge.to.y);
    this.trail.stroke();
  }

  // Redraws all edges at their current opacity, one stroke per step.
  private redrawTrail(now: number) {
    this.lastTrailRedraw = now;
    const oldest = now - TRAIL_HOLD_MS - TRAIL_FADE_MS;
    this.edges = this.edges
      .filter((edge) => edge.finishedAt >= oldest)
      .slice(-MAX_EDGES);

    const shades = Array.from({ length: FADE_LEVELS + 1 }, () => new Path2D());
    for (const edge of this.edges) {
      const fade =
        Math.max(0, now - edge.finishedAt - TRAIL_HOLD_MS) / TRAIL_FADE_MS;
      const level = Math.ceil((1 - Math.min(1, fade)) * FADE_LEVELS);
      if (level === 0) continue;
      shades[level].moveTo(edge.from.x, edge.from.y);
      shades[level].lineTo(edge.to.x, edge.to.y);
    }

    this.trail.clearRect(0, 0, this.width, this.height);
    this.styleTrail();
    for (let level = 1; level <= FADE_LEVELS; level++) {
      this.trail.globalAlpha = level / FADE_LEVELS;
      this.trail.stroke(shades[level]);
    }
  }

  private styleTrail() {
    this.trail.lineCap = "round";
    this.trail.lineWidth = 1.25;
    this.trail.strokeStyle = this.trailColor;
  }
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}
