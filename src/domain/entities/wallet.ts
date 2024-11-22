export enum Currencies {
  BRL = "BRL",
  USD = "USD",
  EUR = "EUR",
}

export interface Wallet {
  id: string;
  userId: string;
  balance: string;
  currency: Currencies;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateWalletParams = Pick<Wallet, "userId" | "currency">;

export type UpdateWalletParams = Partial<Pick<Wallet, "balance">>;
