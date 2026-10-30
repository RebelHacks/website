export interface Sponsor {
  name: string;
  // logo file in /public/images/sponsors, e.g. "/images/sponsors/acme.svg"
  logo: string;
  url: string;
}

// shown as logos under the section's description, in this order
export const sponsors: Sponsor[] = [];

// TODO: our campaign page on Rebel Raiser, UNLV's crowdfunding site, once it's live
export const DONATE_URL = "#";
