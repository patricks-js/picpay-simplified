import type {
  CreateUserParams,
  UpdateUserParams,
  User,
} from "@/domain/entities/user";
import type { IRepository } from "@/domain/interfaces/repository";

export interface IUserRepository
  extends IRepository<User, string, CreateUserParams, UpdateUserParams> {
  findBy(params: UserFindByParams): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByDocument(document: string): Promise<User | null>;
}

type UserFindByField = keyof Pick<User, "id" | "email" | "document">;

export interface UserFindByParams {
  field: UserFindByField;
  value: User[UserFindByField];
}
