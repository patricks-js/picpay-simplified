import { env } from "@/config/env";
import { defineConfig } from "drizzle-kit";

const base = "./src/infra/database/drizzle";

export default defineConfig({
  schema: `${base}/schema`,
  out: `${base}/migrations`,
  strict: true,
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRESQL_URL,
  },
});
