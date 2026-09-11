"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "—";
  const method = searchParams.get("method") === "cod" ? "Cash on Delivery" : "Online Payment";
  const total = searchParams.get("total");

  return (
    <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-olive/10">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B6B4D" strokeWidth="2">
          <path d="M5 12l4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="label-eyebrow mt-6">Order confirmed</p>
      <h1 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">
        Thank you for your order
      </h1>
      <p className="mt-4 max-w-md text-sm text-charcoal/60">
        Your order <span className="font-medium text-charcoal">#{orderId}</span> has been
        placed via {method}. A confirmation has been sent to your phone and email
        with tracking details once it ships.
      </p>
      {total && (
        <p className="mt-2 text-sm text-charcoal/60">
          Order total: <span className="font-medium text-charcoal">₹{Number(total).toLocaleString("en-IN")}</span>
        </p>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/account" className="btn-secondary">
          View my orders
        </Link>
        <Link href="/shop" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
