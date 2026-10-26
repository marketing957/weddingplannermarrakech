import { createCookieClient } from "@/lib/supabase/cookie";

export async function needsMfaChallenge(): Promise<boolean> {
  const sb = await createCookieClient();
  const { data, error } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error || !data) return false;
  return data.nextLevel === "aal2" && data.currentLevel !== "aal2";
}
