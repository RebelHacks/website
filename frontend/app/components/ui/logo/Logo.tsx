import Image from "next/image";

// The white border is part of the image. Without it the dark red R
// disappears on the dark theme and the red footer.
export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/rebelhacks-logo.png"
      alt="RebelHacks"
      width={800}
      height={616}
      // the footer logo is the biggest, at 13rem wide
      sizes="13rem"
      className={className}
    />
  );
}
