// used by the nav, the phone menu and the footer
export const NAV_LINKS = [
  { label: "About", section: "about" },
  { label: "Schedule", section: "schedule" },
  { label: "Tracks", section: "tracks" },
  { label: "Photos", section: "photos" },
  /* Uncomment when the team content is ready for production. */
  // { label: "Team", section: "team" },
  { label: "Sponsors", section: "sponsors" },
  { label: "FAQ", section: "faq" },
  { label: "Contact", section: "contact" },
];

// starts with "/" so it also works from other pages, like the Code of Conduct
export function sectionHref(section: string) {
  return `/#${section}`;
}

export const REGISTER_URL =
  "https://portal.rebelhacks.com/";
