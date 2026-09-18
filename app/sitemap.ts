import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const base = "https://www.kalvan.example";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/shop", "/support", "/account"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const { data } = await supabase.from("products").select("slug");
  const productRoutes = (data ?? []).map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
