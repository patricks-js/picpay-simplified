import { Currencies } from "@/domain/entities/wallet";
import type { IWalletRepository } from "@/domain/repositories/wallet-repository";
import { InMemoryWalletRepository } from "@/infra/repositories/in-memory/in-memory-wallet-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CreateWalletUseCase } from "./create-wallet";

describe("Use Case -> Create Wallet", () => {
  let walletRepository: IWalletRepository;
  let sut: CreateWalletUseCase;

  beforeEach(() => {
    walletRepository = new InMemoryWalletRepository();
    sut = new CreateWalletUseCase(walletRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create a wallet to a user", async () => {
    walletRepository.findByUserId = vi.fn().mockResolvedValue(null);

    const { wallet } = await sut.execute({
      currency: Currencies.BRL,
      userId: "existent_id",
    });

    expect(wallet).toBeDefined();
    expect(wallet).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it("should throw an error if wallet already exists for user", async () => {
    walletRepository.findByUserId = vi.fn().mockResolvedValueOnce({
      id: "id",
      userId: "existent_id",
      balance: "0.00",
      currency: Currencies.BRL,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      sut.execute({ currency: Currencies.BRL, userId: "existent_id" }),
    ).rejects.toThrow("Wallet already exists.");
  });
});
