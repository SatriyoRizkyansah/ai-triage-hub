export type TicketStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "RESOLVED" | "FAILED";
export type TicketUrgency = "High" | "Medium" | "Low" | null;
export type TicketCategory = "Billing" | "Technical" | "Feature Request" | null;

export type Ticket = {
  id: string;
  email: string;
  message: string;
  category: TicketCategory;
  sentiment: number | null;
  urgency: TicketUrgency;
  draftReply: string | null;
  status: TicketStatus;
  createdAt: string;
  processedAt: string | null;
};
