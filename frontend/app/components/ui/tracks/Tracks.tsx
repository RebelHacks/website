import styles from "./tracks.module.css";
import { prizes, trackRows, LOCK_ICON, type Award } from "./trackData";

// Prizes come in ranked 1st, 2nd, 3rd so screen readers read them in order.
// The CSS rearranges them into a 2nd | 1st | 3rd podium on wider screens.
function Podium({ awards }: { awards: Award[] }) {
  return (
    <div className={`${styles.trackRow} ${styles.podium}`}>
      {awards.map((award, index) => {
        let cardClassName = `${styles.trackCard} ${styles.podiumCard}`;
        if (award.featured) cardClassName += ` ${styles.featuredTrack}`;

        return (
          <article key={index} className={cardClassName}>
            {award.featured && <p className={styles.featuredLabel}>Grand Prize</p>}
            <svg className={styles.cardTitleIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              aria-hidden="true"
              focusable="false"
            >
              <path d={award.icon} />
            </svg>
            <h4 className={styles.cardTitleText}>{award.name}</h4>
            <p className={styles.podiumPrize}>{award.prize}</p>
            <hr className={styles.lineBreak} />
            <p className={styles.cardDesc}>{award.description}</p>
          </article>
        );
      })}
    </div>
  );
}

function CardGrid({ rows }: { rows: Award[][] }) {
  return (
    <div className={styles.tracksGrid}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.trackRow}>
          {row.map((track, index) => {
            const {
              name = "Mystery Track",
              prize,
              description = "Revealed later!",
              icon = LOCK_ICON,
              hidden,
              featured,
            } = track;

            let cardClassName = styles.trackCard;
            if (hidden) cardClassName += ` ${styles.hiddenTrack}`;
            if (featured) cardClassName += ` ${styles.featuredTrack}`;

            return (
              <article key={index} className={cardClassName}>
                {featured && <p className={styles.featuredLabel}>Grand Prize</p>}
                <div className={styles.cardTitle}>
                  <svg className={styles.cardTitleIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={icon} />
                  </svg>
                  <h4 className={styles.cardTitleText}>{name}</h4>
                  <p className={styles.cardPrize}>{prize}</p>
                </div>
                <hr className={styles.lineBreak} />
                <p className={styles.cardDesc}>{description}</p>
              </article>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function Tracks() {
  return (
    <div className={styles.tracksContainer}>
      <header className={styles.tracksHeader}>
        <h2 className={styles.tracksTitle}>Prizes & Tracks</h2>
        {/* TODO: confirm the public track count before adding a number here */}
        <p className={styles.tracksSubtitle}>
          Compete for $5,000 in prizes across multiple tracks!
        </p>

      </header>

      <section
        className={styles.group}
        aria-labelledby="prizes-heading"
      >
        <header className={styles.groupHeader}>
          <h3 id="prizes-heading" className={styles.groupTitle}>Prizes</h3>
          <p className={styles.groupSubtitle}>
            Overall placements awarded to the top projects of the hackathon
          </p>
        </header>
        <Podium awards={prizes} />
      </section>

      <section
        className={styles.group}
        aria-labelledby="tracks-heading"
      >
        <header className={styles.groupHeader}>
          <h3 id="tracks-heading" className={styles.groupTitle}>Tracks</h3>
          <p className={styles.groupSubtitle}>
            Pick a track to build for. Each one awards its own prize!
          </p>
        </header>
        <CardGrid rows={trackRows} />
      </section>
    </div>
  );
}
