import type {
  CreateTransactionParams,
  Transaction,
} from "@/domain/entities/transaction";
import type { IRepository } from "@/domain/interfaces/repository";

export interface ITransactionRepository
  extends IRepository<Transaction, number, CreateTransactionParams, void> {}
