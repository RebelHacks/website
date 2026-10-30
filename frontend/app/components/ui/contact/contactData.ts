// Where messages go. Mail to rebelhacks.com is forwarded by Cloudflare Email Routing.
export const CONTACT_EMAIL = "info@rebelhacks.com";

export interface ContactRole {
  label: string;
  // put in the message box when this role is picked
  template: string;
}

export const contactRoles: ContactRole[] = [
  {
    label: "A hacker",
    template:
      "Hi! I'm thinking about joining RebelHacks 2027. My question:\n\n",
  },
  {
    label: "A judge",
    template:
      "Hi! I'd love to be a judge at RebelHacks 2027.\n\nWhere I work now, and where I've worked before:\n\nWhen I'm free to chat:\n",
  },
  {
    label: "A sponsor",
    template:
      "Hi! I'm interested in sponsoring RebelHacks 2027.\n\nCompany:\n\nWhen I'm free to chat:\n",
  },
  { label: "Other", template: "" },
];
