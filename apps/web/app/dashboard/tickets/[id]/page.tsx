import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchTicketById } from "@/lib/api";
import { StatusBadge } from "@/components/tickets/status-badge";
import { UrgencyBadge } from "@/components/tickets/urgency-badge";
import { ResolveTicketForm } from "@/components/tickets/resolve-ticket-form";

export const dynamic = "force-dynamic";

type TicketDetailPageProps = {
  params: { id: string };
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "full",
  timeStyle: "short",
});

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { id } = params;
  const ticket = await fetchTicketById(id).catch((error) => {
    console.error("Failed to load ticket", error);
    return null;
  });

  if (!ticket) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <Link href="/dashboard" className="font-semibold text-indigo-600">
            Dashboard
          </Link>
          <span>/</span>
          <span>{ticket.id}</span>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900">Ticket from {ticket.email}</h1>
        <p className="text-sm text-zinc-500">Created {dateFormatter.format(new Date(ticket.createdAt))}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Status</p>
          <div className="mt-2">
            <StatusBadge status={ticket.status} />
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Urgency</p>
          <div className="mt-2">
            <UrgencyBadge urgency={ticket.urgency} />
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Category</p>
          <p className="mt-2 text-sm text-zinc-800">{ticket.category ?? "Pending"}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Sentiment</p>
          <p className="mt-2 text-sm text-zinc-800">{ticket.sentiment ? `${ticket.sentiment}/10` : "Pending"}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Customer message</h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-zinc-700">{ticket.message}</p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">AI draft reply</h2>
            <p className="text-sm text-zinc-500">Review, tweak, and resolve.</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            Powered by Z.AI
          </span>
        </div>
        <div className="mt-4 rounded-lg bg-zinc-50 p-4 text-sm text-zinc-700">
          {ticket.draftReply ? ticket.draftReply : "Awaiting AI processing..."}
        </div>
        <div className="mt-6">
          <ResolveTicketForm ticketId={ticket.id} initialDraft={ticket.draftReply} />
        </div>
      </section>
    </main>
  );
}
