import { relations } from "drizzle-orm";
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

export const transactionRelations = relations(transactions, ({ one }) => ({
  payer: one(users, {
    fields: [transactions.payerId],
    references: [users.id],
    relationName: "payer_transaction",
  }),
  payee: one(users, {
    fields: [transactions.payeeId],
    references: [users.id],
    relationName: "payee_transaction",
  }),
}));
