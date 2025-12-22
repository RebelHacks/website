"use client";

import axios from "axios";
import { useState } from "react";
import Header from "./components/ui/header/Header";
import Faq from "./components/ui/faq-card/Faq";
import Heroleft from "./components/ui/hero-left/Heroleft";
import Heroright from "./components/ui/hero-right/Heroright";

export default function Home() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post("/sample", {
        key: "value",
      });
      setData(response.data);
      console.log("Data: ", data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(1000px_circle_at_center,#121639_0%,#000000_100%,#1C1F45_100%)] bg-fixed bg-no-repeat bg-center">
      <Header />
      <section
        id="landing-page"
        className="min-h-screen bg-[radial-gradient(1000px_circle_at_center,#121639_0%,#000000_100%,#1C1F45_100%)] bg-fixed bg-no-repeat bg-center grid items-center gap-16 grid-cols-[1fr_1.2fr]"
      >
        <Heroleft />
        <Heroright />
      </section>
      <section
        id="faq"
        className="flex min-h-screen items-start justify-center bg-background p-4"
      >
        <Faq />
      </section>
    </main>
  );
}
