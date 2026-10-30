import type { CSSProperties, ReactNode } from "react";
import Halo from "../halo/Halo";
import Reveal from "../reveal/Reveal";
import Section from "../section/Section";
import HexGlyph from "./HexGlyph";
import { grandPrize, trackRows, type Track } from "./trackData";
import styles from "./tracks.module.css";

export default function Tracks() {
  return (
    <Section
      id="tracks"
      title="Tracks & prizes"
      lead={
        <>
          We&apos;re offering over $5,000 cash in prizes: a grand prize, plus a
          prize for the winner of each track!
        </>
      }
    >
      <Group id="grand-prize" title="Grand prize">
        <Reveal>
          <TrackCard track={grandPrize} order={0} wide featured />
        </Reveal>
      </Group>

      <Group
        id="track-list"
        title="Tracks"
        text="Each team picks one track to build for!"
      >
        <TrackGrid />
      </Group>
    </Section>
  );
}

// -------------- groups --------------
interface GroupProps {
  id: string;
  title: string;
  text?: string;
  children: ReactNode;
}

function Group({ id, title, text, children }: GroupProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      className={`full ${styles.group}`}
      aria-labelledby={headingId}
    >
      <header className={styles.groupHeader}>
        <h3 id={headingId} className={styles.groupTitle}>
          <Halo>{title}</Halo>
        </h3>
        {text && (
          <p className={styles.groupText}>
            <Halo>{text}</Halo>
          </p>
        )}
      </header>
      {children}
    </section>
  );
}

// -------------- tracks --------------
function TrackGrid() {
  // numbered across rows so the entrance animation goes in reading order
  let cardNumber = 0;

  return (
    <Reveal className={styles.trackGrid}>
      {trackRows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.trackRow}>
          {row.map((track, index) => (
            <TrackCard
              key={index}
              track={track}
              order={cardNumber++}
              wide={row.length === 1}
            />
          ))}
        </div>
      ))}
    </Reveal>
  );
}

interface TrackCardProps {
  track: Track;
  // reading-order index, for animation delays
  order: number;
  wide: boolean;
  // gold version, for the grand prize
  featured?: boolean;
}

function TrackCard({ track, order, wide, featured }: TrackCardProps) {
  return (
    <article
      className={`card ${styles.track} ${wide ? styles.wideTrack : ""} ${featured ? styles.featured : ""}`}
      style={{ "--index": order } as CSSProperties}
    >
      <div className={styles.trackArt}>
        <HexGlyph glyph={track.glyph ?? "?"} />
      </div>
      <div className={styles.trackBody}>
        <h4 className={styles.trackName}>{track.name ?? <MysteryName />}</h4>
        <p className={styles.trackDescription}>
          {track.description ?? "Revealed on event day."}
        </p>
        <Amount dollars={track.dollars} className={styles.trackAmount} />
      </div>
    </article>
  );
}

// Screen readers would read out every asterisk, so they get text instead.
function MysteryName() {
  return (
    <>
      <span className={styles.masked} aria-hidden="true">
        ********
      </span>
      <span className="sr-only">Mystery track</span>
    </>
  );
}

// -------------- shared --------------
interface AmountProps {
  dollars: number;
  className: string;
}

// No thousands comma. In the mono font it's digit-wide and looks like a gap.
function Amount({ dollars, className }: AmountProps) {
  return (
    <span className={className}>
      <span className={styles.currency}>$</span>
      {dollars}
    </span>
  );
}
