import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.brand}>
            <span>Rebel</span>Hacks
          </p>
          <div className={styles.meta}>
            <p className={styles.copy}>
              © 2026 RebelHacks. All rights reserved.
            </p>
          </div>
        </div>
        <div className={styles.right}>
          <a href="#">Code of Conduct</a>
        </div>
      </div>
    </footer>
  );
}
