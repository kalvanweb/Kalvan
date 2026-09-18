-- KALVAN database schema for Supabase (Postgres)
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query),
-- or via `supabase db push` if you're using the Supabase CLI.

create extension if not exists "pgcrypto";

-- ── Products ────────────────────────────────────────────────────────────
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  price integer not null,
  mrp integer,
  description text not null,
  fabric text not null,
  care text[] not null default '{}',
  images text[] not null default '{}',
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  is_new_arrival boolean not null default false,
  is_best_seller boolean not null default false,
  created_at timestamptz not null default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null,
  color text not null,
  sku text unique not null,
  stock integer not null default 0,
  unique (product_id, size, color)
);

-- ── Customers & addresses ───────────────────────────────────────────────
-- `auth.users` is Supabase's built-in auth table — this profile table
-- extends it with the fields KALVAN needs (name, phone).
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Orders ──────────────────────────────────────────────────────────────
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  address_id uuid references addresses(id),
  subtotal integer not null,
  discount integer not null default 0,
  shipping integer not null default 0,
  cod_fee integer not null default 0,
  total integer not null,
  coupon_code text,
  payment_method text not null check (payment_method in ('online', 'cod')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  order_status text not null default 'placed' check (order_status in ('placed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid not null references product_variants(id),
  product_name text not null,
  size text not null,
  color text not null,
  price integer not null,
  quantity integer not null
);

-- ── Coupons ─────────────────────────────────────────────────────────────
create table coupons (
  code text primary key,
  discount_type text not null check (discount_type in ('percent', 'flat')),
  discount_value integer not null,
  active boolean not null default true
);

insert into coupons (code, discount_type, discount_value) values
  ('KALVAN10', 'percent', 10),
  ('WELCOME150', 'flat', 150);

-- ── Row Level Security ──────────────────────────────────────────────────
alter table products enable row level security;
alter table product_variants enable row level security;
alter table profiles enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table coupons enable row level security;

-- Products & variants: publicly readable (it's a storefront catalogue)
create policy "Products are viewable by everyone" on products for select using (true);
create policy "Variants are viewable by everyone" on product_variants for select using (true);
create policy "Active coupons are viewable by everyone" on coupons for select using (active = true);

-- Profiles/addresses/orders: users can only see and manage their own rows
create policy "Users manage their own profile" on profiles for all using (auth.uid() = id);
create policy "Users manage their own addresses" on addresses for all using (auth.uid() = user_id);
create policy "Users view their own orders" on orders for select using (auth.uid() = user_id);
create policy "Users view their own order items" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);

-- Writes to products/variants/orders/order_items happen through the
-- Next.js API routes using the service-role key (bypasses RLS), which is
-- what lets checkout create orders and decrement stock atomically without
-- every logged-in customer needing direct insert access to those tables.
