import { UserType } from "@/domain/entities/user";
import { createId } from "@paralleldrive/cuid2";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";

export const userType = pgEnum("user_role", [
  UserType.Customer,
  UserType.Merchant,
]);

export const users = pgTable("tb_users", (t) => ({
  id: t
    .text()
    .$defaultFn(() => createId())
    .primaryKey()
    .notNull(),
  firstName: t.text("first_name").notNull(),
  surname: t.text().notNull(),
  email: t.text().unique().notNull(),
  document: t.text().unique().notNull(),
  passwordHash: t.text().notNull(),
  type: userType().notNull(),
  createdAt: t.timestamp("created_at").defaultNow().notNull(),
  updatedAt: t.timestamp("updated_at").defaultNow().notNull(),
}));
