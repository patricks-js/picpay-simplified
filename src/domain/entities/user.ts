export enum UserType {
  Customer = "customer",
  Merchant = "merchant",
}

export interface User {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  document: string;
  passwordHash: string;
  type: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserParams = Omit<User, "id" | "createdAt" | "updatedAt">;

export type UpdateUserParams = Partial<Pick<User, "firstName" | "surname">>;
