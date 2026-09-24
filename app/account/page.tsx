"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type Order = {
  id: string;
  order_number: string;
  total: number;
  order_status: string;
  created_at: string;
};

const tabs = ["Profile", "Orders", "Wishlist"] as const;
type Tab = (typeof tabs)[number];

export default function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTab !== "Orders" || !session) return;
    setOrdersLoading(true);
    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders ?? []))
      .finally(() => setOrdersLoading(false));
  }, [activeTab, session]);

  async function handleGoogleSignIn() {
    setAuthError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/account` },
    });
  }

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.name } },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setAuthError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingSession) {
    return <div className="container-page py-24 text-center text-sm text-charcoal/50">Loading…</div>;
  }

  if (!session) {
    return (
      <div className="container-page flex justify-center py-16 sm:py-24">
        <div className="w-full max-w-sm">
          <p className="label-eyebrow text-center">Welcome back</p>
          <h1 className="mt-2 text-center font-display text-4xl tracking-wide">
            {mode === "login" ? "Sign In" : "Create Account"}
          </h1>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-8 flex w-full items-center justify-center border border-charcoal/25 py-3 text-sm font-medium text-charcoal hover:bg-charcoal/5"
          >
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-charcoal/10" />
            <span className="text-xs uppercase text-charcoal/40">or use email</span>
            <div className="h-px flex-1 bg-charcoal/10" />
          </div>

          <form className="space-y-4" onSubmit={handleAuthSubmit}>
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
            {authError && <p className="text-sm text-rust">{authError}</p>}
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-charcoal/60">
            {mode === "login" ? "New to KALVAN?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setAuthError(null);
              }}
              className="text-charcoal underline underline-offset-4"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
          {mode === "signup" && (
            <p className="mt-2 text-center text-xs text-charcoal/40">
              Depending on your Supabase project settings, you may need to confirm your email before signing in.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl tracking-wide sm:text-5xl">My Account</h1>
        <button onClick={() => supabase.auth.signOut()} className="btn-ghost">
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
              <label className="text-xs text-charcoal/60">Email</label>
              <input defaultValue={session.user.email} disabled className="field mt-1 opacity-60" />
            </div>
            <p className="text-xs text-charcoal/50">
              Signed in as this account across both the website and the KALVAN app.
            </p>
          </div>
        )}

        {activeTab === "Orders" && (
          <div className="space-y-4">
            {ordersLoading ? (
              <p className="text-sm text-charcoal/50">Loading orders…</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-charcoal/50">You haven&apos;t placed any orders yet.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col justify-between gap-2 border border-charcoal/10 p-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-medium">#{order.order_number}</p>
                    <p className="text-xs text-charcoal/50">
                      Placed on {new Date(order.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs capitalize text-charcoal/70">{order.order_status}</span>
                    <span className="text-sm font-medium">₹{order.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))
            )}
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
