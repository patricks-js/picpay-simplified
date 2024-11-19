import type { UseCase } from "@/domain/interfaces/use-case";
import type {
  IUserRepository,
  UserFindByParams,
} from "@/domain/repositories/user-repository";

export type ValidateUserExistsInput = UserFindByParams;

export class ValidateUserExists
  implements UseCase<ValidateUserExistsInput, boolean>
{
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: ValidateUserExistsInput): Promise<boolean> {
    const user = await this.userRepository.findBy(input);

    return !!user;
  }
}
