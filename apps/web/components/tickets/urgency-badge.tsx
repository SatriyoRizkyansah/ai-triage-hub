import { TicketUrgency } from "@/lib/types";

const STYLES: Record<Exclude<TicketUrgency, null>, string> = {
  High: "bg-rose-100 text-rose-700 border-rose-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export function UrgencyBadge({ urgency }: { urgency: TicketUrgency }) {
  if (!urgency) {
    return <span className="text-xs text-zinc-500">Pending</span>;
  }

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STYLES[urgency]}`}>
      {urgency}
    </span>
  );
}
