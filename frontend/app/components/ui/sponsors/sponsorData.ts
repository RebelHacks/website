export interface Sponsor {
  name: string;
  // logo file in /public/images/sponsors, e.g. "/images/sponsors/acme.svg"
  logo: string;
  // the sponsor's website
  url: string;
}

// Empty for now. The Sponsors section (and its spot on the page) only shows
// up once there's at least one sponsor in this list.
export const sponsors: Sponsor[] = [];
