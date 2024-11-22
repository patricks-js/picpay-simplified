import { Currencies } from "@/domain/entities/wallet";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { users } from "./user";

export const currencyEnum = pgEnum("currencies", [
  Currencies.BRL,
  Currencies.USD,
  Currencies.EUR,
]);

export const wallets = pgTable("tb_wallets", (t) => ({
  id: t
    .text()
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  userId: t
    .text("user_id")
    .references(() => users.id)
    .notNull(),
  balance: t.numeric({ precision: 14, scale: 2 }).default("0.00").notNull(),
  currency: currencyEnum().notNull(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t.timestamp("updated_at").defaultNow().notNull(),
}));

export const walletRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
    relationName: "user_wallet",
  }),
}));
