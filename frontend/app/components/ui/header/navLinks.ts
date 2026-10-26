// used by the nav, the phone menu and the footer
export const NAV_LINKS = [
  { label: "About", section: "about" },
  { label: "Schedule", section: "schedule" },
  { label: "Tracks", section: "tracks" },
  { label: "Photos", section: "photos" },
  { label: "Sponsors", section: "sponsors" },
  { label: "FAQ", section: "faq" },
  { label: "Contact", section: "contact" },
];

// starts with "/" so it also works from other pages, like the Code of Conduct
export function sectionHref(section: string) {
  return `/#${section}`;
}

// TODO: switch to the portal's sign-up page once it's live
export const REGISTER_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScotK89gO_uAouUM7qMJhMtDo7vux1IHj0iIVFiT0UT3AwMBQ/viewform?usp=header";
