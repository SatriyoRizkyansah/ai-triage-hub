import { TicketStatus } from "@prisma/client";
import { logger } from "../lib/logger";
import { TicketService } from "../services/ticket-service";
import { AIService } from "../services/ai-service";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class TicketProcessor {
  private currentChain: Promise<unknown> = Promise.resolve();

  constructor(
    private readonly ticketService: TicketService,
    private readonly aiService: AIService,
    private readonly options = { maxRetries: 3, retryDelayMs: 2000 },
  ) {}

  enqueue(ticketId: string) {
    this.currentChain = this.currentChain
      .then(() => this.processWithRetry(ticketId))
      .catch((error) => {
        logger.error({ error, ticketId }, "Ticket job failed unexpectedly");
      });
    logger.debug({ ticketId }, "Ticket enqueued for processing");
  }

  private async processWithRetry(ticketId: string) {
    for (let attempt = 1; attempt <= this.options.maxRetries; attempt += 1) {
      try {
        await this.processTicket(ticketId);
        return;
      } catch (error) {
        logger.error({ error, ticketId, attempt }, "Ticket processing failed");
        if (attempt === this.options.maxRetries) {
          await this.ticketService.markFailed(ticketId);
          return;
        }
        await wait(this.options.retryDelayMs * attempt);
      }
    }
  }

  private async processTicket(ticketId: string) {
    const ticket = await this.ticketService.getTicketOrThrow(ticketId);

    const processableStatuses: TicketStatus[] = [TicketStatus.PENDING, TicketStatus.FAILED];
    if (!processableStatuses.some((status) => status === ticket.status)) {
      logger.info({ ticketId, status: ticket.status }, "Skipping ticket - already processed");
      return;
    }

    await this.ticketService.markProcessing(ticketId);

    const aiResult = await this.aiService.triageTicket(ticket.message);
    await this.ticketService.applyAiResult(ticketId, aiResult);
    logger.info({ ticketId }, "Ticket triaged successfully");
  }
}
