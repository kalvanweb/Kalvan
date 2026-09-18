import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import StarRating from "@/components/StarRating";
import { supabase } from "@/lib/supabase";
import { mapProduct, DbProduct } from "@/lib/mappers";
import { categories } from "@/lib/products";

export const revalidate = 60;

const categoryImages: Record<string, string> = {
  Shirts: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800&q=80",
  "T-Shirts": "https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&q=80",
  Trousers: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
  Jackets: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
  Knitwear: "https://images.unsplash.com/photo-1610384104075-e05c8b7a1548?w=800&q=80",
};

const whyKalvan = [
  {
    title: "Built to move",
    body: "Every cut is tested through a real day — desk to commute to dinner — not just a fitting room.",
  },
  {
    title: "Fabric first",
    body: "We choose the cloth before the design. Weight, hand-feel and durability are non-negotiable.",
  },
  {
    title: "No noise",
    body: "A tight, considered range instead of a hundred forgettable options. Buy less, wear it more.",
  },
];

const reviews = [
  {
    name: "Arjun M.",
    rating: 5,
    text: "The Oxford shirt fits exactly how the size guide said it would. First online menswear order that actually worked first try.",
  },
  {
    name: "Rohit S.",
    rating: 5,
    text: "Heavyweight tee is genuinely heavyweight. Doesn't go see-through, doesn't sag after a wash.",
  },
  {
    name: "Karan D.",
    rating: 4,
    text: "Overshirt is excellent for Delhi winters. Sizing runs slightly generous, sized down and it's perfect.",
  },
];

export default async function HomePage() {
  const { data } = await supabase.from("products").select("*, product_variants(*)");
  const allProducts = ((data ?? []) as DbProduct[]).map(mapProduct);
  const newArrivals = allProducts.filter((p) => p.isNewArrival).slice(0, 4);
  const bestSellers = allProducts.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal text-ivory">
        <div className="container-page grid min-h-[560px] grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:py-0">
          <div className="relative z-10 order-2 lg:order-1">
            <p className="label-eyebrow text-stone-light">New Season</p>
            <h1 className="mt-4 font-display text-6xl leading-[0.95] tracking-wide sm:text-7xl lg:text-8xl">
              STRENGTH
              <br />
              IN COMFORT.
            </h1>
            <p className="mt-6 max-w-md text-ivory/70">
              Premium menswear cut for how you actually move — structured
              enough to look considered, soft enough to forget you&apos;re
              wearing it.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary bg-ivory text-charcoal hover:bg-ivory/90">
                Shop the collection
              </Link>
              <Link
                href="/shop?category=Jackets"
                className="inline-flex items-center justify-center gap-2 border border-ivory/40 px-7 py-3.5 text-sm tracking-wide text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
              >
                New arrivals
              </Link>
            </div>
          </div>
          <div className="relative order-1 -mx-5 aspect-[4/3] sm:mx-0 lg:order-2 lg:aspect-auto lg:h-[560px]">
            <Image
              src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=1400&q=80"
              alt="Model wearing a KALVAN field overshirt"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="container-page py-16 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-eyebrow">Shop by category</p>
            <h2 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">
              Find your fit
            </h2>
          </div>
          <Link href="/shop" className="btn-ghost hidden sm:inline-flex">
            View all
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${encodeURIComponent(cat)}`}
              className="group relative block aspect-[3/4] overflow-hidden focus-ring"
            >
              <Image
                src={categoryImages[cat]}
                alt={cat}
                fill
                sizes="(min-width: 1024px) 20vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 text-sm tracking-wide text-ivory">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-ivory-dark/60 py-16 sm:py-20">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <div>
              <p className="label-eyebrow">Just landed</p>
              <h2 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">
                New Arrivals
              </h2>
            </div>
            <Link href="/shop" className="btn-ghost hidden sm:inline-flex">
              View all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container-page py-16 sm:py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="label-eyebrow">Customer favorites</p>
            <h2 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">
              Best Sellers
            </h2>
          </div>
          <Link href="/shop" className="btn-ghost hidden sm:inline-flex">
            View all
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Why KALVAN */}
      <section className="bg-charcoal py-16 text-ivory sm:py-20">
        <div className="container-page">
          <p className="label-eyebrow text-stone-light">Why KALVAN</p>
          <h2 className="mt-2 max-w-lg font-display text-3xl tracking-wide sm:text-4xl">
            Clothes that hold up to the day you actually have
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {whyKalvan.map((item, i) => (
              <div key={item.title}>
                <span className="text-sm text-stone-light">{`0${i + 1}`}</span>
                <h3 className="mt-3 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-ivory/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial / Brand story */}
      <section className="container-page grid grid-cols-1 items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80"
            alt="Detail of KALVAN chino trouser fabric"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="label-eyebrow">Our approach</p>
          <h2 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">
            A wardrobe, not a wishlist
          </h2>
          <p className="mt-5 max-w-md text-charcoal/70">
            KALVAN started with a simple complaint: most menswear either looks
            sharp or feels comfortable, rarely both. We work backward from
            fabric and fit, then keep the range tight enough that every piece
            earns its place in your wardrobe.
          </p>
          <p className="mt-4 max-w-md text-charcoal/70">
            No trend cycles, no filler collections — just fewer, better
            pieces built to be worn on repeat.
          </p>
          <Link href="/shop" className="btn-secondary mt-8 inline-flex">
            Explore the range
          </Link>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-ivory-dark/60 py-16 sm:py-20">
        <div className="container-page">
          <p className="label-eyebrow">What customers say</p>
          <h2 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">
            Worn and reviewed
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.name} className="bg-ivory p-6">
                <StarRating rating={r.rating} />
                <p className="mt-4 text-sm text-charcoal/80">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-4 text-xs text-charcoal/50">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
