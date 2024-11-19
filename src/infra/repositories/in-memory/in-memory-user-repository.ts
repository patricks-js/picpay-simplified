import type { CreateUserParams, User } from "@/domain/entities/user";
import type { IUserRepository } from "@/domain/repositories/user-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUserRepository implements IUserRepository {
  #items: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.#items.find((item) => item.email === email) ?? null;
  }

  async findByDocument(document: string): Promise<User | null> {
    return this.#items.find((item) => item.document === document) ?? null;
  }

  async findMany(): Promise<User[]> {
    return this.#items;
  }

  async findById(id: string): Promise<User | null> {
    return this.#items.find((item) => item.id === id) ?? null;
  }

  async create(params: CreateUserParams): Promise<User> {
    const itemPosition = this.#items.push({
      ...params,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newItem = this.#items[itemPosition - 1];

    if (!newItem) {
      throw new Error("Error creating new User");
    }

    return newItem;
  }

  async update(
    id: string,
    params: Partial<Pick<User, "firstName" | "surname">>,
  ): Promise<User> {
    const item = await this.findById(id);

    if (!item) {
      throw new Error("Error finding User");
    }

    const updatedItem = Object.assign(item, params);

    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    this.#items = this.#items.filter((item) => item.id !== id);
  }
}
