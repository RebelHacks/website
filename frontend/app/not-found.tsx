import type { Metadata } from "next";
import Link from "next/link";
import HexGrid from "./components/ui/hexgrid/HexGrid";
import Header from "./components/ui/header/Header";
import Footer from "./components/ui/footer/Footer";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found · RebelHacks 2027",
};

// Shown for any URL that doesn't exist.
export default function NotFound() {
  return (
    <>
      <HexGrid />
      <Header alwaysShowBrand />
      <main id="main" className={styles.page}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 className={styles.title}>This page doesn&apos;t exist.</h1>
        <p className={styles.text}>
          It may have moved, or the link might be off by a character or two.
        </p>
        <Link href="/" className={`button ${styles.home}`}>
          Back to RebelHacks
        </Link>
      </main>
      <Footer />
    </>
  );
}
