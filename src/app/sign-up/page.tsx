import type { Metadata } from "next";
import { AlreadySignedIn, AuthScreen } from "../login/page";
import { getAuthUser } from "@/lib/auth";
import { safeInternalPath } from "@/lib/safe-path";

export const metadata: Metadata = { title: "Create an account", robots: { index: false, follow: true } };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const user = await getAuthUser();
  if (user) return <AlreadySignedIn email={user.email} />;

  const { returnTo } = await searchParams;
  const next = safeInternalPath(returnTo);
  return <AuthScreen mode="signup" returnTo={next} />;
}
