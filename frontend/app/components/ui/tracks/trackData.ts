// a row in the grand prizes list, or a card in the tracks grid
export interface Award {
  name?: string;
  prize: string;
  description?: string;
  // shape shown in the card's honeycomb art (see GLYPHS in HexGlyph.tsx); mystery tracks show "?"
  glyph?: string;
  // tracks that haven't been announced yet
  hidden?: boolean;
}

// Overall placements, not tracks. Listed in rank order.
export const prizes: Award[] = [
  { name: "1st place", prize: "$1,500" },
  { name: "2nd place", prize: "$1,000" },
  { name: "3rd place", prize: "$750" },
];

export const trackRows: Award[][] = [
  [
    // keep unrevealed categories out of our source! only prize numbers are public for now
    { prize: "$500", hidden: true },
    { prize: "$500", hidden: true },
    { prize: "$500", hidden: true },
  ],
  [
    {
      name: "Beginner",
      prize: "$250",
      description: "For participants attending their first RebelHacks event",
      glyph: "heart",
    },
  ],
];
