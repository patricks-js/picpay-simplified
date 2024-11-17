import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("tb_users", (t) => ({
  id: t.serial().primaryKey().notNull(),
  firstName: t.text("first_name").notNull(),
  surname: t.text().notNull(),
  email: t.text().unique().notNull(),
  document: t.text().unique().notNull(),
  passwordHash: t.text().notNull(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
}));
