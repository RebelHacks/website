'use client'

import Image from "next/image";
import axios from "axios";
import {useState} from "react";
import Link from "next/link";

export default function Home() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post('/sample', {
        key: 'value'
      });
      setData(response.data);
      console.log("Data: ", data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(1000px_circle_at_center,#121639_0%,#000000_100%,#1C1F45_100%)] bg-fixed bg-no-repeat bg-center">
      <header className="w-full flex justify-center items-center py-8 px-12 relative z-10">
        <nav className="flex justify-center items-center gap-8 bg-[#121639] py-3 px-8 rounded-[30px]">
          <a
            href="#home"
            className="no-underline text-[0.95rem] text-white hover:opacity-80 text-[0.95re"
          >
            Home
          </a>
          <a
            href="#about"
            className="no-underline text-[0.95rem] text-white hover:opacity-80"
          >
            About
          </a>
          <a
            href="#sponsor"
            className="no-underline text-[0.95rem] text-white hover:opacity-80"
          >
            Sponsor Us!
          </a>
          <button className="border-0 text-[1.2rem] text-white cursor-pointer bg-transparent">
            <Image
              src="/images/discord-white-icon.png"
              alt="Discord"
              width={36}
              height={26}
            />
          </button>
        </nav>
        <div
          id="loginRegister"
          className="flex gap-4 absolute right-12 top-1/2 -translate-y-1/2"
        >
          <button
            id="loginButton"
            className="py-2 px-6 border-2 border-[#00c8ff] rounded-xl bg-transparent text-white font-semibold cursor-pointer"
          >
            <Link href="#">Login</Link>
          </button>
          <button
            id="register"
            className="py-2 px-6 border-2 border-[#FEA70A] rounded-xl bg-transparent text-white font-semibold cursor-pointer"
          >
            <Link href="#">Register</Link>
          </button>
        </div>
      </header>

      <section className="mt-12 grid items-center gap-16 grid-cols-[1fr_1.2fr]">
        <div id="heroLeft" className="flex flex-col gap-5 max-w-[420px] pl-10">
          <div id="rebelHacksTitle" className="flex flex-col gap-1">
            <h1 className="font-bold text-[72px] text-[#DF4C21] [-webkit-text-stroke:2px_#FEA70A] m-0">
              REBEL
            </h1>
            <h1 className="font-bold text-[72px] text-[#DF4C21] [-webkit-text-stroke:2px_#FEA70A] m-0 -mt-8">
              HACKS
            </h1>
            <h2 className="font-bold text-[72px] text-[#007083] [-webkit-text-stroke:2px_#B0F2FE] m-0 -mt-4">
              UNLV 2026
            </h2>
          </div>
          <p className="font-semibold text-[#e99806]">
            Come together to design, develop, and present projects that tackle
            real-world problems!{" "}
          </p>
          <p className="text-[20px] text-[#00D0F3] font-normal">
            FRI & SAT February 20–21, 2026
          </p>
        </div>

        <div id="heroRight" className="flex justify-center items-center">
          <Image
            src="/images/vegas-sign.png"
            alt="Las Vegas neon sign"
            width={580}
            height={100}
            className="w-full h-auto max-w-[580px] object-contain"
          />
        </div>
      </section>
    </main>
  );

}
