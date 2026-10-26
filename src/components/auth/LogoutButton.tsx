"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ children, className }: { children: ReactNode; className?: string }) {
  const router = useRouter();
  async function onClick() {
    const sb = createClient();
    await sb.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={className ?? "grid h-7 w-7 place-items-center rounded-full text-muted transition hover:bg-sand hover:text-ink"}
    >
      {className ? null : <span className="sr-only">Log out</span>}
      {children}
    </button>
  );
}
