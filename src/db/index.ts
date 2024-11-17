import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";

export const db = drizzle(env.POSTGRESQL_URL);
