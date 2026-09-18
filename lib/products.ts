// Types + small client-side data-fetching helpers.
//
// Product data now lives in Supabase (see supabase/schema.sql). These
// helpers call the app/api/products/* route handlers, which is the same
// API the Expo app calls — one source of truth, per the KALVAN blueprint.

export type Variant = {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Shirts" | "T-Shirts" | "Trousers" | "Jackets" | "Knitwear" | string;
  price: number;
  mrp?: number;
  description: string;
  fabric: string;
  care: string[];
  images: string[];
  colors: string[];
  sizes: string[];
  variants: Variant[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
};

// Known categories for filter chips / nav. Kept as a static list rather
// than derived from live data so the filter UI doesn't jump around as
// products are added or removed — update this if you add a new category.
export const categories = ["Shirts", "T-Shirts", "Trousers", "Jackets", "Knitwear"];
export const colorOptions = ["Charcoal", "Warm Ivory", "Olive", "Stone"];
export const sizeOptions = ["S", "M", "L", "XL", "XXL"];

export async function fetchProducts(category?: string): Promise<Product[]> {
  const url = category ? `/api/products?category=${encodeURIComponent(category)}` : "/api/products";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  return data.products as Product[];
}

export async function fetchProductBySlug(
  slug: string
): Promise<{ product: Product; related: Product[] } | null> {
  const res = await fetch(`/api/products/${slug}`);
  if (!res.ok) return null;
  return res.json();
}
