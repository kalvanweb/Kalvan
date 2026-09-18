"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, fetchProductBySlug } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";

export default function ProductDetailClient({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProductBySlug(slug).then((data) => {
      if (cancelled) return;
      if (!data) {
        setNotFound(true);
      } else {
        setProduct(data.product);
        setRelated(data.related);
        setSelectedColor(data.product.colors[0]);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const activeVariant = useMemo(
    () =>
      product?.variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      ),
    [product, selectedColor, selectedSize]
  );

  const hasDiscount = product?.mrp && product.mrp > product.price;

  function handleAddToCart(goToCheckout = false) {
    if (!product) return;
    if (!selectedSize) {
      setError("Please select a size.");
      return;
    }
    if (!activeVariant) {
      setError("That combination isn't available.");
      return;
    }
    if (activeVariant.stock <= 0) {
      setError("This size is currently out of stock.");
      return;
    }
    setError(null);
    addItem(product, selectedSize, selectedColor, activeVariant.id);
    if (goToCheckout) {
      router.push("/cart");
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-[4/5] animate-pulse bg-stone-light/30" />
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse bg-stone-light/40" />
            <div className="h-10 w-2/3 animate-pulse bg-stone-light/40" />
            <div className="h-4 w-full animate-pulse bg-stone-light/30" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <h1 className="font-display text-4xl tracking-wide">Product not found</h1>
        <p className="mt-3 text-sm text-charcoal/60">
          This product may have been removed or the link is incorrect.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <nav className="mb-6 text-xs text-charcoal/50">
        <Link href="/shop" className="hover:text-charcoal">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-charcoal">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden bg-stone-light/30">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-16 overflow-hidden focus-ring ${
                    activeImage === i ? "ring-2 ring-charcoal" : "opacity-70"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="label-eyebrow">{product.category}</p>
          <h1 className="mt-2 font-display text-4xl tracking-wide sm:text-5xl">
            {product.name}
          </h1>
          <div className="mt-3">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl font-medium">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-base text-charcoal/40 line-through">
                ₹{product.mrp!.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-xs text-charcoal/50">Inclusive of all taxes</span>
          </div>

          <p className="mt-6 max-w-md text-sm text-charcoal/70">{product.description}</p>

          {/* Color */}
          <div className="mt-8">
            <h3 className="label-eyebrow">Color: {selectedColor}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedSize(null);
                    setError(null);
                  }}
                  className={`border px-4 py-2 text-xs ${
                    selectedColor === color
                      ? "border-charcoal bg-charcoal text-ivory"
                      : "border-charcoal/20 text-charcoal/70 hover:border-charcoal/50"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="label-eyebrow">Size</h3>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-charcoal/60 underline underline-offset-4 hover:text-charcoal"
              >
                Size guide
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const variant = product.variants.find(
                  (v) => v.color === selectedColor && v.size === size
                );
                const outOfStock = variant?.stock === 0;
                return (
                  <button
                    key={size}
                    disabled={outOfStock}
                    onClick={() => {
                      setSelectedSize(size);
                      setError(null);
                    }}
                    className={`h-11 w-11 border text-xs transition-colors ${
                      selectedSize === size
                        ? "border-charcoal bg-charcoal text-ivory"
                        : outOfStock
                        ? "cursor-not-allowed border-charcoal/10 text-charcoal/30 line-through"
                        : "border-charcoal/20 text-charcoal/70 hover:border-charcoal/50"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {activeVariant && (
              <p className="mt-2 text-xs text-charcoal/50">
                {activeVariant.stock > 0
                  ? activeVariant.stock <= 5
                    ? `Only ${activeVariant.stock} left in stock`
                    : "In stock"
                  : "Out of stock"}
              </p>
            )}
          </div>

          {error && <p className="mt-4 text-sm text-rust">{error}</p>}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => handleAddToCart(false)} className="btn-secondary flex-1">
              {added ? "Added to cart ✓" : "Add to Cart"}
            </button>
            <button onClick={() => handleAddToCart(true)} className="btn-primary flex-1">
              Buy Now
            </button>
          </div>

          <div className="mt-8 space-y-3 border-t border-charcoal/10 pt-6">
            <p className="text-sm text-charcoal/70">
              <span className="font-medium text-charcoal">Fabric:</span> {product.fabric}
            </p>
            <div className="text-sm text-charcoal/70">
              <span className="font-medium text-charcoal">Care:</span>{" "}
              {product.care.join(" · ")}
            </div>
            <p className="text-sm text-charcoal/70">
              <span className="font-medium text-charcoal">Delivery:</span> Estimated 3–6
              business days. Free shipping over ₹2,999. Cash on delivery available.
            </p>
          </div>
        </div>
      </div>

      {showSizeGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/50 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Size guide"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto bg-ivory p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl tracking-wide">Size Guide</h2>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="focus-ring text-charcoal/60 hover:text-charcoal"
                aria-label="Close size guide"
              >
                ✕
              </button>
            </div>
            <table className="mt-6 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-charcoal/10 text-charcoal/50">
                  <th className="py-2 font-normal">Size</th>
                  <th className="py-2 font-normal">Chest (in)</th>
                  <th className="py-2 font-normal">Waist (in)</th>
                  <th className="py-2 font-normal">Length (in)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["S", "38", "32", "27"],
                  ["M", "40", "34", "28"],
                  ["L", "42", "36", "29"],
                  ["XL", "44", "38", "30"],
                  ["XXL", "46", "40", "31"],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-charcoal/5">
                    {row.map((cell, i) => (
                      <td key={i} className="py-2.5">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-charcoal/50">
              Measurements are body measurements in inches. If between sizes, we
              recommend sizing up for a relaxed fit.
            </p>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl tracking-wide">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
