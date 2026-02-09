import Link from "next/link";
import { Ticket } from "@/lib/types";
import { StatusBadge } from "./status-badge";
import { UrgencyBadge } from "./urgency-badge";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function TicketTable({ tickets }: { tickets: Ticket[] }) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
        No tickets yet. Send a POST request to <code>/tickets</code> to bootstrap triage.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-sm">
      <table className="min-w-full divide-y divide-zinc-100 bg-white">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Urgency</th>
            <th className="px-4 py-3">Sentiment</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 text-sm text-zinc-800">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-zinc-50">
              <td className="px-4 py-4">
                <div className="font-medium">{ticket.email}</div>
                <p className="text-xs text-zinc-500 line-clamp-1">{ticket.message}</p>
              </td>
              <td className="px-4 py-4 text-sm">
                {ticket.category ? (
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                    {ticket.category}
                  </span>
                ) : (
                  <span className="text-xs text-zinc-400">Pending</span>
                )}
              </td>
              <td className="px-4 py-4">
                <UrgencyBadge urgency={ticket.urgency} />
              </td>
              <td className="px-4 py-4 text-sm">
                {ticket.sentiment ? (
                  <span className="font-semibold text-zinc-800">{ticket.sentiment}/10</span>
                ) : (
                  <span className="text-xs text-zinc-400">Pending</span>
                )}
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-4 text-sm text-zinc-500">
                {dateFormatter.format(new Date(ticket.createdAt))}
              </td>
              <td className="px-4 py-4">
                <Link
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
