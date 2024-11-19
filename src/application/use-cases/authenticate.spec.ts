import bcrypt from "bcryptjs";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { InvalidCredentialsError } from "@/application/errors/invalid-credentials";
import type { IGenerateTokenGateway } from "@/application/gateways/generate-token-gateway";
import { AuthenticateUseCase } from "@/application/use-cases/authenticate";
import { UserType } from "@/domain/entities/user";
import type { IUserRepository } from "@/domain/repositories/user-repository";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";

const mockGenerateTokenGateway: IGenerateTokenGateway = {
  execute: vi.fn().mockResolvedValue({ token: "token" }),
};

describe("Use Case -> Authenticate Use Case", () => {
  let userRepository: IUserRepository;
  let generateTokenGateway: IGenerateTokenGateway;
  let sut: AuthenticateUseCase;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    generateTokenGateway = mockGenerateTokenGateway;
    sut = new AuthenticateUseCase(userRepository, generateTokenGateway);

    const passwordHash = await bcrypt.hash("password", 7);

    userRepository.create({
      firstName: "John",
      surname: "Doe",
      email: "john.doe@mail.com",
      document: "12345678900",
      passwordHash,
      type: UserType.Customer,
    });
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("should be able to authenticate a user successful", async () => {
    const data = {
      email: "john.doe@mail.com",
      password: "password",
    };

    const { user, token } = await sut.execute(data);

    expect(user).toHaveProperty("id");
    expect(token).toEqual(expect.any(String));
    expect(mockGenerateTokenGateway.execute).toHaveBeenCalledOnce();
  });

  it("should throw an error if email is incorrect", async () => {
    const data = {
      email: "wrong_email@mail.com",
      password: "password",
    };

    await expect(sut.execute(data)).rejects.toThrow(InvalidCredentialsError);
  });

  it("should throw an error if password is incorrect", async () => {
    const data = {
      email: "john.doe@mail.com",
      password: "wrong_password",
    };

    await expect(sut.execute(data)).rejects.toThrow(InvalidCredentialsError);
  });
});
