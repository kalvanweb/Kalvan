import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import OrderConfirmationClient from "./OrderConfirmationClient";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="container-page py-24 text-center text-sm text-charcoal/50">Loading…</div>}>
      <OrderConfirmationClient />
    </Suspense>
  );
}
