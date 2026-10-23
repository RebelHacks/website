import type { CSSProperties } from "react";
import HexGlyph from "./HexGlyph";
import SectionHeading from "../section/SectionHeading";
import Reveal from "../reveal/Reveal";
import { prizes, trackRows, type Award } from "./trackData";
import styles from "./tracks.module.css";

// "$1,500" -> a small raised "$" and "1500". The comma is dropped because the
// mono font gives it a full character's width, which leaves a gap.
function Amount({ value, className }: { value: string; className: string }) {
  return (
    <span className={className}>
      <span className={styles.currency}>{value.slice(0, 1)}</span>
      {value.slice(1).replace(",", "")}
    </span>
  );
}

// "$1,500" -> 1500
function amountOf(prize: string) {
  return Number(prize.replace(/[^0-9]/g, ""));
}

// The grand prizes as a bar chart: each bar's length is its share of the
// top prize, so the ranking reads at a glance. The bars are long hexagons,
// pointed at both ends like the honeycomb.
function PrizeList() {
  const topAmount = amountOf(prizes[0].prize);

  return (
    <Reveal>
      <ol className={styles.prizeList}>
        {prizes.map((award, index) => {
          const share = amountOf(award.prize) / topAmount;
          return (
            <li
              key={award.name}
              className={styles.prize}
              data-place={index + 1}
              style={{ "--i": index, "--share": share } as CSSProperties}
            >
              <div className={styles.bar}>
                <span className={styles.prizeName}>{award.name}</span>
              </div>
              <Amount value={award.prize} className={styles.prizeAmount} />
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}

function TrackCard({
  track,
  index,
  wide,
}: {
  track: Award;
  index: number;
  wide: boolean;
}) {
  const {
    name = "???",
    prize,
    description = "Revealed on event day.",
    glyph = "?",
    hidden,
  } = track;

  let className = `card ${styles.track}`;
  if (wide) className += ` ${styles.wideTrack}`;

  return (
    <article className={className} style={{ "--i": index } as CSSProperties}>
      <div className={styles.trackArt}>
        <HexGlyph glyph={glyph} seed={index} />
      </div>
      <div className={styles.trackBody}>
        <h4 className={styles.trackName}>
          {hidden ? (
            <>
              {/* screen readers would read "???" as three question marks */}
              <span aria-hidden="true">{name}</span>
              <span className="sr-only">Mystery track</span>
            </>
          ) : (
            name
          )}
        </h4>
        <p className={styles.trackDescription}>{description}</p>
        <Amount value={prize} className={styles.trackAmount} />
      </div>
    </article>
  );
}

export default function Tracks() {
  return (
    <div className={styles.container}>
      <SectionHeading id="tracks-heading" title="Tracks & prizes">
        We're offering a total of $5,000 cash in prizes: three grand prizes, plus a prize for the winner of each track!
      </SectionHeading>
      <section className={styles.group} aria-labelledby="prizes-heading">
        <header className={styles.groupHeader}>
          <h3 id="prizes-heading" className={styles.groupTitle}>
            Grand prizes
          </h3>
          <p className={styles.groupText}>
            Awarded to the top three projects overall among any track.
          </p>
        </header>
        <PrizeList />
      </section>

      <section className={styles.group} aria-labelledby="track-list-heading">
        <header className={styles.groupHeader}>
          <h3 id="track-list-heading" className={styles.groupTitle}>
            Tracks
          </h3>
          <p className={styles.groupText}>
            Pick a track to build for!
          </p>
        </header>
        <Reveal className={styles.trackGrid}>
          {trackRows.map((row, rowIndex) => {
            // cards are numbered across rows so they rise in reading order
            const cardsBefore = trackRows.slice(0, rowIndex).flat().length;
            return (
              <div key={rowIndex} className={styles.trackRow}>
                {row.map((track, index) => (
                  <TrackCard
                    key={index}
                    track={track}
                    index={cardsBefore + index}
                    wide={row.length === 1}
                  />
                ))}
              </div>
            );
          })}
        </Reveal>
      </section>
    </div>
  );
}
