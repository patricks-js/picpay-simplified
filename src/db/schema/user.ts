import { relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { transactions } from "./transaction";

export const userRole = pgEnum("user_role", ["customer", "merchant"]);

export const users = pgTable("tb_users", (t) => ({
  id: t.serial().primaryKey().notNull(),
  firstName: t.text("first_name").notNull(),
  surname: t.text().notNull(),
  email: t.text().unique().notNull(),
  document: t.text().unique().notNull(),
  passwordHash: t.text().notNull(),
  role: userRole().notNull(),
  balance: t.numeric({ precision: 14, scale: 2 }).default("0.00").notNull(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
}));

export const userRelations = relations(users, ({ many }) => ({
  transactions: many(transactions, {
    relationName: "user_transactions",
  }),
}));
