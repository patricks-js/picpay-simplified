import type {
  CreateWalletParams,
  UpdateWalletParams,
  Wallet,
} from "@/domain/entities/wallet";
import type { IWalletRepository } from "@/domain/repositories/wallet-repository";
import { randomUUID } from "node:crypto";

export class InMemoryWalletRepository implements IWalletRepository {
  #items: Wallet[] = [];

  async findMany(): Promise<Wallet[]> {
    throw new Error("Method not implemented");
  }

  async findById(id: string): Promise<Wallet | null> {
    return this.#items.find((item) => item.id === id) ?? null;
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    return this.#items.find((item) => item.userId === userId) ?? null;
  }

  async create(params: CreateWalletParams): Promise<Wallet> {
    const itemPosition = this.#items.push({
      ...params,
      id: randomUUID(),
      balance: "0.00",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newItem = this.#items[itemPosition - 1];

    if (!newItem) {
      throw new Error("Error creating new Wallet");
    }

    return newItem;
  }

  async update(id: string, params: UpdateWalletParams): Promise<Wallet> {
    const item = await this.findById(id);

    if (!item) {
      throw new Error("Error finding Wallet");
    }

    const updatedItem = Object.assign(item, params);

    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    this.#items = this.#items.filter((item) => item.id !== id);
  }
}
