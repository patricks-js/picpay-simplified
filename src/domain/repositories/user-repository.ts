import type {
  CreateUserParams,
  UpdateUserParams,
  User,
} from "@/domain/entities/user";
import type { IRepository } from "@/domain/interfaces/repository";

export interface IUserRepository
  extends IRepository<User, string, CreateUserParams, UpdateUserParams> {
  findByEmail(email: string): Promise<User | null>;
  findByDocument(document: string): Promise<User | null>;
}
