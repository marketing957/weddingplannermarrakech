"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { VoteTarget } from "@/lib/supabase/types";

export function VoteButtons({
  targetType,
  targetId,
  up,
  down,
  signedIn,
  returnTo,
}: {
  targetType: VoteTarget;
  targetId: string;
  up: number;
  down: number;
  signedIn: boolean;
  returnTo: string;
}) {
  const router = useRouter();
  const [counts, setCounts] = useState({ up, down });
  const [busy, setBusy] = useState(false);

  async function vote(value: 1 | -1) {
    if (!signedIn) {
      router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    setBusy(true);
    const sb = createClient();
    const { data } = await sb.auth.getClaims();
    const userId = (data?.claims as { sub?: string } | undefined)?.sub;
    if (!userId) {
      router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    const { error } = await sb.from("votes").upsert(
      { user_id: userId, target_type: targetType, target_id: targetId, value },
      { onConflict: "user_id,target_type,target_id" },
    );
    if (!error) {
      setCounts((c) =>
        value === 1 ? { up: c.up + 1, down: c.down } : { up: c.up, down: c.down + 1 },
      );
    }
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="inline-flex items-center gap-2 text-xs tabular-nums text-muted">
      <span className="font-medium text-ink">{counts.up} ▲</span>
      <span>·</span>
      <span>{counts.down} ▼</span>
      <button
        type="button"
        disabled={busy}
        aria-label="Upvote"
        onClick={() => vote(1)}
        className="rounded p-1 text-ink-soft transition hover:bg-teal-soft hover:text-teal disabled:opacity-50"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        disabled={busy}
        aria-label="Downvote"
        onClick={() => vote(-1)}
        className="rounded p-1 text-ink-soft transition hover:bg-terracotta-soft hover:text-terracotta disabled:opacity-50"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
