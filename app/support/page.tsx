import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description: "FAQs, shipping, returns, privacy and terms for KALVAN.",
};

const faqs = [
  {
    q: "How do I find my size?",
    a: "Each product page has a Size Guide link next to the size selector with body measurements in inches. If you're between sizes, we recommend sizing up for a relaxed fit.",
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes, COD is available on orders up to ₹5,000 with a ₹49 handling fee. Orders above that must be paid online.",
  },
  {
    q: "Can I change or cancel my order after placing it?",
    a: "Orders can be changed or cancelled within 2 hours of placement from My Account → Orders. After that, the order enters processing and can no longer be modified.",
  },
  {
    q: "How do I track my order?",
    a: "Once shipped, tracking details are sent by SMS and email, and are also visible under My Account → Orders → Track.",
  },
];

export default function SupportPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <p className="label-eyebrow">We&apos;re here to help</p>
      <h1 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">Support</h1>

      <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-16">
          <section id="faq">
            <h2 className="font-display text-2xl tracking-wide">Frequently Asked Questions</h2>
            <div className="mt-6 divide-y divide-charcoal/10 border-y border-charcoal/10">
              {faqs.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                    {item.q}
                    <span className="text-charcoal/40 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-charcoal/60">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="shipping">
            <h2 className="font-display text-2xl tracking-wide">Shipping</h2>
            <div className="mt-4 space-y-3 text-sm text-charcoal/70">
              <p>We ship across India. Standard delivery takes 3–6 business days depending on your pincode&apos;s serviceability.</p>
              <p>Free shipping on all prepaid and COD orders over ₹2,999. Orders below that carry a flat ₹149 shipping fee.</p>
              <p>Serviceability and estimated delivery date are checked automatically at checkout based on your pincode.</p>
            </div>
          </section>

          <section id="returns">
            <h2 className="font-display text-2xl tracking-wide">Returns &amp; Exchanges</h2>
            <div className="mt-4 space-y-3 text-sm text-charcoal/70">
              <p>Unworn items with tags attached can be returned or exchanged within 7 days of delivery.</p>
              <p>Start a return from My Account → Orders → Request Return. Pickup is arranged from your delivery address.</p>
              <p>Refunds are processed to the original payment method within 5–7 business days of the returned item passing quality check. COD orders are refunded via bank transfer.</p>
            </div>
          </section>

          <section id="privacy">
            <h2 className="font-display text-2xl tracking-wide">Privacy Policy</h2>
            <div className="mt-4 space-y-3 text-sm text-charcoal/70">
              <p>KALVAN collects only the information needed to process your orders: name, contact details, shipping address and payment confirmation status. We never store full card details on our servers — payments are handled by our PCI-compliant payment partner.</p>
              <p>Your data is not sold to third parties. It is used for order fulfilment, customer support and, if you opt in, marketing communications you can unsubscribe from at any time.</p>
            </div>
          </section>

          <section id="terms">
            <h2 className="font-display text-2xl tracking-wide">Terms of Service</h2>
            <div className="mt-4 space-y-3 text-sm text-charcoal/70">
              <p>By placing an order on KALVAN, you confirm that the shipping details provided are accurate and that you are authorized to use the selected payment method.</p>
              <p>Product images are for illustration; minor variations in colour may occur due to display settings. Prices are inclusive of applicable taxes unless stated otherwise.</p>
              <p>KALVAN reserves the right to cancel orders in cases of pricing errors, suspected fraud, or inventory unavailability, with a full refund issued for any amount already paid.</p>
            </div>
          </section>
        </div>

        <aside id="contact" className="h-fit space-y-6 border border-charcoal/10 p-6">
          <div>
            <h2 className="label-eyebrow">Contact Us</h2>
            <p className="mt-3 text-sm text-charcoal/70">
              Our team responds within 24 hours on business days.
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-charcoal/50">Email</p>
            <p>support@kalvan.example</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-charcoal/50">Phone</p>
            <p>+91 98765 43210</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-charcoal/50">Hours</p>
            <p>Mon–Sat, 10am–7pm IST</p>
          </div>
          <form className="space-y-3 border-t border-charcoal/10 pt-6">
            <input placeholder="Your name" className="field" />
            <input placeholder="Your email" type="email" className="field" />
            <textarea placeholder="How can we help?" rows={4} className="field" />
            <button type="button" className="btn-primary w-full">
              Send message
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
