import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

const base = "./src/db";

export default defineConfig({
  schema: `${base}/schema`,
  out: `${base}/migrations`,
  strict: true,
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRESQL_URL,
  },
});
