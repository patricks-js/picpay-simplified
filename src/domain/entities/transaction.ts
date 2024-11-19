export interface Transaction {
  id: number;
  senderId: string;
  receiverId: string;
  amount: number;
  timestamp: Date;
}

export type CreateTransactionParams = Omit<Transaction, "id" | "timestamp">;
