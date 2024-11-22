import bcrypt from "bcryptjs";

import { InvalidCredentialsError } from "@/application/errors/invalid-credentials";
import type { IGenerateTokenGateway } from "@/application/gateways/generate-token-gateway";
import type { User } from "@/domain/entities/user";
import type { UseCase } from "@/domain/interfaces/use-case";
import type { IUserRepository } from "@/domain/repositories/user-repository";

export interface AuthenticateInput {
  email: string;
  password: string;
}

export interface AuthenticateOutput {
  user: User;
  token: string;
}

export class AuthenticateUseCase
  implements UseCase<AuthenticateInput, AuthenticateOutput>
{
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly generateTokenGateway: IGenerateTokenGateway,
  ) {}

  async execute(input: AuthenticateInput): Promise<AuthenticateOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) throw new InvalidCredentialsError();

    const passwordMatch = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );
    if (!passwordMatch) throw new InvalidCredentialsError();

    const payload = {
      id: user.id,
      fullName: `${user.firstName} ${user.surname}`,
      email: user.email,
      type: user.type,
    };

    const { token } = await this.generateTokenGateway.execute(payload);

    return {
      user,
      token,
    };
  }
}
