import styles from "./tracks.module.css";
import { trackRows, LOCK_ICON } from "./trackData";

export default function Tracks() {
  return (
    <div className={styles.tracksContainer}>
      <header className={styles.tracksHeader}>
        <h2 className={styles.tracksTitle}>Tracks</h2>
        {/* TODO: confirm the public track count before adding a number here */}
        <p className={styles.tracksSubtitle}>
          Compete for $5,000 in prizes across multiple tracks
        </p>
      </header>

      <div className={styles.tracksGrid}>
        {trackRows.map((row, rowIndex) => (
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
                    <h3 className={styles.cardTitleText}>{name}</h3>
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
    </div>
  );
}
