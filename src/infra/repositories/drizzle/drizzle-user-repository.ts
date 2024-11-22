import { eq } from "drizzle-orm";

import type {
  CreateUserParams,
  UpdateUserParams,
  User,
} from "@/domain/entities/user";
import type {
  IUserRepository,
  UserFindByParams,
} from "@/domain/repositories/user-repository";
import { db } from "@/infra/database/drizzle";
import { users } from "@/infra/database/drizzle/schema";

export class DrizzleUserRepository implements IUserRepository {
  async findBy(params: UserFindByParams): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users[params.field], params.value));

    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    return user ?? null;
  }

  async findByDocument(document: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.document, document));

    return user ?? null;
  }

  async findMany(): Promise<User[]> {
    return db.query.users.findMany();
  }

  async findById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    return user ?? null;
  }

  async create(params: CreateUserParams): Promise<User> {
    const [newUser] = await db.insert(users).values(params).returning();

    if (!newUser) {
      throw new Error("Error creating User");
    }

    return newUser;
  }

  async update(id: string, params: UpdateUserParams): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(params)
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error("Error updating User");
    }

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}
