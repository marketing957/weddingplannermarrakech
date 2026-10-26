import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authErrorMessage } from "@/lib/auth-error";
import { safeInternalPath } from "@/lib/safe-path";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error_description") || url.searchParams.get("error");
  const next = safeInternalPath(url.searchParams.get("next"));

  if (oauthError) {
    return NextResponse.redirect(loginUrl(url.origin, oauthError));
  }

  if (!code) {
    return NextResponse.redirect(new URL(next, url.origin));
  }

  const success = NextResponse.redirect(new URL(next, url.origin));
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            success.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(loginUrl(url.origin, error.message));
  }
  return success;
}

function loginUrl(origin: string, reason: string) {
  const login = new URL("/login", origin);
  const message = authErrorMessage(reason);
  if (message) login.searchParams.set("error", message);
  return login;
}
