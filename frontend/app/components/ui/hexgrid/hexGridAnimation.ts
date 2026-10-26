/*
  The honeycomb behind the whole page.

  Three stacked canvases:
  - base: the faint resting grid. Drawn once, and again only on resize.
  - trails: lines that have finished growing. Each one is drawn once when it
    finishes, and the whole layer is redrawn about once a second so old
    lines can fade out slowly (they last a minute).
  - live: what's moving right now, redrawn every frame: the red tips of the
    growing lines, and cells lighting up near the mouse.

  Keeping finished lines off the live layer means a screen full of trails
  costs almost nothing per frame.

  The canvases are fixed to the viewport, so the page scrolls over them.
  Colors come from the CSS variables in globals.css.
*/

// ---------- honeycomb geometry ----------
// Flat-topped hexagons with sides of SIDE css pixels.
const SIDE = 28;
const ROW_STEP = Math.sqrt(3) * SIDE; // vertical distance between hexes in a column
const COLUMN_STEP = 1.5 * SIDE; // horizontal distance between columns

// The six directions an edge can point, in degrees (y points down on screen).
const DIRECTIONS = [0, 60, 120, 180, 240, 300].map((degrees) => {
  const radians = (degrees * Math.PI) / 180;
  return { x: Math.cos(radians) * SIDE, y: Math.sin(radians) * SIDE };
});

// Every corner of a honeycomb joins exactly three edges, and there are two
// kinds of corner: one whose edges point at 0°/120°/240°, and one whose edges
// point at 60°/180°/300°. Walking along an edge always lands on the other kind.
const CORNER_DIRECTIONS = [
  [0, 2, 4],
  [1, 3, 5],
];

// center of the hex at column q, row r (odd columns sit half a row lower)
function hexCenter(q: number, r: number) {
  const isOddColumn = ((q % 2) + 2) % 2 === 1;
  return {
    x: q * COLUMN_STEP,
    y: r * ROW_STEP + (isOddColumn ? ROW_STEP / 2 : 0),
  };
}

function traceHex(path: CanvasPath, cx: number, cy: number) {
  path.moveTo(cx + DIRECTIONS[0].x, cy + DIRECTIONS[0].y);
  for (let i = 1; i < 6; i++)
    path.lineTo(cx + DIRECTIONS[i].x, cy + DIRECTIONS[i].y);
  path.closePath();
}

// ---------- tuning ----------
// Line counts are for a 1440x900 screen and scale with the screen's size,
// so a big monitor isn't sparse and a phone isn't crowded.
const GROWERS = 4; // lines growing at once
const MIN_GROWERS = 3;
const MAX_GROWERS = 9;
const INTRO_GROWERS = 12; // burst of lines around the name on page load
const INTRO_LENGTH_MS = 2200; // roughly as long as the name takes to resolve
const BRANCH_CHANCE = 0.05; // chance a line splits in two at a corner
const TRAIL_HOLD_MS = 40_000; // finished lines stay fully visible this long
const TRAIL_FADE_MS = 20_000; // then fade out over this long (a minute in all)
const TRAIL_OPACITY = 0.7; // finished lines are a little lighter than the growing tips
const TRAIL_REFRESH_MS = 1000; // how often the trail layer is redrawn for fading
const FADE_LEVELS = 8; // fading lines are grouped into this many shades
const MAX_SEGMENTS = 10_000; // safety cap on stored lines
const TIP_MS = 350; // the newest edges are drawn red
const CURSOR_RADIUS = 150; // css px around the mouse where cells light up
const CURSOR_GLOW = 0.45; // how strongly those cells light up, 0..1
const GLOW_LEVELS = 8; // lit cells are grouped into this many brightness steps
const IDLE_FRAME_MS = 32; // ~30fps when the mouse isn't moving, to save battery
const CONTENT_TRACE_STRENGTH = 0.7; // lines are quieter once you scroll past the hero
const PIXEL_BUDGET = 8_000_000; // max canvas pixels, so huge screens stay light

