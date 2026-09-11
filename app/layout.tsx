import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Announcement from "@/components/Announcement";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kalvan.example"),
  title: {
    default: "KALVAN — Strength in Comfort",
    template: "%s | KALVAN",
  },
  description:
    "Premium menswear built for the way you move. Shirts, tees, trousers, jackets and knitwear in a minimal, masculine palette.",
  openGraph: {
    title: "KALVAN — Strength in Comfort",
    description:
      "Premium menswear built for the way you move. Shop the KALVAN MVP collection.",
    siteName: "KALVAN",
    type: "website",
  },
  icons: {
    icon: "/logo-mark-charcoal.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-charcoal focus:px-4 focus:py-2 focus:text-ivory"
          >
            Skip to content
          </a>
          <Announcement />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
