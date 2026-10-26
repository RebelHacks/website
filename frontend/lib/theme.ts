/*
  The theme is set by lib/startupScript.ts, which runs before React loads.
  The rest of the site talks to it through these events.
*/

export const THEME_STORAGE_KEY = "rebelhacks-theme";
export const THEME_CHANGE_EVENT = "themechange";
export const THEME_TOGGLE_EVENT = "themetoggle";

export function isDarkTheme() {
  return document.documentElement.dataset.theme === "dark";
}

export function toggleTheme() {
  window.dispatchEvent(new Event(THEME_TOGGLE_EVENT));
}

// Returns an unsubscribe function.
export function subscribeToTheme(onChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
}
