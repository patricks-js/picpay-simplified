import type {
  CreateWalletParams,
  UpdateWalletParams,
  Wallet,
} from "@/domain/entities/wallet";
import type { IWalletRepository } from "@/domain/repositories/wallet-repository";
import { db } from "@/infra/database/drizzle";
import { wallets } from "@/infra/database/drizzle/schema";
import { eq } from "drizzle-orm";

export class DrizzleWalletRepository implements IWalletRepository {
  async findMany(): Promise<Wallet[]> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<Wallet | null> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.id, id));

    return wallet ?? null;
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId));

    return wallet ?? null;
  }

  async create(params: CreateWalletParams): Promise<Wallet> {
    const [newWallet] = await db.insert(wallets).values(params).returning();

    if (!newWallet) {
      throw new Error("Error creating User");
    }

    return newWallet;
  }

  async update(id: string, params: UpdateWalletParams): Promise<Wallet> {
    const [updatedUser] = await db
      .update(wallets)
      .set(params)
      .where(eq(wallets.id, id))
      .returning();

    if (!updatedUser) {
      throw new Error("Error updating User");
    }

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await db.delete(wallets).where(eq(wallets.id, id));
  }
}
