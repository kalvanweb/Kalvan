import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import StarRating from "./StarRating";

export default function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block focus-ring">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-light/40">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="bg-ivory px-2 py-1 text-[10px] tracking-wide text-charcoal">
              NEW
            </span>
          )}
          {hasDiscount && (
            <span className="bg-olive px-2 py-1 text-[10px] tracking-wide text-ivory">
              {discountPct}% OFF
            </span>
          )}
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm text-charcoal">{product.name}</h3>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} size={12} />
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-charcoal">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <span className="text-xs text-charcoal/40 line-through">
              ₹{product.mrp!.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
