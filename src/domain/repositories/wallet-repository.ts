import type {
  CreateWalletParams,
  UpdateWalletParams,
  Wallet,
} from "@/domain/entities/wallet";
import type { IRepository } from "@/domain/interfaces/repository";

export interface IWalletRepository
  extends IRepository<Wallet, string, CreateWalletParams, UpdateWalletParams> {
  findByUserId(userId: string): Promise<Wallet | null>;
}
