import type { Metadata } from "next";
import { IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

// Flair font: the hero, dates and the RebelHacks name. Monospaced, so the
// name doesn't change width while its letters animate.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: "700", // the only weight the flair text uses
});

// Everything else.
const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RebelHacks 2027",
  description:
    "RebelHack is UNLV's first large-scale student hackathon! This event will take place on February 20-21, 2027. Team up, build something new, and compete for $5,000 in prizes. Free for UNLV and CSN students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plexMono.variable} ${schibsted.variable}`}>
      <body>{children}</body>
    </html>
  );
}
