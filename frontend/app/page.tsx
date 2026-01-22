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
              <a id="home-link" href="#home">
                Home
              </a>
              <a id="about-link" href="#about">
                About
              </a>

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
          </header>

          <div className="hero-title">
            <div className="title-org-wrapper">
              <h1 className="title-org">REBEL HACKS</h1>
              <Image
                className="orange-heart"
                src="/images/org-heart.svg"
                alt="orange heart"
                width={120}
                height={40}
              ></Image>
            </div>
            <div className="title-school-logo-wrapper">
              <h1 className="title-school-text">UNLV 2026</h1>
              <Image
                className="red-diamond"
                src="/images/red-diamond.svg"
                alt="red diamond"
                width={100}
                height={40}
              />

              <Image
                className="vegas-sign"
                src="/images/vegas-sign.png"
                alt="Las Vegas Neon Sign"
                width={400}
                height={120}
              />
            </div>
            <div className="description-date-wrapper">
              <Image
                className="orange-diamond"
                src="/images/org-diamond.svg"
                alt="orange diamond"
                width={100}
                height={40}
              />
              <p className="hero-description">
                Come together to design, develop, and present projects that
                tackle real-world problems!
              </p>

              <p className="hero-date">FRI & SAT February 20–21, 2026</p>
              <Image
                className="blue-ace"
                src="/images/blue-ace.svg"
                alt="blue ace"
                width={100}
                height={40}
              />
            </div>
          </div>

          <div className="hero-image-wrapper-whole">
            <Image
              src="/images/hero-image.svg"
              alt="Las Vegas neon sign"
              width={600}
              height={100}
              className="hero-image"
            />
          </div>
        </section>

        <section id="about" className="faq">
          <Faq />
        </section>
      </main>
    </>
  );
}
