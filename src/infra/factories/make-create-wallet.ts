import { CreateWalletUseCase } from "@/application/use-cases/create-wallet";
import { DrizzleWalletRepository } from "../repositories/drizzle/drizzle-wallet-repository";
import { makeValidateUserExists } from "./make-validate-user-exists";

export function makeCreateWalletUseCase(): CreateWalletUseCase {
  const walletRepository = new DrizzleWalletRepository();
  const validateUserExists = makeValidateUserExists();
  return new CreateWalletUseCase(walletRepository, validateUserExists);
}
