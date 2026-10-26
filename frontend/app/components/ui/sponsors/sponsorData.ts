export interface Sponsor {
  name: string;
  // logo file in /public/images/sponsors, e.g. "/images/sponsors/acme.svg"
  logo: string;
  url: string;
}

// While this is empty, the section shows a "sponsor us" card instead.
export const sponsors: Sponsor[] = [];
