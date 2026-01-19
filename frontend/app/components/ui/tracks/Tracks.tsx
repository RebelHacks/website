import styles from "./tracks.module.css";

export default function Tracks() {
  return (
    <section id="tracks" className={styles.tracksSection}>
      <div className={styles.tracksContainer}>
        <header className={styles.tracksHeader}>
          <h2 className={styles.tracksTitle}>Tracks</h2>

          <p className={styles.tracksSubtitle}>
            Choose the track that best matches your experience and project type.
          </p>
        </header>

        <div className={styles.tracksGrid}>
          <div className={styles.trackUpper}>
            <div className={styles.trackCard}>
              <div className={styles.cardTitle}>
                <span className={styles.cardTitleIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M40-120v-80h880v80H40Zm120-120q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v440q0 33-23.5 56.5T800-240H160Zm0-80h640v-440H160v440Zm0 0v-440 440Z" />
                  </svg>
                </span>
                <h2 className={styles.cardTitleText}>Beginner Software</h2>
              </div>
              <hr className={styles.lineBreak} />
              <p className={styles.cardDesc}>
                For teams building a software-only project who have not yet
                completed their milestone course.
              </p>
            </div>
            <div className={styles.trackCard}>
              <div className={styles.cardTitle}>
                <span className={styles.cardTitleIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M150-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v60h60v60h-60v150h60v60h-60v150h60v60h-60v60q0 24-18 42t-42 18H150Zm0-60h600v-600H150v600Zm60-60h253v-200H210v200Zm283-336h197v-144H493v144ZM210-470h253v-250H210v250Zm283 230h197v-306H493v306ZM150-780v600-600Z" />
                  </svg>
                </span>

                <h2 className={styles.cardTitleText}>Beginner Hardware</h2>
              </div>
              <hr className={styles.lineBreak} />
              <p className={styles.cardDesc}>
                For teams new to hardware who want to build a project with
                electronics or physical components, with minimal prior
                experience.
              </p>
            </div>
            <div className={styles.trackCard}>
              <div className={styles.cardTitle}>
                <span className={styles.cardTitleIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M40-120v-80h880v80H40Zm120-120q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v440q0 33-23.5 56.5T800-240H160Zm0-80h640v-440H160v440Zm0 0v-440 440Z" />
                  </svg>
                </span>
                <h2 className={styles.cardTitleText}>Advanced Software</h2>
              </div>
              <hr className={styles.lineBreak} />
              <p className={styles.cardDesc}>
                For experienced teams developing a software-only project with
                more complex systems, features, or technical depth.
              </p>
            </div>
            <div className={styles.trackCard}>
              <div className={styles.cardTitle}>
                <span className={styles.cardTitleIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M150-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v60h60v60h-60v150h60v60h-60v150h60v60h-60v60q0 24-18 42t-42 18H150Zm0-60h600v-600H150v600Zm60-60h253v-200H210v200Zm283-336h197v-144H493v144ZM210-470h253v-250H210v250Zm283 230h197v-306H493v306ZM150-780v600-600Z" />
                  </svg>
                </span>
                <h2 className={styles.cardTitleText}>Advanced Hardware</h2>
              </div>
              <hr className={styles.lineBreak} />
              <p className={styles.cardDesc}>
                For experienced builders creating projects that include
                electronics, hardware integration, or physical builds.
              </p>
            </div>
          </div>

          <div className={styles.trackLower}>
            <div className={styles.trackCard}>
              <div className={styles.cardTitle}>
                <span className={styles.cardTitleIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm200 128q50 0 85-35t35-85v-240H360v240q0 50 35 85t85 35Zm200-128q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" />
                  </svg>
                </span>
                <h2 className={styles.cardTitleText}>Grand Prize</h2>
              </div>
              <hr className={styles.lineBreak} />
              <p className={styles.cardDesc}>
                Awarded to the best project of the entire hackathon, regardless
                of track or category.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