// Slower devices: the animation watches how fast the browser is drawing
// frames. If it averages slower than SLOW_FRAME_MS (about 35fps) it steps
// down a quality level: FULL -> LIGHT (half the lines, no cursor glow,
// always 30fps) -> STILL (stops, leaving the honeycomb as it is).
const FULL = 2;
const LIGHT = 1;
const STILL = 0;
const SLOW_FRAME_MS = 28;
const CHECK_EVERY_MS = 2000; // how much time each frame-rate check covers
const CHECK_AFTER_MS = 3000; // skip the busy first seconds of page load

interface Grower {
  x: number; // corner the current edge starts from
  y: number;
  corner: 0 | 1; // which kind of corner (see CORNER_DIRECTIONS)
  direction: number; // index into DIRECTIONS for the edge being drawn
  progress: number; // 0..1 along the current edge
  edgeMs: number; // how long one edge takes to draw
  stepsLeft: number; // edges left before this line stops
}

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  born: number; // time the edge finished drawing
}

interface LitCell {
  x: number;
  y: number;
  heat: number; // 0..1, how strongly it's lit right now
  target: number; // where heat is easing toward
}

function cssColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// Starts the animation. Returns a function that stops it and cleans up.
export function startHexGrid(
  baseCanvas: HTMLCanvasElement,
  trailCanvas: HTMLCanvasElement,
  liveCanvas: HTMLCanvasElement,
  { quiet = false } = {},
) {
  const base = baseCanvas.getContext("2d");
  const trail = trailCanvas.getContext("2d");
  const live = liveCanvas.getContext("2d");
  if (!base || !trail || !live) return () => {};

  const colors = {
    grid: cssColor("--color-grid", "#dbdbdb"),
    trace: cssColor("--color-grid-trace", "#858585"),
    tip: cssColor("--color-red", "#c50909"),
    cell: cssColor("--color-surface", "#ffffff"),
  };

  let width = 0;
  let height = 0;
  let sizeScale = 1; // this screen's size compared to 1440x900
  let growers: Grower[] = [];
  let segments: Segment[] = [];
  const litCells = new Map<string, LitCell>();
  let pointer: { x: number; y: number } | null = null;
  let lastPointerMove = -Infinity;
  let introEndsAt = 0;
  let frameId = 0;
  let lastFrame = 0;
  let lastDraw = 0;
  let lastTrailRefresh = 0;
  let trailOpacity = -1;
  let quality = startingQuality();
  let lastCallback = 0; // for measuring the browser's frame rate
  let checkFrom = 0;
  let frameTimeTotal = 0;
  let framesCounted = 0;

  // ---------- sizing + the resting grid ----------
  function resize() {
    width = baseCanvas.clientWidth;
    height = baseCanvas.clientHeight;
    sizeScale = Math.sqrt((width * height) / (1440 * 900));

    // The still grid and the trails are sharp on retina screens, within a
    // pixel budget so very large screens don't get huge canvases.
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      2,
      Math.sqrt(PIXEL_BUDGET / (width * height)),
    );
    for (const [canvas, context] of [
      [baseCanvas, base],
      [trailCanvas, trail],
    ] as const) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // The live layer is redrawn every frame, so it stays at 1x: a quarter of
    // the pixels on retina screens, and the thin moving lines look the same.
    liveCanvas.width = Math.round(width);
    liveCanvas.height = Math.round(height);

    drawBaseGrid();
    redrawTrails(performance.now());
  }

  function drawBaseGrid() {
    base!.clearRect(0, 0, width, height);
    const path = new Path2D();
    const columns = Math.ceil(width / COLUMN_STEP) + 1;
    const rows = Math.ceil(height / ROW_STEP) + 1;
    for (let q = -1; q <= columns; q++) {
      for (let r = -1; r <= rows; r++) {
        const center = hexCenter(q, r);
        traceHex(path, center.x, center.y);
      }
    }
    base!.strokeStyle = colors.grid;
    base!.lineWidth = 1;
    base!.stroke(path);
  }

  // ---------- the trail layer ----------
  function styleTrailLines() {
    trail!.lineCap = "round";
    trail!.lineWidth = 1.25;
    trail!.strokeStyle = colors.trace;
  }

  // draw one just-finished edge at full strength
  function drawTrail(segment: Segment) {
    styleTrailLines();
    trail!.globalAlpha = 1;
    trail!.beginPath();
    trail!.moveTo(segment.x1, segment.y1);
    trail!.lineTo(segment.x2, segment.y2);
    trail!.stroke();
  }

  // Redraw every stored edge at its current fade. Edges are grouped by how
  // faded they are, so each group is one stroke call.
  function redrawTrails(now: number) {
    lastTrailRefresh = now;

    // forget edges that have fully faded
    const oldest = now - TRAIL_HOLD_MS - TRAIL_FADE_MS;
    let firstKept = 0;
    while (firstKept < segments.length && segments[firstKept].born < oldest)
      firstKept++;
    segments = segments.slice(
      Math.max(firstKept, segments.length - MAX_SEGMENTS),
    );

    const paths = Array.from({ length: FADE_LEVELS + 1 }, () => new Path2D());
    for (const segment of segments) {
      const fade =
        Math.max(0, now - segment.born - TRAIL_HOLD_MS) / TRAIL_FADE_MS;
      const level = Math.ceil((1 - Math.min(1, fade)) * FADE_LEVELS);
      if (level === 0) continue;
      paths[level].moveTo(segment.x1, segment.y1);
      paths[level].lineTo(segment.x2, segment.y2);
    }

    trail!.clearRect(0, 0, width, height);
    styleTrailLines();
    for (let level = 1; level <= FADE_LEVELS; level++) {
      trail!.globalAlpha = level / FADE_LEVELS;
      trail!.stroke(paths[level]);
    }
  }

  // ---------- growing lines ----------
  function isOnScreen(x: number, y: number) {
    const margin = SIDE * 2;
    return (
      x > -margin && x < width + margin && y > -margin && y < height + margin
    );
  }

  // a random corner of a random hex, optionally near a point
  function randomCorner(near?: { x: number; y: number; radius: number }) {
    const x = near
      ? near.x + randomBetween(-near.radius, near.radius)
      : randomBetween(0, width);
    const y = near
      ? near.y + randomBetween(-near.radius, near.radius)
      : randomBetween(0, height);
    const center = hexCenter(
      Math.round(x / COLUMN_STEP),
      Math.round(y / ROW_STEP),
    );
    // corner 0 is a hex's right point, corner 1 its left point
    const corner: 0 | 1 = Math.random() < 0.5 ? 0 : 1;
    const point = corner === 0 ? DIRECTIONS[0] : DIRECTIONS[3];
    return { x: center.x + point.x, y: center.y + point.y, corner };
  }

  function addGrower(
    start: { x: number; y: number; corner: 0 | 1 },
    fast: boolean,
    direction?: number,
  ) {
    const options = CORNER_DIRECTIONS[start.corner];
    growers.push({
      x: start.x,
      y: start.y,
      corner: start.corner,
      direction: direction ?? options[Math.floor(Math.random() * 3)],
      progress: 0,
      edgeMs: fast ? randomBetween(70, 110) : randomBetween(150, 230),
      stepsLeft: fast
        ? Math.round(randomBetween(8, 18))
        : Math.round(randomBetween(14, 36)),
    });
  }

  // how many lines should be growing at once on this screen
  function growerTarget() {
    const target = clamp(
      Math.round(GROWERS * sizeScale),
      MIN_GROWERS,
      MAX_GROWERS,
    );
    return quality === FULL ? target : Math.ceil(target / 2);
  }

  // finish the current edge and pick the next one; returns false when the line ends
  function advance(grower: Grower, now: number) {
    const step = DIRECTIONS[grower.direction];
    const endX = grower.x + step.x;
    const endY = grower.y + step.y;
    const segment = {
      x1: grower.x,
      y1: grower.y,
      x2: endX,
      y2: endY,
      born: now,
    };
    segments.push(segment);
    drawTrail(segment);

    grower.x = endX;
    grower.y = endY;
    grower.corner = grower.corner === 0 ? 1 : 0;
    grower.progress -= 1;
    grower.stepsLeft -= 1;
    if (grower.stepsLeft <= 0) return false;

    // the two edges ahead (not the one we just came along), kept on screen
    const cameFrom = (grower.direction + 3) % 6;
    const choices = CORNER_DIRECTIONS[grower.corner].filter((direction) => {
      if (direction === cameFrom) return false;
      const next = DIRECTIONS[direction];
      return isOnScreen(grower.x + next.x, grower.y + next.y);
    });
    if (choices.length === 0) return false;

    const pick = Math.floor(Math.random() * choices.length);
    grower.direction = choices[pick];

    // sometimes split: a second line takes the other edge
    if (
      choices.length === 2 &&
      Math.random() < BRANCH_CHANCE &&
      growers.length < growerTarget() * 3
    ) {
      addGrower(
        { x: grower.x, y: grower.y, corner: grower.corner },
        false,
        choices[1 - pick],
      );
    }
    return true;
  }

  function updateGrowers(now: number, elapsed: number) {
    growers = growers.filter((grower) => {
      grower.progress += elapsed / grower.edgeMs;
      while (grower.progress >= 1) {
        if (!advance(grower, now)) return false;
      }
      return true;
    });

    // keep a few lines going once the intro burst is over
    if (
      now > introEndsAt &&
      growers.length < growerTarget() &&
      Math.random() < 0.03
    ) {
      addGrower(randomCorner(), false);
    }
  }

  // ---------- cells near the mouse ----------
  function updateLitCells(elapsed: number) {
    for (const cell of litCells.values()) cell.target = 0;

    if (pointer) {
      const firstColumn = Math.floor((pointer.x - CURSOR_RADIUS) / COLUMN_STEP);
      const lastColumn = Math.ceil((pointer.x + CURSOR_RADIUS) / COLUMN_STEP);
      const firstRow = Math.floor((pointer.y - CURSOR_RADIUS) / ROW_STEP) - 1;
      const lastRow = Math.ceil((pointer.y + CURSOR_RADIUS) / ROW_STEP);
      for (let q = firstColumn; q <= lastColumn; q++) {
        for (let r = firstRow; r <= lastRow; r++) {
          const center = hexCenter(q, r);
          const distance = Math.hypot(
            center.x - pointer.x,
            center.y - pointer.y,
          );
          if (distance >= CURSOR_RADIUS) continue;
          const key = `${q},${r}`;
          const cell = litCells.get(key) ?? {
            x: center.x,
            y: center.y,
            heat: 0,
            target: 0,
          };
          cell.target = (1 - distance / CURSOR_RADIUS) ** 1.5;
          litCells.set(key, cell);
        }
      }
    }

    // ease toward the target: light up quickly, fade out slowly
    const frames = elapsed / 16.7;
    for (const [key, cell] of litCells) {
      const rate = cell.target > cell.heat ? 0.3 : 0.05;
      cell.heat += (cell.target - cell.heat) * Math.min(1, rate * frames);
      if (cell.target === 0 && cell.heat < 0.01) litCells.delete(key);
    }
  }

  // ---------- drawing the live layer ----------
  function draw(now: number) {
    // full strength over the hero, fading to CONTENT_TRACE_STRENGTH by the
    // time the hero has scrolled away
    const scrolled = quiet ? 1 : Math.min(1, window.scrollY / (height * 0.8));
    const strength = 1 - scrolled * (1 - CONTENT_TRACE_STRENGTH);

    // the trail layer's strength is just its CSS opacity
    const roundedStrength = Math.round(strength * TRAIL_OPACITY * 100) / 100;
    if (roundedStrength !== trailOpacity) {
      trailOpacity = roundedStrength;
      trailCanvas.style.opacity = String(roundedStrength);
    }

    live!.clearRect(0, 0, width, height);

    // lit cells, grouped by brightness so each group is one fill + one stroke
    const glowPaths = Array.from(
      { length: GLOW_LEVELS + 1 },
      () => new Path2D(),
    );
    for (const cell of litCells.values()) {
      const level = Math.round(cell.heat * GLOW_LEVELS);
      if (level > 0) traceHex(glowPaths[level], cell.x, cell.y);
    }
    live!.lineWidth = 1;
    live!.fillStyle = colors.cell;
    live!.strokeStyle = colors.trace;
    for (let level = 1; level <= GLOW_LEVELS; level++) {
      const glow = (level / GLOW_LEVELS) * CURSOR_GLOW;
      live!.globalAlpha = glow * 0.75;
      live!.fill(glowPaths[level]);
      live!.globalAlpha = glow;
      live!.stroke(glowPaths[level]);
    }

    // red tips: the edges being drawn right now, plus the newest finished
    // ones (the newest are at the end of the list, so walk it backwards)
    const tipPath = new Path2D();
    for (let i = segments.length - 1; i >= 0; i--) {
      const segment = segments[i];
      if (now - segment.born >= TIP_MS) break;
      tipPath.moveTo(segment.x1, segment.y1);
      tipPath.lineTo(segment.x2, segment.y2);
    }
    for (const grower of growers) {
      const step = DIRECTIONS[grower.direction];
      tipPath.moveTo(grower.x, grower.y);
      tipPath.lineTo(
        grower.x + step.x * grower.progress,
        grower.y + step.y * grower.progress,
      );
    }
    live!.globalAlpha = strength;
    live!.lineCap = "round";
    live!.lineWidth = 1.5;
    live!.strokeStyle = colors.tip;
    live!.stroke(tipPath);
  }

  function frame(now: number) {
    frameId = requestAnimationFrame(frame);
    measureFrameRate(now);
    if (quality === STILL) return;

    // full speed only while something is happening; otherwise ~30fps
    const isBusy = now - lastPointerMove < 1500 || now < introEndsAt;
    if ((quality === LIGHT || !isBusy) && now - lastDraw < IDLE_FRAME_MS)
      return;

    // cap the step so a long pause (e.g. a background tab) doesn't jump ahead
    const elapsed = Math.min(50, now - lastFrame);
    lastFrame = now;
    lastDraw = now;
    updateGrowers(now, elapsed);
    if (quality === FULL) updateLitCells(elapsed);
    if (now - lastTrailRefresh >= TRAIL_REFRESH_MS) redrawTrails(now);
    draw(now);
  }

  function start() {
    if (quality === STILL) return;
    lastFrame = lastCallback = performance.now();
    checkFrom = lastFrame + CHECK_AFTER_MS;
    frameId = requestAnimationFrame(frame);
  }

  // ---------- adapting to slower devices ----------
  // Low-memory devices, and anyone with data saver on, start in LIGHT.
  function startingQuality() {
    const device = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const lowMemory = (device.deviceMemory ?? 8) <= 2;
    return lowMemory || device.connection?.saveData ? LIGHT : FULL;
  }

  // Average the time between frames; step down a level if it's too slow.
  function measureFrameRate(now: number) {
    const sinceLast = now - lastCallback;
    lastCallback = now;
    if (now < checkFrom) return;
    frameTimeTotal += sinceLast;
    framesCounted += 1;
    if (frameTimeTotal < CHECK_EVERY_MS) return;

    if (frameTimeTotal / framesCounted > SLOW_FRAME_MS) {
      quality -= 1;
      litCells.clear();
      if (quality === STILL) stop();
    }
    liveCanvas.dataset.quality = String(quality); // handy when debugging
    frameTimeTotal = 0;
    framesCounted = 0;
  }

  function stop() {
    cancelAnimationFrame(frameId);
  }

  // ---------- events ----------
  function onPointerMove(event: PointerEvent) {
    if (event.pointerType === "touch") return;
    pointer = { x: event.clientX, y: event.clientY };
    lastPointerMove = performance.now();
  }

  function onPointerOut(event: MouseEvent) {
    if (event.relatedTarget === null) pointer = null;
  }

  function onVisibilityChange() {
    if (document.hidden) stop();
    else start();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(baseCanvas);
  resize();

  // People who turn off animations in their OS settings get the still grid.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => resizeObserver.disconnect();
  }

  // On a fresh load at the top of the page, lines burst out around the name.
  if (!quiet && window.scrollY < 50) {
    introEndsAt = performance.now() + INTRO_LENGTH_MS;
    const middle = {
      x: width / 2,
      y: height / 2,
      radius: Math.min(width, height) * 0.2,
    };
    const introCount = clamp(Math.round(INTRO_GROWERS * sizeScale), 8, 24);
    for (let i = 0; i < introCount; i++) addGrower(randomCorner(middle), true);
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("mouseout", onPointerOut);
  document.addEventListener("visibilitychange", onVisibilityChange);
  start();

  return () => {
    stop();
    resizeObserver.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("mouseout", onPointerOut);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}
