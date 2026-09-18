import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Browser/client-safe Supabase client. Uses the anon key, which only ever
 * has the access granted by the row-level security policies in
 * supabase/schema.sql (public read on products, users can only touch
 * their own profile/addresses/orders).
 */
export const supabase = createClient(supabaseUrl, anonKey);

/**
 * Server-only Supabase client using the service-role key, which bypasses
 * row-level security entirely. Only ever import this inside app/api/*
 * route handlers (server code) — never in a "use client" component, and
 * never expose SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.
 */
export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
