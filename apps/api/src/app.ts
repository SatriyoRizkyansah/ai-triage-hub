import cors from "cors";
import express from "express";
import { env } from "./env";
import { prisma } from "./lib/prisma";
import { errorHandler, notFound } from "./middleware/error-handler";
import { TicketProcessor } from "./queue/ticket-processor";
import { createTicketRouter } from "./routes/tickets";
import { AIService } from "./services/ai-service";
import { TicketService } from "./services/ticket-service";

const app = express();

app.use(cors());
app.use(express.json());

const ticketService = new TicketService(prisma);
const aiService = new AIService();
const ticketProcessor = new TicketProcessor(ticketService, aiService);

app.use("/tickets", createTicketRouter({ ticketService, ticketProcessor }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", environment: env.NODE_ENV });
});

app.use(notFound);
app.use(errorHandler);

export { app };
