import { PrismaClient, Ticket, TicketStatus } from "@prisma/client";
import { AiTriageResult, CreateTicketInput } from "../schemas/ticket";
import { AppError } from "../utils/app-error";

export class TicketService {
  constructor(private readonly prisma: PrismaClient) {}

  createTicket(input: CreateTicketInput): Promise<Ticket> {
    return this.prisma.ticket.create({
      data: {
        email: input.email,
        message: input.message,
      },
    });
  }

  listTickets(): Promise<Ticket[]> {
    return this.prisma.ticket.findMany({ orderBy: { createdAt: "desc" } });
  }

  async getTicketOrThrow(id: string): Promise<Ticket> {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      throw new AppError(404, "Ticket not found");
    }
    return ticket;
  }

  async markProcessing(id: string): Promise<void> {
    await this.prisma.ticket.update({
      where: { id },
      data: { status: TicketStatus.PROCESSING },
    });
  }

  async applyAiResult(id: string, result: AiTriageResult): Promise<void> {
    await this.prisma.ticket.update({
      where: { id },
      data: {
        category: result.category,
        sentiment: result.sentiment,
        urgency: result.urgency,
        draftReply: result.draftReply,
        status: TicketStatus.COMPLETED,
        processedAt: new Date(),
      },
    });
  }

  async markFailed(id: string): Promise<void> {
    await this.prisma.ticket.update({
      where: { id },
      data: {
        status: TicketStatus.FAILED,
      },
    });
  }

  async resolveTicket(id: string, draftReply?: string): Promise<Ticket> {
    await this.getTicketOrThrow(id);
    return this.prisma.ticket.update({
      where: { id },
      data: {
        status: TicketStatus.RESOLVED,
        draftReply: draftReply ?? undefined,
      },
    });
  }
}
