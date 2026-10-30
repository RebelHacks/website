import type { Metadata } from "next";
import { IBM_Plex_Mono, Schibsted_Grotesk } from "next/font/google";
import { startupScript } from "@/lib/startupScript";
import "./globals.css";

// For the hero, dates and the RebelHacks name. Monospaced so the name keeps
// its width when letters switch to "*".
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: "700", // the only weight used
});

// Everything else.
const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RebelHacks 2027",
  description:
    "RebelHacks is UNLV's first large-scale student hackathon! This event will take place on February 20-21, 2027. Team up, build something new, and compete for $5,000+ in prizes. Free for university students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the startup script changes <html> attributes
    // before React loads
    <html
      lang="en"
      className={`${plexMono.variable} ${schibsted.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* inline so it runs before the first paint */}
        <script dangerouslySetInnerHTML={{ __html: startupScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
