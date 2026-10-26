import { createServerClient } from "@/lib/supabase/server";
import { isRateLimited } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof body.website === "string" && body.website.trim()) {
    return Response.json({ ok: true });
  }

  if (await isRateLimited(request, "lead", 8, 3600)) {
    return Response.json({ error: "Too many saves. Try again in an hour." }, { status: 429 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const date = typeof body.wedding_date === "string" ? body.wedding_date.trim() : "";
  const guests = typeof body.guest_count === "number" ? body.guest_count : Number(body.guest_count);
  const estimate = typeof body.estimate === "number" ? body.estimate : Number(body.estimate);
  const plan = body.plan;

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return Response.json({ error: "Enter a valid email." }, { status: 400 });
  }
  if (!Number.isFinite(guests) || guests < 1 || guests > 5000) {
    return Response.json({ error: "Guest count looks off." }, { status: 400 });
  }

  const sb = createServerClient();
  const { error } = await sb.rpc("submit_lead", {
    p_email: email,
    p_name: name,
    p_wedding_date: date,
    p_guest_count: guests,
    p_estimate: Number.isFinite(estimate) ? estimate : null,
    p_plan: plan ?? {},
  });

  if (error) {
    const msg = error.message ?? "";
    if (msg.includes("rate_limited")) {
      return Response.json({ error: "Too many saves. Try again later." }, { status: 429 });
    }
    return Response.json({ error: "Could not save that plan." }, { status: 400 });
  }

  return Response.json({ ok: true });
}
