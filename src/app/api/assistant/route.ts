import { isLocale } from "@/i18n";
import { loadCatalogBrief } from "@/lib/assistant/catalog";
import { groundedReply } from "@/lib/assistant/grounded";
import { resolveLlm, streamLlm, streamText } from "@/lib/assistant/llm";
import { systemPrompt } from "@/lib/assistant/prompt";
import type { ChatMessage } from "@/lib/assistant/types";
import { getRequestCurrency } from "@/lib/currency-server";
import { isRateLimited } from "@/lib/rate-limit";

const MAX_MESSAGES = 16;
const MAX_CHARS = 1500;

function sanitize(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .slice(-MAX_MESSAGES)
    .map((m) => {
      if (!m || typeof m !== "object") return null;
      const role = (m as { role?: string }).role;
      const content = (m as { content?: string }).content;
      if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
      const text = content.trim().slice(0, MAX_CHARS);
      if (!text) return null;
      return { role, content: text } as ChatMessage;
    })
    .filter((m): m is ChatMessage => m !== null);
}

export async function POST(request: Request) {
  if (await isRateLimited(request, "asst", 20, 60)) {
    return Response.json({ error: "Too many questions. Pause a minute, then try again." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const localeRaw = (body as { locale?: string }).locale;
  const locale = localeRaw && isLocale(localeRaw) ? localeRaw : "en";
  const messages = sanitize((body as { messages?: unknown }).messages);
  const last = [...messages].reverse().find((m) => m.role === "user");
  if (!last) {
    return Response.json({ error: "Ask a question first." }, { status: 400 });
  }

  const brief = await loadCatalogBrief();
  const currency = await getRequestCurrency();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (chunk: string) => controller.enqueue(encoder.encode(chunk));
      try {
        const llm = resolveLlm();
        if (llm) {
          await streamLlm({
            system: systemPrompt(locale, brief, currency),
            messages,
            llm,
            onDelta: send,
          });
        } else {
          const text = groundedReply(last.content, locale, brief, currency);
          await streamText(text, send);
        }
      } catch {
        const text = groundedReply(last.content, locale, brief, currency);
        await streamText(text, send);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
