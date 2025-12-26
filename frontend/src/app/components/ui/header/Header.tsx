import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full flex justify-center items-center py-8 px-12 fixed z-10">
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
  );
}
