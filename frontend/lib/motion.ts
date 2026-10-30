/*
  The footer's "Pause animations" button. Stored as data-motion="paused" on
  <html> so CSS can use it, and in localStorage (restored by
  lib/startupScript.ts).
*/

export const MOTION_STORAGE_KEY = "rebelhacks-motion";
const MOTION_CHANGE_EVENT = "motionchange";

export function isMotionPaused() {
  return document.documentElement.dataset.motion === "paused";
}

export function setMotionPaused(paused: boolean) {
  const root = document.documentElement;
  if (paused) root.dataset.motion = "paused";
  else delete root.dataset.motion;
  window.dispatchEvent(new Event(MOTION_CHANGE_EVENT));

  // Last, because it throws if storage is blocked.
  localStorage.setItem(MOTION_STORAGE_KEY, paused ? "paused" : "playing");
}

// Returns an unsubscribe function.
export function subscribeToMotion(onChange: () => void) {
  window.addEventListener(MOTION_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(MOTION_CHANGE_EVENT, onChange);
}

// footer button or the OS reduced-motion setting
export function prefersLessMotion() {
  return (
    isMotionPaused() || matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
