import type { UseCase } from "@/domain/interfaces/use-case";
import type { IWalletRepository } from "@/domain/repositories/wallet-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found";
import type { ValidateUserExists } from "./validate-user-exists";

interface AddMoneyToWalletInput {
  amount: number;
  userId: string;
}

export class AddMoneyToWalletUseCase
  implements UseCase<AddMoneyToWalletInput, void>
{
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly validateUserExists: ValidateUserExists,
  ) {}

  async execute(input: AddMoneyToWalletInput): Promise<void> {
    const userExists = await this.validateUserExists.execute({
      field: "id",
      value: input.userId,
    });

    if (!userExists) {
      throw new ResourceNotFoundError("User");
    }

    const wallet = await this.walletRepository.findByUserId(input.userId);

    if (!wallet) {
      throw new ResourceNotFoundError("Wallet");
    }

    const newBalanceAmount = Number(wallet.balance) + input.amount;

    await this.walletRepository.update(wallet.id, {
      balance: String(newBalanceAmount),
    });
  }
}
