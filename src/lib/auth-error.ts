/** Turn an OAuth callback error into a short message. Never echo provider codes. */
export function authErrorMessage(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const text = raw.toLowerCase();
  if (
    text.includes("invalid_client") ||
    text.includes("client secret") ||
    text.includes("exchange external") ||
    text.includes("unable to exchange")
  ) {
    return "Google rejected the sign-in. The client secret saved in Supabase does not match the secret in Google Cloud. Update Authentication → Providers → Google, then try again.";
  }
  if (text.includes("access_denied") || text.includes("cancel")) {
    return "Google sign-in was cancelled.";
  }
  return "Google sign-in did not finish. Try again.";
}
