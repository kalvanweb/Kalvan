import Link from "next/link";
import Image from "next/image";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Products" },
      { href: "/shop?category=Shirts", label: "Shirts" },
      { href: "/shop?category=T-Shirts", label: "T-Shirts" },
      { href: "/shop?category=Trousers", label: "Trousers" },
      { href: "/shop?category=Jackets", label: "Jackets" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/support#faq", label: "FAQ" },
      { href: "/support#shipping", label: "Shipping" },
      { href: "/support#returns", label: "Returns & Exchanges" },
      { href: "/support#contact", label: "Contact Us" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/support#privacy", label: "Privacy Policy" },
      { href: "/support#terms", label: "Terms of Service" },
      { href: "/account", label: "My Account" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/90">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <Image src="/logo-mark.png" alt="" width={26} height={26} />
              <span className="font-display text-2xl tracking-widest2 pt-1">KALVAN</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-ivory/60">
              Strength in comfort. Premium menswear built for the way you actually
              move through your day.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="label-eyebrow text-stone-light">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ivory/70 transition-colors hover:text-ivory focus-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-ivory/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-ivory/50">
            &copy; {new Date().getFullYear()} KALVAN. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Instagram", "Twitter", "Pinterest"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs text-ivory/50 hover:text-ivory/80 focus-ring"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
