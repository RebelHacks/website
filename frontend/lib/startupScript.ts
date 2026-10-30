import { MOTION_STORAGE_KEY } from "./motion";
import {
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  THEME_TOGGLE_EVENT,
} from "./theme";

/*
  Runs in <head> before the page renders

  Switches to dark mode from sunset to sunrise and then switches back

  Don't use anything from outside startup()! It's turned into a string for  an inline <script> (same approach as next-themes), so shared names are passed in as `names`.
*/

interface SharedNames {
  themeKey: string;
  motionKey: string;
  themeChangeEvent: string;
  themeToggleEvent: string;
}

function startup(names: SharedNames) {
  const DAY_MS = 86_400_000;
  const root = document.documentElement;

  // the theme picked with the header button, or null to follow the sun
  let chosenTheme: string | null = null;
  // Throws if site data is blocked. Caught so the theme still gets set.
  try {
    chosenTheme = localStorage.getItem(names.themeKey);
    if (localStorage.getItem(names.motionKey) === "paused") {
      root.dataset.motion = "paused";
    }
  } catch (error) {
    console.warn("Saved settings are blocked, using defaults:", error);
  }

  let sunTimer = 0;
  applyTheme();
  // timers don't run while a laptop sleeps, so recheck when the tab is visible
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) applyTheme();
  });
  window.addEventListener(names.themeToggleEvent, toggleTheme);

  function applyTheme() {
    const sun = sunTheme();
    const theme = chosenTheme || sun.theme;
    if (root.dataset.theme !== theme) {
      root.dataset.theme = theme;
      window.dispatchEvent(new Event(names.themeChangeEvent));
    }

    clearTimeout(sunTimer);
    sunTimer = window.setTimeout(applyTheme, sun.changesAt - Date.now() + 1000);
  }

  function toggleTheme() {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    const sunWouldPick = sunTheme().theme;
    chosenTheme = theme === sunWouldPick ? null : theme;
    applyTheme();

    // Last, because it throws if storage is blocked.
    if (chosenTheme) localStorage.setItem(names.themeKey, chosenTheme);
    else localStorage.removeItem(names.themeKey);
  }

  // the sun's theme right now, and when it next changes
  function sunTheme() {
    const now = Date.now();
    const today = sunTimes(0);
    if (now < today.sunrise) return { theme: "dark", changesAt: today.sunrise };
    if (now < today.sunset) return { theme: "light", changesAt: today.sunset };
    return { theme: "dark", changesAt: sunTimes(1).sunrise };
  }

  // sunrise and sunset timestamps, `daysFromToday` days from today in Vegas
  function sunTimes(daysFromToday: number) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(new Date(Date.now() + daysFromToday * DAY_MS));
    const part = (type: string) =>
      Number(parts.find((found) => found.type === type)!.value);

    return sunriseEquation(
      Date.UTC(part("year"), part("month") - 1, part("day")),
    );
  }

  // https://en.wikipedia.org/wiki/Sunrise_equation, accurate to a minute or two
  function sunriseEquation(midnightUtc: number) {
    const LATITUDE = 36.1716;
    const LONGITUDE = -115.1391;
    const rad = Math.PI / 180;
    const toJulian = (time: number) => time / DAY_MS + 2440587.5;
    const fromJulian = (julian: number) => (julian - 2440587.5) * DAY_MS;

    const day = Math.ceil(toJulian(midnightUtc) - 2451545 + 0.0008);
    const meanNoon = day - LONGITUDE / 360;
    const anomaly = (357.5291 + 0.98560028 * meanNoon) % 360;
    const center =
      1.9148 * Math.sin(anomaly * rad) +
      0.02 * Math.sin(2 * anomaly * rad) +
      0.0003 * Math.sin(3 * anomaly * rad);
    const longitude = (anomaly + center + 180 + 102.9372) % 360;
    const solarNoon =
      2451545 +
      meanNoon +
      0.0053 * Math.sin(anomaly * rad) -
      0.0069 * Math.sin(2 * longitude * rad);
    const declination = Math.asin(
      Math.sin(longitude * rad) * Math.sin(23.4397 * rad),
    );
    const hourAngle = Math.acos(
      (Math.sin(-0.833 * rad) -
        Math.sin(LATITUDE * rad) * Math.sin(declination)) /
        (Math.cos(LATITUDE * rad) * Math.cos(declination)),
    );
    const halfDay = hourAngle / rad / 360;

    return {
      sunrise: fromJulian(solarNoon - halfDay),
      sunset: fromJulian(solarNoon + halfDay),
    };
  }
}

const names: SharedNames = {
  themeKey: THEME_STORAGE_KEY,
  motionKey: MOTION_STORAGE_KEY,
  themeChangeEvent: THEME_CHANGE_EVENT,
  themeToggleEvent: THEME_TOGGLE_EVENT,
};

export const startupScript = `(${startup.toString()})(${JSON.stringify(names)});`;
