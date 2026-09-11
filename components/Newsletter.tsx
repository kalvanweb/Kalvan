"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="bg-olive-dark text-ivory">
      <div className="container-page py-16 text-center">
        <p className="label-eyebrow text-ivory/60">Stay in the loop</p>
        <h2 className="mt-3 font-display text-3xl tracking-wide sm:text-4xl">
          Join the KALVAN list
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ivory/70">
          New arrivals, restocks and early access to seasonal drops. No spam,
          unsubscribe any time.
        </p>
        {submitted ? (
          <p className="mt-6 text-sm text-ivory">You&apos;re on the list. Welcome to KALVAN.</p>
        ) : (
          <form
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setSubmitted(true);
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="focus-ring w-full flex-1 border border-ivory/30 bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-ivory/50"
            />
            <button type="submit" className="bg-ivory px-6 py-3 text-sm text-charcoal transition-colors hover:bg-ivory/90 focus-ring">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
