import type { Locale } from "@/i18n";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type AssistantRequest = {
  locale: Locale;
  messages: ChatMessage[];
};

export type CatalogBrief = {
  venues: string;
  planners: string;
  vendors: string;
  months: string;
  faqs: string;
};
