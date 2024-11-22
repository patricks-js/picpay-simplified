import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ResourceNotFoundError } from "@/application/errors/resource-not-found";
import { AddMoneyToWalletUseCase } from "@/application/use-cases/add-money-to-wallet";
import { Currencies } from "@/domain/entities/wallet";
import { InMemoryWalletRepository } from "@/infra/repositories/in-memory/in-memory-wallet-repository";

describe("Use Case -> Add Money To Wallet Use Case", () => {
  let sut: AddMoneyToWalletUseCase;
  let walletId: string;

  beforeEach(async () => {
    const walletRepository = new InMemoryWalletRepository();
    sut = new AddMoneyToWalletUseCase(walletRepository);

    const { id } = await walletRepository.create({
      currency: Currencies.BRL,
      userId: "user_id",
    });

    walletId = id;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should be able to add money into the wallet", async () => {
    const spy = vi.spyOn(sut, "execute");
    const amount = 763.13;

    await sut.execute({
      amount,
      walletId,
    });

    expect(spy).toHaveBeenCalledOnce();
  });

  it("should throw an error if amount is less or equal than 0", async () => {
    const amount = -763.13;

    await expect(
      sut.execute({
        amount,
        walletId,
      }),
    ).rejects.toThrow("Invalid operation");
  });

  it("should throw an error if wallet doesn't exits", async () => {
    const amount = 763.13;
    const walletId = "non_existent";

    await expect(
      sut.execute({
        amount,
        walletId,
      }),
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
