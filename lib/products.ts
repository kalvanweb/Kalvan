export type Variant = {
  size: string;
  color: string;
  sku: string;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Shirts" | "T-Shirts" | "Trousers" | "Jackets" | "Knitwear";
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

const colorOptions = ["Charcoal", "Warm Ivory", "Olive", "Stone"];
const sizeOptions = ["S", "M", "L", "XL", "XXL"];

function buildVariants(sizes: string[], colors: string[], baseStock = 12): Variant[] {
  const variants: Variant[] = [];
  colors.forEach((color) => {
    sizes.forEach((size, i) => {
      variants.push({
        size,
        color,
        sku: `${color.slice(0, 2).toUpperCase()}-${size}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        stock: Math.max(0, baseStock - i * 2),
      });
    });
  });
  return variants;
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "oxford-tailored-shirt",
    name: "Oxford Tailored Shirt",
    category: "Shirts",
    price: 2799,
    mrp: 3499,
    description:
      "A tailored Oxford shirt cut from brushed cotton with a structured collar and a clean front placket. Built for a silhouette that holds its shape through a full day, from the desk to dinner.",
    fabric: "100% brushed cotton, mid-weight Oxford weave",
    care: ["Machine wash cold", "Do not bleach", "Iron on medium heat", "Line dry"],
    images: [
      "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=1200&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&q=80",
    ],
    colors: ["Charcoal", "Warm Ivory"],
    sizes: sizeOptions,
    variants: buildVariants(sizeOptions, ["Charcoal", "Warm Ivory"]),
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 128,
  },
  {
    id: "p2",
    slug: "heavyweight-crew-tee",
    name: "Heavyweight Crew Tee",
    category: "T-Shirts",
    price: 1299,
    mrp: 1599,
    description:
      "A 240gsm heavyweight tee with a substantial drape and a reinforced crew neck that resists stretching out. The everyday layer built to outlast the season.",
    fabric: "100% combed cotton, 240gsm",
    care: ["Machine wash cold, inside out", "Do not bleach", "Tumble dry low"],
    images: [
      "https://images.unsplash.com/photo-1622445275576-721325763afe?w=1200&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80",
    ],
    colors: ["Charcoal", "Olive", "Stone"],
    sizes: sizeOptions,
    variants: buildVariants(sizeOptions, ["Charcoal", "Olive", "Stone"]),
    isNewArrival: true,
    rating: 4.5,
    reviewCount: 94,
  },
  {
    id: "p3",
    slug: "tapered-chino-trouser",
    name: "Tapered Chino Trouser",
    category: "Trousers",
    price: 2999,
    description:
      "A tapered chino with a mid-rise waist and a two-way stretch weave that moves with you without losing its tailored line.",
    fabric: "98% cotton, 2% elastane twill",
    care: ["Machine wash cold", "Do not bleach", "Iron on low heat"],
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80",
    ],
    colors: ["Charcoal", "Stone"],
    sizes: sizeOptions,
    variants: buildVariants(sizeOptions, ["Charcoal", "Stone"]),
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 76,
  },
  {
    id: "p4",
    slug: "field-overshirt-jacket",
    name: "Field Overshirt Jacket",
    category: "Jackets",
    price: 4599,
    mrp: 5299,
    description:
      "A canvas overshirt built like a jacket: bellows pockets, a corozo-button placket and a brushed interior for the months in between seasons.",
    fabric: "Cotton canvas shell, brushed cotton lining",
    care: ["Dry clean recommended", "Spot clean when possible"],
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1200&q=80",
    ],
    colors: ["Olive", "Charcoal"],
    sizes: sizeOptions,
    variants: buildVariants(sizeOptions, ["Olive", "Charcoal"]),
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 61,
  },
  {
    id: "p5",
    slug: "merino-crew-knit",
    name: "Merino Crew Knit",
    category: "Knitwear",
    price: 3499,
    description:
      "A fine-gauge merino crewneck that regulates temperature without the bulk. Sits close without clinging, and layers clean under an overshirt.",
    fabric: "100% extra-fine merino wool",
    care: ["Hand wash cold", "Dry flat", "Do not tumble dry"],
    images: [
      "https://images.unsplash.com/photo-1610384104075-e05c8b7a1548?w=1200&q=80",
      "https://images.unsplash.com/photo-1608228088998-57828365d486?w=1200&q=80",
    ],
    colors: ["Stone", "Charcoal", "Olive"],
    sizes: sizeOptions,
    variants: buildVariants(sizeOptions, ["Stone", "Charcoal", "Olive"]),
    isNewArrival: true,
    rating: 4.4,
    reviewCount: 42,
  },
  {
    id: "p6",
    slug: "everyday-pocket-tee",
    name: "Everyday Pocket Tee",
    category: "T-Shirts",
    price: 999,
    description:
      "A lighter-weight tee for warmer days, with a chest pocket and a slightly relaxed fit through the body.",
    fabric: "100% combed cotton, 180gsm",
    care: ["Machine wash cold", "Tumble dry low"],
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&q=80",
    ],
    colors: ["Warm Ivory", "Charcoal"],
    sizes: sizeOptions,
    variants: buildVariants(sizeOptions, ["Warm Ivory", "Charcoal"]),
    rating: 4.3,
    reviewCount: 58,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, count = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, count);
}

export const categories = Array.from(new Set(products.map((p) => p.category)));
export { colorOptions, sizeOptions };
