import { Router } from "express";
import { asyncHandler } from "../middleware/async-handler";
import { TicketProcessor } from "../queue/ticket-processor";
import { createTicketSchema, resolveTicketSchema } from "../schemas/ticket";
import { TicketService } from "../services/ticket-service";

export const createTicketRouter = ({ ticketService, ticketProcessor }: { ticketService: TicketService; ticketProcessor: TicketProcessor }) => {
  const router = Router();

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      const payload = createTicketSchema.parse(req.body);
      const ticket = await ticketService.createTicket(payload);
      ticketProcessor.enqueue(ticket.id);
      res.status(201).json({ data: ticket });
    }),
  );

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const tickets = await ticketService.listTickets();
      res.json({ data: tickets });
    }),
  );

  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const ticketId = req.params.id as string;
      const ticket = await ticketService.getTicketOrThrow(ticketId);
      res.json({ data: ticket });
    }),
  );

  router.patch(
    "/:id/resolve",
    asyncHandler(async (req, res) => {
      const payload = resolveTicketSchema.parse(req.body ?? {});
      const ticketId = req.params.id as string;
      const ticket = await ticketService.resolveTicket(ticketId, payload.draftReply);
      res.json({ data: ticket });
    }),
  );

  return router;
};
