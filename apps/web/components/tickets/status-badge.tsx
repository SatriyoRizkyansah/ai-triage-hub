import { TicketStatus } from "@/lib/types";

const STATUS_STYLES: Record<TicketStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  PROCESSING: "bg-sky-100 text-sky-700 border-sky-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  RESOLVED: "bg-zinc-800 text-white border-zinc-900",
  FAILED: "bg-rose-100 text-rose-700 border-rose-200",
};

const STATUS_LABELS: Record<TicketStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  RESOLVED: "Resolved",
  FAILED: "Failed",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
