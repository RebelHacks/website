export interface Photo {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  cropPosition: string;
}

// file for photo "metadata"

// Keep the original proportions for the enlarged view.
// cropPosition only changes the framing inside the 4:3 grid card.
export const photos: Photo[] = [
  {
    src: "/images/photos/welcome-to-rebelhacks.webp",
    alt: "Attendees gathered beneath the RebelHacks 2026 welcome slides",
    caption: "Welcome to RebelHacks!",
    width: 1200,
    height: 1600,
    cropPosition: "50% 45%",
  },
  {
    src: "/images/photos/details-from-the-day.webp",
    alt: "A blue shirt with red dice and the words No Risk, No Reward",
    caption: "No risk, no reward.",
    width: 1275,
    height: 960,
    cropPosition: "50% 50%",
  },
  {
    src: "/images/photos/cheering-from-the-crowd.webp",
    alt: "Audience members applauding, with a red pom-pom raised above the crowd",
    caption: "And the crowd goes wild!",
    width: 1440,
    height: 960,
    cropPosition: "45% 50%",
  },
  {
    src: "/images/photos/handshake.webp",
    alt: "A close-up of a judge and an attendee shaking hands across a table",
    caption: "Shake on it.",
    width: 1600,
    height: 1047,
    cropPosition: "50% 50%",
  },
  {
    src: "/images/photos/around-the-room.webp",
    alt: "Groups of attendees talking around tables in a busy event room",
    caption: "Around the room.",
    width: 1600,
    height: 1200,
    cropPosition: "50% 50%",
  },
  {
    src: "/images/photos/between-demos.webp",
    alt: "Attendees gathered around tables, with conversations throughout the room",
    caption: "Demoing for a judge!",
    width: 1600,
    height: 1200,
    cropPosition: "50% 50%",
  },
];
