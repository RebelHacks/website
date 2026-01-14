import styles from "./about.module.css";

export default function About() {
  return (
    <>
      <div className={styles.aboutWrapper}>
        <div className={styles.intro}>
          <h1>About Rebel Hacks</h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Temporibus
            molestias dolor autem minus, ex accusamus atque libero et beatae
            consectetur, rem, perspiciatis ratione optio ad provident maxime
            dolorem ut eaque. Itaque aspernatur ratione impedit temporibus
            tempore rem, eum explicabo debitis atque ipsam ut mollitia autem
            quam beatae eos quisquam. Veritatis aliquid odio ratione vero
            explicabo fugiat at dolores quia facilis.
          </p>
        </div>
        <div className={styles.tracks}>
          <div className={styles.trackCS}>
            <h1>CS </h1>
          </div>
          <div className={styles.trackCE}>
            <h1>CE</h1>
          </div>
        </div>
      </div>
    </>
  );
}
