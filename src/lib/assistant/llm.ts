import type { ChatMessage } from "./types";

type LlmConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
};

export function resolveLlm(): LlmConfig | null {
  const openai = process.env.OPENAI_API_KEY;
  if (openai) {
    return {
      apiKey: openai,
      baseUrl: process.env.OPENAI_BASE_URL?.replace(/\/$/, "") || "https://api.openai.com/v1",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    };
  }
  const groq = process.env.GROQ_API_KEY;
  if (groq) {
    return {
      apiKey: groq,
      baseUrl: "https://api.groq.com/openai/v1",
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    };
  }
  return null;
}

export async function streamLlm(opts: {
  system: string;
  messages: ChatMessage[];
  llm: LlmConfig;
  onDelta: (text: string) => void;
}): Promise<void> {
  const res = await fetch(`${opts.llm.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.llm.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: opts.llm.model,
      stream: true,
      temperature: 0.4,
      max_tokens: 700,
      messages: [{ role: "system", content: opts.system }, ...opts.messages],
    }),
  });

  if (!res.ok || !res.body) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(err.slice(0, 280) || `LLM ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const json = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
        const piece = json.choices?.[0]?.delta?.content;
        if (piece) opts.onDelta(piece);
      } catch {
        /* ignore incomplete SSE */
      }
    }
  }
}

export async function streamText(text: string, onDelta: (chunk: string) => void): Promise<void> {
  const words = text.split(/(\s+)/);
  let acc = "";
  for (const w of words) {
    acc += w;
    if (acc.length >= 18 || w.includes("\n")) {
      onDelta(acc);
      acc = "";
      await new Promise((r) => setTimeout(r, 12));
    }
  }
  if (acc) onDelta(acc);
}
