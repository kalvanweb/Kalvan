import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapProduct, DbProduct } from "@/lib/mappers";

export const revalidate = 60; // cache product list for 60s at the edge

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");

  let query = supabase
    .from("products")
    .select("*, product_variants(*)")
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const products = (data as DbProduct[]).map(mapProduct);
  return NextResponse.json({ products });
}
