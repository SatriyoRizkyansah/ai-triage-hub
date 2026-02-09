import { z } from "zod";

export const ticketCategoryValues = ["Billing", "Technical", "Feature Request"] as const;
export const ticketUrgencyValues = ["High", "Medium", "Low"] as const;

export const createTicketSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10, "Message should include more detail"),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const resolveTicketSchema = z.object({
  draftReply: z.string().min(10, "Reply should be meaningful").optional(),
});

const aiTriageRawSchema = z.object({
  category: z.enum(ticketCategoryValues),
  sentiment: z.number().min(1).max(10),
  urgency: z.enum(ticketUrgencyValues),
  draft_reply: z.string().min(10),
});

export type AiTriageResult = {
  category: (typeof ticketCategoryValues)[number];
  sentiment: number;
  urgency: (typeof ticketUrgencyValues)[number];
  draftReply: string;
};

export const parseAiTriageResult = (payload: unknown): AiTriageResult => {
  const parsed = aiTriageRawSchema.parse(payload);
  return {
    category: parsed.category,
    sentiment: parsed.sentiment,
    urgency: parsed.urgency,
    draftReply: parsed.draft_reply,
  };
};
