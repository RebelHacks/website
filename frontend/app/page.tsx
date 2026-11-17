import HexGrid from "./components/ui/hexgrid/HexGrid";
import Header from "./components/ui/header/Header";
import Hero from "./components/ui/hero/Hero";
import About from "./components/ui/about/About";
import Schedule from "./components/ui/schedule/Schedule";
import Tracks from "./components/ui/tracks/Tracks";
import Photos from "./components/ui/photos/Photos";
import Sponsors from "./components/ui/sponsors/Sponsors";
import FAQ from "./components/ui/faq/Faq";
import Contact from "./components/ui/contact/Contact";
import Footer from "./components/ui/footer/Footer";
import PastWinners from "./components/ui/pastwinners/PastWinners";

export default function Home() {
  return (
    <>
      <HexGrid />
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Schedule />
        <Tracks />
        <Photos />
        <PastWinners />
        <Sponsors />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
