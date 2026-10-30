import type { GlyphName } from "./HexGlyph";

export interface Track {
  // leave out until the track is announced. The card shows asterisks.
  name?: string;
  description?: string;
  dollars: number;
  // card art (see GLYPHS in HexGlyph.tsx). Defaults to "?".
  glyph?: GlyphName;
}

// shown above the tracks, on a gold card
export const grandPrize: Track = {
  name: "Best project overall",
  description: "Every team is entered automatically, whatever track it picks.",
  dollars: 2500,
  glyph: "1",
};

// one array per row of cards. A card alone in its row is shown wide.
export const trackRows: Track[][] = [
  [
    // keep unrevealed categories out of our source! only prize numbers are public for now
    { dollars: 750 },
    { dollars: 750 },
    { dollars: 750 },
  ],
  [
    {
      name: "Beginner",
      description: "For participants attending their first RebelHacks event",
      dollars: 500,
      glyph: "heart",
    },
  ],
];
