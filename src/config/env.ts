import { config } from "dotenv";
import { z } from "zod";

config({
  path: ".env.local",
});

const envSchema = z.object({
  POSTGRESQL_URL: z.string().url().startsWith("postgresql://"),
  AUTH_SECRET: z.string().min(12),
  PORT: z.coerce.number().default(3333),
  HOST: z.string(),
  NODE_ENV: z.enum(["production", "development"]).default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  throw new Error(
    `❌ Invalid Environment Variables: ${JSON.stringify(_env.error.flatten().fieldErrors)}`,
  );
}

export const env = _env.data;
