import { createServerClient } from "@/lib/supabase/server";

async function bucketKey(kind: "asst" | "lead", ip: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${kind}:${ip}`));
  const hex = Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
  return `${kind}:${hex.slice(0, 40)}`;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
    const last = hops[hops.length - 1];
    if (last) return last;
  }
  return request.headers.get("x-real-ip")?.trim() || "local";
}

/** Returns true when the client is over the limit. */
export async function isRateLimited(
  request: Request,
  kind: "asst" | "lead",
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  const bucket = await bucketKey(kind, clientIp(request));
  const sb = createServerClient();
  const { data, error } = await sb.rpc("take_rate_slot", {
    p_bucket: bucket,
    p_max: max,
    p_window_seconds: windowSeconds,
  });
  if (error) return true;
  return data !== true;
}
