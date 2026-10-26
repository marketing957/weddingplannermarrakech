import { createCookieClient } from "@/lib/supabase/cookie";

export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
};

export async function getAuthUser(): Promise<AuthUser | null> {
  const sb = await createCookieClient();
  const { data, error } = await sb.auth.getClaims();
  if (error || !data?.claims) return null;
  const claims = data.claims as {
    sub?: string;
    email?: string;
    user_metadata?: { full_name?: string; name?: string };
  };
  if (!claims.sub) return null;
  return {
    id: claims.sub,
    email: claims.email ?? null,
    name: claims.user_metadata?.full_name ?? claims.user_metadata?.name ?? null,
  };
}
