export interface Sponsor {
  name: string;
  // logo file in /public/images/sponsors, e.g. "/images/sponsors/acme.svg"
  logo: string;
  url: string;
}

// shown as logos under the section's description, in this order
export const sponsors: Sponsor[] = [
  {
    name: "Anthropic",
    logo: "/images/sponsors/anthropic.svg",
    url: "https://www.anthropic.com",
  },
  {
    name: "College of Southern Nevada",
    logo: "/images/sponsors/csn.png",
    url: "https://www.csn.edu",
  },
];

// our campaign page on Rebel Raiser, UNLV's crowdfunding site
export const DONATE_URL = "https://impact.unlv.edu/campaign/861116/donate";
