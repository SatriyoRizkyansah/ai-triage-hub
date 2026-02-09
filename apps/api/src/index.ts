import { app } from "./app";
import { env } from "./env";
import { logger } from "./lib/logger";
import { prisma } from "./lib/prisma";

const server = app.listen(env.PORT, () => {
  logger.info(`API running on http://localhost:${env.PORT}`);
});

const shutdown = async (signal: string) => {
  logger.info({ signal }, "Shutting down API server");
  await prisma.$disconnect().catch((error) => logger.error({ error }, "Failed to disconnect Prisma"));
  server.close(() => process.exit(0));
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});
