import type { CreateUserParams, User } from "@/domain/entities/user";
import type { UseCase } from "@/domain/interfaces/use-case";
import type { IUserRepository } from "@/domain/repositories/user-repository";
import bcrypt from "bcryptjs";
import { UserAlreadyExistsError } from "../errors/user-already-exists";

export type RegisterUserInput = Omit<CreateUserParams, "passwordHash"> & {
  password: string;
};

export type RegisterUserOutput = {
  user: User;
};

export class RegisterUserUseCase
  implements UseCase<RegisterUserInput, RegisterUserOutput>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const [userByEmail, userByDocument] = await Promise.all([
      this.userRepository.findByEmail(input.email),
      this.userRepository.findByDocument(input.document),
    ]);

    const userFound = userByEmail || userByDocument;

    if (userFound) {
      throw new UserAlreadyExistsError();
    }

    const passwordHash = await bcrypt.hash(input.password, 7);

    const user = await this.userRepository.create({
      firstName: input.firstName,
      surname: input.surname,
      email: input.email,
      document: input.document,
      type: input.type,
      passwordHash,
    });

    return {
      user,
    };
  }
}
