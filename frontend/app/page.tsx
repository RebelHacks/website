"use client";

import Image from "next/image";
import Link from "next/link";

import axios from "axios";
import { useState } from "react";

import "./style.css";
// import Header from "./components/ui/Header";
import Faq from "./components/ui/FAQ/faq";

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
    <>
      <main>
        {/*! Background graident is broken on ultrawide resolution */}
        <section id="home" className="hero-section">
          <header>
            <nav>
              <a href="#home">Home</a>
              <a href="#about">About</a>
              {/* <a
            href="#sponsor"
            className="no-underline text-[0.95rem] text-white hover:opacity-80"
          >
            Sponsor Us!
          </a> */}

              <button id="login">
                <Link href="#">Login</Link>
              </button>
              <button
                id="register"
                className="py-2 px-6  bg-[#FEA70A] rounded-xl text-white font-semibold cursor-pointer"
              >
                <Link href="#">Register</Link>
              </button>
            </nav>
            {/* <div
              id="social"
              className="flex gap-4 absolute right-12 top-1/2 -translate-y-1/2"
            >
              <button className="border-0 text-[1.2rem] text-white cursor-pointer bg-transparent">
                <Image
                  src="/images/discord-white-icon.png"
                  alt="Discord"
                  width={36}
                  height={26}
                />
              </button>
            </div> */}
          </header>

          {/* <div className="hero-wrapper"> */}
          {/* Need to refactor text to shrink with screen size */}
          <div className="hero-title">
            <h1 className="title-org">REBEL</h1>
            <h1 className="title-org">HACKS</h1>
            <h1 className="title-school">UNLV 2026</h1>
            {/* <span className="vegas-sign">
              <Image
                className="vegas-sign"
                src="/images/VegasSign.png"
                alt="Las Vegas Neon Sign"
                width={200}
                height={100}
              />
            </span> */}
            <p className="hero-description">
              Come together to design, develop, and present projects that tackle
              real-world problems!
            </p>

            <p className="hero-date">FRI & SAT February 20–21, 2026</p>
          </div>

          <div className="hero-image-wrapper-whole">
            <Image
              src="/images/hero-image.svg"
              alt="Las Vegas neon sign"
              width={580}
              height={100}
              className="hero-image"
            />
          </div>
          {/* </div> */}
        </section>

        <section id="about" className="faq">
          <Faq />
        </section>
      </main>
    </>
  );
}
