import { RegisterUserUseCase } from "@/application/use-cases/register-user";
import { DrizzleUserRepository } from "../repositories/drizzle/drizzle-user-repository";

export function makeRegisterUserUseCase(): RegisterUserUseCase {
  const userRepository = new DrizzleUserRepository();
  return new RegisterUserUseCase(userRepository);
}
