import type { Metadata } from "next";
import Link from "next/link";
import HexGrid from "./components/ui/hexgrid/HexGrid";
import Header from "./components/ui/header/Header";
import Footer from "./components/ui/footer/Footer";
import Halo from "./components/ui/halo/Halo";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found · RebelHacks 2027",
};

export default function NotFound() {
  return (
    <>
      <HexGrid />
      <Header />
      <main id="main" className={styles.page}>
        <p className={styles.code} aria-hidden="true">
          <Halo large>404</Halo>
        </p>
        <h1 className={styles.title}>
          <Halo>This page doesn&apos;t exist.</Halo>
        </h1>
        <p className={styles.text}>
          <Halo>
            It may have moved, or the link might be off by a character or two.
          </Halo>
        </p>
        <Link href="/" className={`button ${styles.home}`}>
          Back to RebelHacks
        </Link>
      </main>
      <Footer />
    </>
  );
}
