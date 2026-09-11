"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { items, subtotal, discount, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [payment, setPayment] = useState<"online" | "cod">("online");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 149;
  const codFee = payment === "cod" ? 49 : 0;
  const total = Math.max(0, subtotal - discount) + shipping + codFee;
  const codEligible = total <= 5000;

  function validate() {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^[0-9]{10}$/.test(form.phone.trim())) next.phone = "Enter a valid 10-digit phone number.";
    if (!form.line1.trim()) next.line1 = "Address is required.";
    if (!form.city.trim()) next.city = "City is required.";
    if (!form.state.trim()) next.state = "State is required.";
    if (!/^[0-9]{6}$/.test(form.pincode.trim())) next.pincode = "Enter a valid 6-digit pincode.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;

    setPlacing(true);
    // Order creation is atomic server-side in production: address validated,
    // inventory reserved, payment verified (or COD flagged) before an order
    // record is created. Simulated here for the storefront demo.
    const orderId = `KLV${Date.now().toString().slice(-8)}`;
    setTimeout(() => {
      clearCart();
      router.push(`/order-confirmation?orderId=${orderId}&method=${payment}&total=${total}`);
    }, 900);
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <h1 className="font-display text-4xl tracking-wide">Your cart is empty</h1>
        <p className="mt-3 text-sm text-charcoal/60">Add something to your cart before checking out.</p>
        <Link href="/shop" className="btn-primary mt-8">
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="font-display text-4xl tracking-wide sm:text-5xl">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-14">
        <div className="space-y-10 lg:col-span-2">
          {/* Address */}
          <section>
            <h2 className="label-eyebrow">Shipping Address</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName}>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="field"
                />
              </Field>
              <Field label="Phone number" error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="field"
                  inputMode="numeric"
                />
              </Field>
              <Field label="Address line 1" error={errors.line1} full>
                <input
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                  className="field"
                />
              </Field>
              <Field label="Address line 2 (optional)" full>
                <input
                  value={form.line2}
                  onChange={(e) => setForm({ ...form, line2: e.target.value })}
                  className="field"
                />
              </Field>
              <Field label="City" error={errors.city}>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="field"
                />
              </Field>
              <Field label="State" error={errors.state}>
                <input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="field"
                />
              </Field>
              <Field label="Pincode" error={errors.pincode}>
                <input
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="field"
                  inputMode="numeric"
                />
              </Field>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="label-eyebrow">Payment Method</h2>
            <div className="mt-4 space-y-3">
              <label className={`flex cursor-pointer items-center justify-between border p-4 ${payment === "online" ? "border-charcoal" : "border-charcoal/20"}`}>
                <span className="flex items-center gap-3 text-sm">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === "online"}
                    onChange={() => setPayment("online")}
                  />
                  Pay online — UPI, cards, net banking
                </span>
                <span className="text-xs text-charcoal/50">Secure gateway</span>
              </label>
              <label
                className={`flex items-center justify-between border p-4 ${
                  codEligible ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                } ${payment === "cod" ? "border-charcoal" : "border-charcoal/20"}`}
              >
                <span className="flex items-center gap-3 text-sm">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === "cod"}
                    disabled={!codEligible}
                    onChange={() => setPayment("cod")}
                  />
                  Cash on Delivery
                </span>
                <span className="text-xs text-charcoal/50">
                  {codEligible ? "+₹49 handling fee" : "Unavailable above ₹5,000"}
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* Summary */}
        <div className="h-fit space-y-6 border border-charcoal/10 p-6">
          <h2 className="label-eyebrow">Order Summary</h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                <span className="text-charcoal/70">
                  {item.name} ({item.color}, {item.size}) × {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-charcoal/10 pt-4 text-sm">
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
            {codFee > 0 && (
              <div className="flex justify-between">
                <dt className="text-charcoal/60">COD handling</dt>
                <dd>₹{codFee}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-charcoal/10 pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd>₹{total.toLocaleString("en-IN")}</dd>
            </div>
          </dl>
          <button type="submit" disabled={placing} className="btn-primary w-full">
            {placing ? "Placing order…" : payment === "cod" ? "Place Order (COD)" : "Pay & Place Order"}
          </button>
          <p className="text-xs text-charcoal/40">
            By placing your order you agree to KALVAN&apos;s Terms of Service and Privacy Policy.
          </p>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  error,
  full,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-xs text-charcoal/60">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-rust">{error}</p>}
    </div>
  );
}
