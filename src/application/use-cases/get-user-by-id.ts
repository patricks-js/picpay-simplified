import type { User } from "@/domain/entities/user";
import type { UseCase } from "@/domain/interfaces/use-case";
import type { IUserRepository } from "@/domain/repositories/user-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found";

export type GetUserByIdInput = {
  id: string;
};

export type GetUserByIdOutput = {
  user: User;
};

export class GetUserByIdUseCase
  implements UseCase<GetUserByIdInput, GetUserByIdOutput>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserByIdInput): Promise<GetUserByIdOutput> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new ResourceNotFoundError("User");
    }

    return {
      user,
    };
  }
}
