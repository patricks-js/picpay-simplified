import { ValidateUserExists } from "@/application/use-cases/validate-user-exists";
import { DrizzleUserRepository } from "../repositories/drizzle/drizzle-user-repository";

export function makeValidateUserExists(): ValidateUserExists {
  const userRepository = new DrizzleUserRepository();
  return new ValidateUserExists(userRepository);
}
