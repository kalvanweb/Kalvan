"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Logo from "./Logo";
import { categories } from "@/lib/products";

const navLinks = [
  { href: "/shop", label: "Shop" },
  ...categories.map((c) => ({ href: `/shop?category=${encodeURIComponent(c)}`, label: c })),
  { href: "/support", label: "Support" },
];

export default function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-ivory/95 backdrop-blur">
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <button
          className="flex h-10 w-10 items-center justify-center lg:hidden focus-ring"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-[1.5px] w-6 bg-charcoal transition-transform ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-[1.5px] w-6 bg-charcoal transition-opacity ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-[1.5px] w-6 bg-charcoal transition-transform ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        <Logo />

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-charcoal/80 transition-colors hover:text-charcoal focus-ring"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/account" className="hidden sm:block text-sm text-charcoal/80 hover:text-charcoal focus-ring">
            Account
          </Link>
          <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center focus-ring" aria-label={`Cart, ${itemCount} items`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive px-1 text-[10px] font-medium text-ivory">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="lg:hidden border-t border-charcoal/10 bg-ivory">
          <div className="container-page flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-sm border-b border-charcoal/5 last:border-none"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/account" className="py-3 text-sm" onClick={() => setMenuOpen(false)}>
              Account
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
