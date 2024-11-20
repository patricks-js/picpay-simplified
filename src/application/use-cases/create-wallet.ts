import { ResourceNotFoundError } from "@/application/errors/resource-not-found";
import type { ValidateUserExists } from "@/application/use-cases/validate-user-exists";
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
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly validateUserExists: ValidateUserExists,
  ) {}

  async execute(input: CreateWalletParams): Promise<CreateWalletOutput> {
    const userExists = await this.validateUserExists.execute({
      field: "id",
      value: input.userId,
    });
    if (!userExists) throw new ResourceNotFoundError("User");

    const walletExists = await this.walletRepository.findByUserId(input.userId);
    if (walletExists) throw new Error("Wallet already exists.");

    const wallet = await this.walletRepository.create(input);

    return {
      wallet,
    };
  }
}
