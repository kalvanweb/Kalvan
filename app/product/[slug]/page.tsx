import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ProductDetailClient from "./ProductDetailClient";

// Product data is now live in Supabase, so pages render dynamically
// (no generateStaticParams) — this always reflects current stock/pricing.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { data: product } = await supabase
    .from("products")
    .select("name, description, images")
    .eq("slug", params.slug)
    .single();

  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : undefined,
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetailClient slug={params.slug} />;
}
