// Page sections linked from the nav, the mobile menu and the footer.
// Links start with "/" so they also work from other pages, like the
// Code of Conduct.
export const NAV_LINKS = [
  { label: "About", section: "about" },
  { label: "Schedule", section: "schedule" },
  { label: "Tracks", section: "tracks" },
  { label: "Photos", section: "photos" },
  { label: "FAQ", section: "faq" },
  { label: "Contact", section: "contact" },
];

export function sectionHref(section: string) {
  return `/#${section}`;
}

// Registration form. Swap this for the portal's sign-up page once it's live.
export const REGISTER_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScotK89gO_uAouUM7qMJhMtDo7vux1IHj0iIVFiT0UT3AwMBQ/viewform?usp=header";
