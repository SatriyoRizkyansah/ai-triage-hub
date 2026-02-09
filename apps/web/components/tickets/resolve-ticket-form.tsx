"use client";

import { useState, useTransition } from "react";
import { API_BASE_URL } from "@/lib/config";

export function ResolveTicketForm({
  ticketId,
  initialDraft,
}: {
  ticketId: string;
  initialDraft?: string | null;
}) {
  const [draftReply, setDraftReply] = useState(initialDraft ?? "");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/resolve`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ draftReply: draftReply || undefined }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || "Unable to resolve ticket");
        }

        setStatus("success");
      } catch (error) {
        console.error(error);
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="draft" className="block text-sm font-medium text-zinc-700">
          Draft reply
        </label>
        <textarea
          id="draft"
          value={draftReply}
          onChange={(event) => setDraftReply(event.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-300 bg-white p-3 text-sm text-zinc-800 shadow-sm focus:border-indigo-500 focus:outline-none"
          rows={6}
          placeholder="Edit the AI draft before resolving..."
        />
        <p className="mt-1 text-xs text-zinc-500">
          This reply will be stored alongside the ticket when marked as resolved.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {isPending ? "Resolving..." : "Resolve ticket"}
        </button>
        {status === "success" ? <span className="text-sm text-emerald-600">Ticket resolved.</span> : null}
        {status === "error" ? <span className="text-sm text-rose-600">{errorMessage}</span> : null}
      </div>
    </form>
  );
}
