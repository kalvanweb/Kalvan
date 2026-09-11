import { MetadataRoute } from "next";
import { products } from "@/lib/products";

const base = "https://www.kalvan.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/shop", "/support", "/account"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
  const productRoutes = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...productRoutes];
}
