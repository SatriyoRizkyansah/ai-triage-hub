import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: process.env.API_ENV_PATH });

type NodeEnv = "development" | "test" | "production";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  ZAI_TOKEN: z.string().min(1, "zai_token is required"),
  ZAI_MODEL: z.string().default("glm-4.5"),
  ZAI_API_BASE: z.string().default("https://api.z.ai/v1"),
});

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV as NodeEnv | undefined,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  ZAI_TOKEN: process.env.ZAI_TOKEN ?? process.env.zai_token,
  ZAI_MODEL: process.env.ZAI_MODEL,
  ZAI_API_BASE: process.env.ZAI_API_BASE,
};

export const env = envSchema.parse(rawEnv);
