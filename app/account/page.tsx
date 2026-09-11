"use client";

import { useState } from "react";

const mockOrders = [
  { id: "KLV20240931", date: "12 Aug 2026", status: "Delivered", total: 4298 },
  { id: "KLV20240817", date: "02 Jul 2026", status: "In Transit", total: 2799 },
];

const tabs = ["Profile", "Orders", "Addresses", "Wishlist"] as const;
type Tab = (typeof tabs)[number];

export default function AccountPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  if (!loggedIn) {
    return (
      <div className="container-page flex justify-center py-16 sm:py-24">
        <div className="w-full max-w-sm">
          <p className="label-eyebrow text-center">Welcome back</p>
          <h1 className="mt-2 text-center font-display text-4xl tracking-wide">
            {mode === "login" ? "Sign In" : "Create Account"}
          </h1>
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setLoggedIn(true);
            }}
          >
            {mode === "signup" && (
              <div>
                <label className="text-xs text-charcoal/60">Full name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="field mt-1"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-charcoal/60">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="field mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-charcoal/60">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="field mt-1"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-charcoal/60">
            {mode === "login" ? "New to KALVAN?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-charcoal underline underline-offset-4"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
          <p className="mt-2 text-center text-xs text-charcoal/40">
            Demo account — no real authentication is wired up yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl tracking-wide sm:text-5xl">My Account</h1>
        <button onClick={() => setLoggedIn(false)} className="btn-ghost">
          Sign out
        </button>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-charcoal/10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-3 text-sm ${
              activeTab === tab
                ? "border-b-2 border-charcoal font-medium text-charcoal"
                : "text-charcoal/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === "Profile" && (
          <div className="max-w-md space-y-4">
            <div>
              <label className="text-xs text-charcoal/60">Full name</label>
              <input defaultValue="Aditya Verma" className="field mt-1" />
            </div>
            <div>
              <label className="text-xs text-charcoal/60">Email</label>
              <input defaultValue="aditya.verma@example.com" className="field mt-1" />
            </div>
            <div>
              <label className="text-xs text-charcoal/60">Phone</label>
              <input defaultValue="98765 43210" className="field mt-1" />
            </div>
            <button className="btn-secondary">Save changes</button>
          </div>
        )}

        {activeTab === "Orders" && (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex flex-col justify-between gap-2 border border-charcoal/10 p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-medium">#{order.id}</p>
                  <p className="text-xs text-charcoal/50">Placed on {order.date}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span
                    className={`text-xs ${
                      order.status === "Delivered" ? "text-olive-dark" : "text-charcoal/70"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-medium">₹{order.total.toLocaleString("en-IN")}</span>
                  <button className="text-xs underline underline-offset-4">Track</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Addresses" && (
          <div className="max-w-md space-y-4">
            <div className="border border-charcoal/10 p-4">
              <p className="text-sm font-medium">Aditya Verma</p>
              <p className="mt-1 text-sm text-charcoal/60">
                221B, Sector 45, Gurugram, Haryana, 122003
              </p>
              <p className="mt-1 text-sm text-charcoal/60">Phone: 98765 43210</p>
              <span className="mt-2 inline-block text-xs text-olive-dark">Default address</span>
            </div>
            <button className="btn-secondary">Add new address</button>
          </div>
        )}

        {activeTab === "Wishlist" && (
          <div className="border border-dashed border-charcoal/20 py-16 text-center">
            <p className="text-sm text-charcoal/60">
              Wishlist is coming in Phase 2. Save products you love once it launches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
