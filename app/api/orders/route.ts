import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type OrderItemInput = {
  productId: string;
  variantId: string;
  quantity: number;
};

type OrderRequestBody = {
  items: OrderItemInput[];
  address: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: "online" | "cod";
  couponCode?: string;
};

function generateOrderNumber() {
  return `KLV${Date.now().toString().slice(-8)}`;
}

export async function POST(request: NextRequest) {
  const body: OrderRequestBody = await request.json();
  const admin = supabaseAdmin();

  if (!body.items?.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  // Identify the customer, if signed in — orders are also allowed as a
  // guest (user_id stays null) so checkout never blocks on having an account.
  let userId: string | null = null;
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");
    const { data } = await admin.auth.getUser(token);
    userId = data.user?.id ?? null;
  }

  // ── Recompute prices and validate stock server-side. Never trust a
  // client-supplied total — the browser can be tampered with. ───────────
  const variantIds = body.items.map((i) => i.variantId);
  const { data: variants, error: variantError } = await admin
    .from("product_variants")
    .select("id, stock, product_id, products(price, name)")
    .in("id", variantIds);

  if (variantError || !variants) {
    return NextResponse.json({ error: "Could not verify cart items." }, { status: 500 });
  }

  let subtotal = 0;
  const orderItemRows: any[] = [];

  for (const item of body.items) {
    const variant = variants.find((v: any) => v.id === item.variantId);
    if (!variant) {
      return NextResponse.json({ error: "One of the items is no longer available." }, { status: 400 });
    }
    if (variant.stock < item.quantity) {
      return NextResponse.json(
        { error: `Only ${variant.stock} left in stock for one of your items.` },
        { status: 409 }
      );
    }
    const product = Array.isArray(variant.products) ? variant.products[0] : variant.products;
    subtotal += product.price * item.quantity;
    orderItemRows.push({
      product_id: item.productId,
      variant_id: item.variantId,
      product_name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
  }

  // Coupon: recomputed from the coupons table, never from client input.
  let discount = 0;
  if (body.couponCode) {
    const { data: coupon } = await admin
      .from("coupons")
      .select("*")
      .eq("code", body.couponCode.toUpperCase())
      .eq("active", true)
      .single();
    if (coupon) {
      discount =
        coupon.discount_type === "percent"
          ? Math.round((subtotal * coupon.discount_value) / 100)
          : Math.min(coupon.discount_value, subtotal);
    }
  }

  const shipping = subtotal >= 2999 ? 0 : 149;
  const codFee = body.paymentMethod === "cod" ? 49 : 0;
  const total = Math.max(0, subtotal - discount) + shipping + codFee;

  if (body.paymentMethod === "cod" && total > 5000) {
    return NextResponse.json({ error: "COD is not available above ₹5,000." }, { status: 400 });
  }

  // ── Create the address, then the order, then the order items ─────────
  const { data: address, error: addressError } = await admin
    .from("addresses")
    .insert({
      user_id: userId,
      full_name: body.address.fullName,
      phone: body.address.phone,
      line1: body.address.line1,
      line2: body.address.line2 ?? null,
      city: body.address.city,
      state: body.address.state,
      pincode: body.address.pincode,
    })
    .select()
    .single();

  if (addressError || !address) {
    return NextResponse.json({ error: "Could not save the shipping address." }, { status: 500 });
  }

  const orderNumber = generateOrderNumber();

  // NOTE: in production, wrap the order insert + item inserts + stock
  // decrements in a single Postgres function (RPC) called via
  // `admin.rpc(...)` so they're atomic. Sequential calls are used here to
  // keep the example readable — under concurrent load this can allow a
  // rare over-sell if two orders hit the last unit of stock at once.
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: userId,
      address_id: address.id,
      subtotal,
      discount,
      shipping,
      cod_fee: codFee,
      total,
      coupon_code: body.couponCode ?? null,
      payment_method: body.paymentMethod,
      payment_status: body.paymentMethod === "cod" ? "pending" : "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Could not create the order." }, { status: 500 });
  }

  await admin
    .from("order_items")
    .insert(orderItemRows.map((row) => ({ ...row, order_id: order.id })));

  for (const item of body.items) {
    const variant = variants.find((v: any) => v.id === item.variantId)!;
    await admin
      .from("product_variants")
      .update({ stock: variant.stock - item.quantity })
      .eq("id", item.variantId);
  }

  // TODO: if paymentMethod === "online", this is where you'd create a
  // Razorpay/Cashfree order and return its id for the client to open the
  // payment sheet, then verify the signature in a separate webhook route
  // before flipping payment_status to "paid".

  return NextResponse.json({
    orderId: order.id,
    orderNumber: order.order_number,
    total: order.total,
  });
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Sign in to view orders." }, { status: 401 });
  }

  const admin = supabaseAdmin();
  const token = authHeader.replace("Bearer ", "");
  const { data: userData } = await admin.auth.getUser(token);
  if (!userData.user) {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }

  const { data: orders, error } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders });
}
