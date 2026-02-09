import Link from "next/link";
import { fetchTickets } from "@/lib/api";
import { Ticket } from "@/lib/types";
import { TicketTable } from "@/components/tickets/ticket-table";

export const metadata = {
  title: "AI Triage Dashboard",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let tickets: Ticket[] = [];
  let errorMessage: string | null = null;

  try {
    tickets = await fetchTickets();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unable to load tickets";
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">AI support triage</p>
          <h1 className="text-3xl font-bold text-zinc-900">Tickets overview</h1>
          <p className="text-sm text-zinc-500">
            Tickets arrive via the Express API. When a ticket is created it gets queued, triaged by the AI worker,
            and lands here with sentiment, urgency, and draft reply suggestions.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center rounded-md border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          Back to overview
        </Link>
      </header>

      {errorMessage ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <p className="font-semibold">Dashboard unavailable</p>
          <p className="text-sm text-rose-600">
            {errorMessage}
          </p>
          <p className="mt-2 text-xs text-rose-600">
            Start the API with <code>npm run dev -- --filter=api</code> and ensure <code>NEXT_PUBLIC_API_URL</code> points to the
            running instance.
          </p>
        </div>
      ) : (
        <TicketTable tickets={tickets} />
      )}
    </main>
  );
}
