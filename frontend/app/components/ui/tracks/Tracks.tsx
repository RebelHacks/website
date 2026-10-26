import type { CSSProperties, ReactNode } from "react";
import Halo from "../halo/Halo";
import Reveal from "../reveal/Reveal";
import Section from "../section/Section";
import HexGlyph from "./HexGlyph";
import { grandPrizes, trackRows, type Track } from "./trackData";
import styles from "./tracks.module.css";

export default function Tracks() {
  return (
    <Section
      id="tracks"
      title="Tracks & prizes"
      lead={
        <>
          We&apos;re offering a total of $5,000 cash in prizes: three grand
          prizes, plus a prize for the winner of each track!
        </>
      }
    >
      <Group
        id="grand-prizes"
        title="Grand prizes"
        text="Awarded to the top three projects overall among any track."
      >
        <PrizeBars />
      </Group>

      <Group id="track-list" title="Tracks" text="Pick a track to build for!">
        <TrackGrid />
      </Group>
    </Section>
  );
}

// -------------- groups --------------
interface GroupProps {
  id: string;
  title: string;
  text: string;
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
        <p className={styles.groupText}>
          <Halo>{text}</Halo>
        </p>
      </header>
      {children}
    </section>
  );
}

// -------------- grand prizes --------------
// bar chart: bar length = prize / top prize
function PrizeBars() {
  const topDollars = Math.max(...grandPrizes.map((prize) => prize.dollars));

  return (
    <Reveal>
      <ol className={styles.prizeList}>
        {grandPrizes.map((prize, index) => (
          <li
            key={prize.name}
            className={styles.prize}
            data-place={index + 1}
            style={
              {
                "--index": index,
                "--share": prize.dollars / topDollars,
              } as CSSProperties
            }
          >
            {/* clip-path would cut off the bar's own shadow, so the wrapper has it */}
            <div className={styles.barShadow}>
              <div className={styles.bar}>
                <span className={styles.prizeName}>{prize.name}</span>
              </div>
            </div>
            <Halo>
              <Amount dollars={prize.dollars} className={styles.prizeAmount} />
            </Halo>
          </li>
        ))}
      </ol>
    </Reveal>
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
  // reading-order index, for animation delays and the glyph's seed
  order: number;
  wide: boolean;
}

function TrackCard({ track, order, wide }: TrackCardProps) {
  return (
    <article
      className={`card ${styles.track} ${wide ? styles.wideTrack : ""}`}
      style={{ "--index": order } as CSSProperties}
    >
      <div className={styles.trackArt}>
        <HexGlyph glyph={track.glyph ?? "?"} seed={order} />
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
