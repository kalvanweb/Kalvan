import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapProduct, DbProduct } from "@/lib/mappers";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { data: productRow, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("slug", params.slug)
    .single();

  if (error || !productRow) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const product = mapProduct(productRow as DbProduct);

  const { data: relatedRows } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("category", product.category)
    .neq("id", product.id)
    .limit(4);

  const related = ((relatedRows ?? []) as DbProduct[]).map(mapProduct);

  return NextResponse.json({ product, related });
}
