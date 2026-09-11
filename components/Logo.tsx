import Image from "next/image";
import Link from "next/link";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 focus-ring" aria-label="KALVAN home">
      <Image
        src={dark ? "/logo-mark.png" : "/logo-mark-charcoal.png"}
        alt=""
        width={26}
        height={26}
        priority
      />
      <span className="font-display text-2xl tracking-widest2 leading-none pt-1">
        KALVAN
      </span>
    </Link>
  );
}
