// Converts a Supabase row (snake_case, flat variants array) into the
// camelCase shape the frontend components already expect — this is the
// only place that needs to know the DB's column names.

export type DbVariant = {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
};

export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  mrp: number | null;
  description: string;
  fabric: string;
  care: string[];
  images: string[];
  rating: number;
  review_count: number;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  product_variants: DbVariant[];
};

export function mapProduct(row: DbProduct) {
  const colors = Array.from(new Set(row.product_variants.map((v) => v.color)));
  const sizes = Array.from(new Set(row.product_variants.map((v) => v.size)));
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    mrp: row.mrp ?? undefined,
    description: row.description,
    fabric: row.fabric,
    care: row.care,
    images: row.images,
    colors,
    sizes,
    variants: row.product_variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      sku: v.sku,
      stock: v.stock,
    })),
    isNewArrival: row.is_new_arrival,
    isBestSeller: row.is_best_seller,
    rating: row.rating,
    reviewCount: row.review_count,
  };
}

export type MappedProduct = ReturnType<typeof mapProduct>;
