import { isMotionPaused, subscribeToMotion } from "@/lib/motion";
import { subscribeToTheme } from "@/lib/theme";
import { CursorGlow } from "./cursorGlow";
import { GrowingLines } from "./growingLines";
import { COLUMN_STEP, ROW_STEP, hexCenter, traceHex } from "./honeycomb";

/*
  The honeycomb background:
  - base: the base grid
  - trail: lines that have finished growing, fading out (growingLines.ts).
  - live: redrawn every frame. The growing lines' red tips, and the cells lit
    up near the mouse (cursorGlow.ts).
  Colors come from the CSS variables in globals.css.
*/

// line counts are for 1440x900 and scale with screen area
const LINES = 4; // growing at once
const MIN_LINES = 3;
const MAX_LINES = 9;
const INTRO_LINES = 12; // lines in the intro animation around the name
const INTRO_MS = 2200; // about as long as the name's intro animation
const SCROLLED_STRENGTH = 0.7; // line opacity after scrolling past the hero
const TRAIL_OPACITY = 0.7; // finished lines are lighter than the tips
const IDLE_FRAME_MS = 32; // ~30fps while nothing's happening to save battery
const PIXEL_BUDGET = 8_000_000; // max canvas pixels, to limit memory on huge screens

interface Options {
  // no intro animation, fainter lines
  quiet?: boolean;
}

// Returns a cleanup function.
export function startHexGrid(
  baseCanvas: HTMLCanvasElement,
  trailCanvas: HTMLCanvasElement,
  liveCanvas: HTMLCanvasElement,
  { quiet = false }: Options = {},
) {
  const base = baseCanvas.getContext("2d");
  const trail = trailCanvas.getContext("2d");
  const live = liveCanvas.getContext("2d");
  if (!base || !trail || !live) {
    // null if the canvas already has another context type, like WebGL
    console.error("HexGrid: couldn't get a 2D context for the canvases");
    return () => {};
  }

  const lowEnd = isLowEndDevice();
  let colors = readColors();
  const lines = new GrowingLines(trail, colors.trace);
  const glow = new CursorGlow();
  let width = 0;
  let height = 0;
  let introEndsAt = 0;
  let lastPointerMove = -Infinity;
  let lastFrame = 0;
  let frameId = 0;

  // this screen's area compared to 1440x900
  const screenScale = () => Math.sqrt((width * height) / (1440 * 900));

  const lineTarget = () => {
    const target = clamp(
      Math.round(LINES * screenScale()),
      MIN_LINES,
      MAX_LINES,
    );
    return lowEnd ? Math.ceil(target / 2) : target;
  };

  const resize = () => {
    width = baseCanvas.clientWidth;
    height = baseCanvas.clientHeight;

    // full resolution on retina screens, capped by PIXEL_BUDGET
    const pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2,
      Math.sqrt(PIXEL_BUDGET / (width * height)),
    );
    sizeCanvas(base, pixelRatio);
    sizeCanvas(trail, pixelRatio);
    // The live layer stays at 1x since it's redrawn every frame. Thin moving
    // lines look the same either way.
    sizeCanvas(live, 1);

    drawHoneycomb(base, width, height, colors.grid);
    lines.resize(width, height);
  };

  const drawLive = (now: number) => {
    // 1 over the hero, down to SCROLLED_STRENGTH once it's scrolled away
    const scrolled = quiet ? 1 : Math.min(1, window.scrollY / (height * 0.8));
    const strength = 1 - scrolled * (1 - SCROLLED_STRENGTH);

    // trail strength is the canvas's CSS opacity. Only set it when it changes.
    const trailOpacity = String(
      Math.round(strength * TRAIL_OPACITY * 100) / 100,
    );
    if (trailCanvas.style.opacity !== trailOpacity) {
      trailCanvas.style.opacity = trailOpacity;
    }

    live.clearRect(0, 0, width, height);
    glow.draw(live, colors.cell, colors.trace);
    lines.drawTips(live, now, colors.tip, strength);
  };

  const frame = (now: number) => {
    frameId = requestAnimationFrame(frame);

    // full frame rate only while the mouse moves or the intro plays
    const isBusy = now - lastPointerMove < 1500 || now < introEndsAt;
    if ((lowEnd || !isBusy) && now - lastFrame < IDLE_FRAME_MS) return;

    // capped so lines don't jump ahead after a pause, like a background tab
    const elapsed = Math.min(50, now - lastFrame);
    lastFrame = now;

    lines.update(now, elapsed);
    // after the intro, top up to lineTarget() lines
    if (
      now > introEndsAt &&
      lines.count < lineTarget() &&
      Math.random() < 0.03
    ) {
      lines.startAnywhere("slow");
    }
    if (!lowEnd) glow.update(elapsed);
    drawLive(now);
  };

  const start = () => {
    cancelAnimationFrame(frameId); // never run two loops at once
    if (isMotionPaused()) return;
    lastFrame = performance.now();
    frameId = requestAnimationFrame(frame);
  };

  const stop = () => cancelAnimationFrame(frameId);

  // ---------- events ----------
  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    glow.setPointer({ x: event.clientX, y: event.clientY });
    lastPointerMove = performance.now();
  };

  // relatedTarget is null when the mouse leaves the window
  const handleMouseOut = (event: MouseEvent) => {
    if (event.relatedTarget === null) glow.setPointer(null);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) stop();
    else start();
  };

  const handleThemeChange = () => {
    colors = readColors();
    drawHoneycomb(base, width, height, colors.grid);
    lines.setColor(colors.trace);
  };

  const handleMotionChange = () => {
    if (!isMotionPaused()) {
      start();
      return;
    }
    stop();
    // clear the tips and glow so they don't sit frozen while paused
    glow.clear();
    live.clearRect(0, 0, width, height);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(baseCanvas);
  resize();
  const unsubscribeTheme = subscribeToTheme(handleThemeChange);

  // OS reduced-motion setting: static grid only
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {
      resizeObserver.disconnect();
      unsubscribeTheme();
    };
  }

  // intro animation, only on a fresh load at the top of the page
  if (!quiet && !isMotionPaused() && window.scrollY < 50) {
    introEndsAt = performance.now() + INTRO_MS;
    const count = clamp(Math.round(INTRO_LINES * screenScale()), 8, 24);
    const middle = { x: width / 2, y: height / 2 };
    const radius = Math.min(width, height) * 0.2;
    for (let i = 0; i < count; i++) lines.startNear(middle, radius, "fast");
  }

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("mouseout", handleMouseOut);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  const unsubscribeMotion = subscribeToMotion(handleMotionChange);
  start();

  return () => {
    stop();
    resizeObserver.disconnect();
    unsubscribeTheme();
    unsubscribeMotion();
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("mouseout", handleMouseOut);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}

