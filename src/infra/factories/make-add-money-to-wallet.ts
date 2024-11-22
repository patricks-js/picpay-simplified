import { AddMoneyToWalletUseCase } from "@/application/use-cases/add-money-to-wallet";
import { DrizzleWalletRepository } from "../repositories/drizzle/drizzle-wallet-repository";

export function makeAddMoneyToWalletUseCase(): AddMoneyToWalletUseCase {
  const walletRepository = new DrizzleWalletRepository();
  return new AddMoneyToWalletUseCase(walletRepository);
}
