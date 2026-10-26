import type { GlyphName } from "./HexGlyph";

// overall placements, not tied to a track
export interface Prize {
  name: string;
  dollars: number;
}

export interface Track {
  // leave out until the track is announced. The card shows asterisks.
  name?: string;
  description?: string;
  dollars: number;
  // card art (see GLYPHS in HexGlyph.tsx). Defaults to "?".
  glyph?: GlyphName;
}

// in rank order (first = gold bar)
export const grandPrizes: Prize[] = [
  { name: "1st place", dollars: 1500 },
  { name: "2nd place", dollars: 1000 },
  { name: "3rd place", dollars: 750 },
];

// one array per row of cards. A card alone in its row is shown wide.
export const trackRows: Track[][] = [
  [
    // keep unrevealed categories out of our source! only prize numbers are public for now
    { dollars: 500 },
    { dollars: 500 },
    { dollars: 500 },
  ],
  [
    {
      name: "Beginner",
      description: "For participants attending their first RebelHacks event",
      dollars: 250,
      glyph: "heart",
    },
  ],
];
