import { pgTable } from "drizzle-orm/pg-core";
import { users } from "./user";

export const transactions = pgTable("tb_transactions", (t) => ({
  id: t.serial().primaryKey().notNull(),
  payerId: t
    .integer()
    .references(() => users.id)
    .notNull(),
  payeeId: t
    .integer()
    .references(() => users.id)
    .notNull(),
  amount: t.numeric({ precision: 14, scale: 2 }).notNull(),
  timestamp: t.timestamp().defaultNow().notNull(),
}));
