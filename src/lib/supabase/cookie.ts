import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Request-scoped client that reads/writes the auth cookies. Never cache this. */
export async function createCookieClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet, headers) {
          void headers;
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component — the proxy refreshes cookies instead.
          }
        },
      },
    },
  );
}
