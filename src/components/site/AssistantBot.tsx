"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageCircle, Send, X } from "lucide-react";
import { LocaleLink } from "@/i18n/LocaleLink";
import { useI18n } from "@/i18n/LocaleProvider";
import type { ChatMessage } from "@/lib/assistant/types";
import { whatsappHref } from "@/lib/partners";

const STORAGE = "wpm:assistant";

export function AssistantBot() {
  const { locale, dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const whatsapp =
    locale === "fr"
      ? "Bonjour, je prépare un mariage à Marrakesh — je vous trouve via Wedding Planner Marrakesh"
      : "Hello, I am planning a Marrakesh wedding — I found you through Wedding Planner Marrakesh";

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`${STORAGE}:${locale}`);
      if (raw) setMessages(JSON.parse(raw) as ChatMessage[]);
    } catch {
      /* ignore */
    }
  }, [locale]);

  useEffect(() => {
    try {
      sessionStorage.setItem(`${STORAGE}:${locale}`, JSON.stringify(messages.slice(-20)));
    } catch {
      /* ignore */
    }
  }, [messages, locale]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, open]);

  async function ask(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    let reply = "";
    setMessages([...next, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("fail");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        const snapshot = reply;
        setMessages([...next, { role: "assistant", content: snapshot }]);
      }
      if (!reply.trim()) throw new Error("empty");
    } catch {
      setMessages([...next, { role: "assistant", content: dict.assistant.error }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open ? (
        <div
          className="fixed bottom-4 right-4 z-[60] flex w-[min(100vw-1.5rem,24rem)] flex-col border border-sand-deep bg-cream shadow-float"
          style={{ height: "min(34rem, calc(100dvh - 5.5rem))" }}
          role="dialog"
          aria-label={dict.assistant.title}
        >
          <header className="flex items-start justify-between gap-3 border-b border-sand-deep bg-ink px-4 py-3 text-cream">
            <div>
              <p className="kicker text-saffron">{dict.assistant.kicker}</p>
              <p className="font-display text-xl font-medium leading-tight">{dict.assistant.title}</p>
            </div>
            <div className="flex items-center gap-1">
              {messages.length ? (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50 hover:text-white"
                >
                  {dict.assistant.newChat}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center border border-white/15 text-cream hover:bg-white/10"
                aria-label={dict.assistant.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div>
                <p className="text-sm leading-relaxed text-ink-soft">{dict.assistant.empty}</p>
                <div className="mt-4 grid gap-2">
                  {dict.assistant.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="border border-sand-deep bg-white px-3 py-2 text-left text-[13px] text-ink hover:border-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={`${m.role}-${i}`} className={m.role === "user" ? "ml-8" : "mr-4"}>
                  {m.role === "user" ? (
                    <p className="bg-ink px-3 py-2 text-[13px] leading-relaxed text-cream">{m.content}</p>
                  ) : (
                    <div className="border border-sand-deep bg-white px-3 py-2 text-[13px] leading-relaxed text-ink-soft [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:decoration-sand-deep [&_a]:underline-offset-2 hover:[&_a]:decoration-ink [&_p+p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-4">
                      {m.content ? (
                        <ReactMarkdown
                          components={{
                            a: ({ href, children }) =>
                              href ? <LocaleLink href={href}>{children}</LocaleLink> : <span>{children}</span>,
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-muted">{dict.assistant.thinking}</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <form
            className="border-t border-sand-deep bg-white p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void ask(input);
            }}
          >
            <div className="flex gap-2">
              <label className="sr-only" htmlFor="wpm-assistant-input">
                {dict.assistant.placeholder}
              </label>
              <input
                id="wpm-assistant-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={dict.assistant.placeholder}
                maxLength={1500}
                disabled={busy}
                className="h-10 min-w-0 flex-1 border border-sand-deep bg-cream px-3 text-sm outline-none focus:border-ink disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="grid h-10 w-10 place-items-center bg-ink text-cream hover:bg-teal disabled:opacity-40"
                aria-label={dict.assistant.send}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <a
              href={whatsappHref(whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted hover:text-ink"
            >
              {dict.assistant.whatsapp}
            </a>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          title={dict.assistant.open}
          aria-label={dict.assistant.open}
          className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center border border-ink bg-ink text-cream shadow-float transition hover:bg-teal"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
