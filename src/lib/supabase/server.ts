import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side client for public, cacheable content reads.
 * No cookies or auth: all content tables are readable by the anon role via RLS.
 */
export function createServerClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
