"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, coupon, discount, applyCoupon, removeCoupon } =
    useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 149;
  const total = Math.max(0, subtotal - discount) + shipping;

  function handleApplyCoupon() {
    const result = applyCoupon(couponInput);
    setCouponMessage(result.message);
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <p className="label-eyebrow">Your cart</p>
        <h1 className="mt-2 font-display text-4xl tracking-wide">It&apos;s empty in here</h1>
        <p className="mt-3 max-w-sm text-sm text-charcoal/60">
          Nothing in your cart yet. Explore the collection and find something
          worth wearing on repeat.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="font-display text-4xl tracking-wide sm:text-5xl">Your Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-14">
        <div className="lg:col-span-2">
          <ul className="divide-y divide-charcoal/10">
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 py-6">
                <Link href={`/product/${item.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden bg-stone-light/30">
                  <Image src={item.image} alt={item.name} fill sizes="100px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link href={`/product/${item.slug}`} className="text-sm font-medium hover:underline">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-charcoal/50">
                        {item.color} · Size {item.size}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-charcoal/20">
                      <button
                        className="flex h-8 w-8 items-center justify-center focus-ring"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        className="flex h-8 w-8 items-center justify-center focus-ring"
                        onClick={() =>
                          updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="text-xs text-charcoal/50 underline underline-offset-4 hover:text-charcoal"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary */}
        <div className="h-fit border border-charcoal/10 p-6">
          <h2 className="label-eyebrow">Order Summary</h2>

          <div className="mt-4">
            {coupon ? (
              <div className="flex items-center justify-between border border-olive/40 bg-olive/5 px-3 py-2 text-sm">
                <span>
                  Coupon <span className="font-medium">{coupon}</span> applied
                </span>
                <button onClick={removeCoupon} className="text-xs underline underline-offset-4">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code"
                  className="focus-ring flex-1 border border-charcoal/20 bg-transparent px-3 py-2 text-sm"
                />
                <button onClick={handleApplyCoupon} className="btn-secondary px-4 py-2 text-xs">
                  Apply
                </button>
              </div>
            )}
            {couponMessage && !coupon && (
              <p className="mt-2 text-xs text-rust">{couponMessage}</p>
            )}
            <p className="mt-2 text-xs text-charcoal/40">Try KALVAN10 or WELCOME150</p>
          </div>

          <dl className="mt-6 space-y-3 border-t border-charcoal/10 pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal/60">Subtotal</dt>
              <dd>₹{subtotal.toLocaleString("en-IN")}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-olive-dark">
                <dt>Discount</dt>
                <dd>−₹{discount.toLocaleString("en-IN")}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-charcoal/60">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : `₹${shipping}`}</dd>
            </div>
            <div className="flex justify-between border-t border-charcoal/10 pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd>₹{total.toLocaleString("en-IN")}</dd>
            </div>
          </dl>

          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Proceed to Checkout
          </Link>
          <Link href="/shop" className="btn-ghost mt-3 w-full">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
