import { beforeEach, describe, expect, it } from "vitest";

import { RegisterUserUseCase } from "@/application/use-cases/register-user";
import { UserType } from "@/domain/entities/user";
import type { IUserRepository } from "@/domain/repositories/user-repository";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";

describe("Use Case -> Register User", () => {
  let userRepository: IUserRepository;
  let sut: RegisterUserUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new RegisterUserUseCase(userRepository);
  });

  it("should be able to register a new user as a customer", async () => {
    // Arrange
    const insertUser = {
      firstName: "John",
      surname: "Doe",
      email: "john.doe@mail.com",
      document: "12345678911",
      password: "password",
      type: UserType.Customer,
    };

    // Act
    const { user } = await sut.execute(insertUser);

    // Assertion
    expect(user.type).toEqual(UserType.Customer);
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it.todo("should be able to register a new user as a merchant");
  it.todo("should ensure that user's password is encrypted");
  it.todo("should throw an error if user already exists with same email");
  it.todo(
    "should throw an error if user already exists with same document (CPF/CNPJ)",
  );
});
