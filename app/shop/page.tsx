import { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full KALVAN collection — shirts, tees, trousers, jackets and knitwear.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-sm text-charcoal/50">Loading…</div>}>
      <ShopClient />
    </Suspense>
  );
}
