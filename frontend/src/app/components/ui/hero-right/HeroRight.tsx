import Image from "next/image";

export default function Heroright() {
  return (
    <div id="heroRight" className="flex justify-center items-center">
      <Image
        src="/images/vegas-sign.svg"
        alt="Las Vegas neon sign"
        width={580}
        height={100}
        className="w-full h-auto max-w-[580px] object-contain"
      />
    </div>
  );
}
