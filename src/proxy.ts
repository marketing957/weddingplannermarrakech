import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authErrorMessage } from "@/lib/auth-error";

function frenchPath(pathname: string): string | null {
  if (pathname === "/fr") return "/";
  if (pathname.startsWith("/fr/")) return pathname.slice(3) || "/";
  return null;
}

export async function proxy(request: NextRequest) {
  const oauthError = request.nextUrl.searchParams.get("error_description") || request.nextUrl.searchParams.get("error");
  const message = authErrorMessage(oauthError);
  if (message && (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/fr")) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    login.search = "";
    login.searchParams.set("error", message);
    return NextResponse.redirect(login);
  }

  const stripped = frenchPath(request.nextUrl.pathname);
  const locale = stripped !== null ? "fr" : "en";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  const url = request.nextUrl.clone();
  if (stripped !== null) url.pathname = stripped;

  let supabaseResponse =
    stripped !== null
      ? NextResponse.rewrite(url, { request: { headers: requestHeaders } })
      : NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse =
            stripped !== null
              ? NextResponse.rewrite(url, { request: { headers: requestHeaders } })
              : NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
        },
      },
    },
  );

  await supabase.auth.getClaims();

  supabaseResponse.headers.set("x-locale", locale);
  supabaseResponse.cookies.set("wpm-locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