function drawHoneycomb(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
) {
  context.clearRect(0, 0, width, height);
  const path = new Path2D();
  const columns = Math.ceil(width / COLUMN_STEP) + 1;
  const rows = Math.ceil(height / ROW_STEP) + 1;
  for (let column = -1; column <= columns; column++) {
    for (let row = -1; row <= rows; row++) {
      traceHex(path, hexCenter(column, row));
    }
  }
  context.strokeStyle = color;
  context.lineWidth = 1;
  context.stroke(path);
}

// Sets the canvas resolution to its css size times pixelRatio, so drawing
// code can use css pixels.
function sizeCanvas(context: CanvasRenderingContext2D, pixelRatio: number) {
  const canvas = context.canvas;
  canvas.width = Math.round(canvas.clientWidth * pixelRatio);
  canvas.height = Math.round(canvas.clientHeight * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function readColors() {
  return {
    grid: cssColor("--color-grid"),
    trace: cssColor("--color-grid-trace"),
    tip: cssColor("--color-red"),
    cell: cssColor("--color-surface"),
  };
}

// A missing color is a bug in globals.css (lines would draw black), so log it.
function cssColor(name: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!value) console.error(`HexGrid: ${name} is missing from globals.css`);
  return value;
}

// Low-memory devices and data-saver mode get half the lines, no cursor
// glow, and ~30fps.
function isLowEndDevice() {
  // deviceMemory and saveData are Chrome-only, so TypeScript doesn't know them
  const device = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const lowMemory = (device.deviceMemory ?? 8) <= 2;
  return lowMemory || device.connection?.saveData === true;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
