import type { UseCase } from "@/domain/interfaces/use-case";
import type { IWalletRepository } from "@/domain/repositories/wallet-repository";
import { addBalance } from "@/utils/balance-helper";
import { ResourceNotFoundError } from "../errors/resource-not-found";

interface AddMoneyToWalletInput {
  amount: number;
  walletId: string;
}

export class AddMoneyToWalletUseCase
  implements UseCase<AddMoneyToWalletInput, void>
{
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(input: AddMoneyToWalletInput): Promise<void> {
    const wallet = await this.walletRepository.findById(input.walletId);

    if (!wallet) {
      throw new ResourceNotFoundError("Wallet");
    }

    const newBalance = addBalance(wallet.balance, input.amount);

    await this.walletRepository.update(wallet.id, {
      balance: newBalance,
    });
  }
}
