import type { CreateWalletParams, Wallet } from "@/domain/entities/wallet";
import type { UseCase } from "@/domain/interfaces/use-case";
import type { IWalletRepository } from "@/domain/repositories/wallet-repository";

export type CreateWalletInput = CreateWalletParams;

export type CreateWalletOutput = {
  wallet: Wallet;
};

export class CreateWalletUseCase
  implements UseCase<CreateWalletInput, CreateWalletOutput>
{
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(input: CreateWalletParams): Promise<CreateWalletOutput> {
    const walletExists = await this.walletRepository.findByUserId(input.userId);
    if (walletExists) throw new Error("Wallet already exists.");

    const wallet = await this.walletRepository.create(input);

    return {
      wallet,
    };
  }
}
