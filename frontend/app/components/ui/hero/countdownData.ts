export interface Milestone {
  // shown before the time left, like "Registration opens in 5d 02h 10m 30s"
  label: string;
  // Las Vegas time (-08:00 from November to early March)
  at: string;
}

// The hero counts down to the first one that hasn't happened yet.
export const milestones: Milestone[] = [
  { label: "Registration opens in", at: "2026-11-25T12:00:00-08:00" },
  { label: "RebelHacks starts in", at: "2027-02-20T08:00:00-08:00" },
];
