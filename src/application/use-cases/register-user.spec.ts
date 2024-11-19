import bcrypt from "bcryptjs";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { UserAlreadyExistsError } from "@/application/errors/user-already-exists";
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

  afterAll(() => {
    vi.resetAllMocks();
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

  it("should be able to register a new user as a merchant", async () => {
    // Arrange
    const insertUser = {
      firstName: "John",
      surname: "Doe",
      email: "john.doe@mail.com",
      document: "12345678911",
      password: "password",
      type: UserType.Merchant,
    };

    // Act
    const { user } = await sut.execute(insertUser);

    // Assertion
    expect(user.type).toEqual(UserType.Merchant);
    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it("should ensure that user's password is encrypted", async () => {
    // Arrange
    const spy = vi.spyOn(bcrypt, "hash");
    const bcryptRegex = /^\$2[aby]\$.{56}$/;
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
    expect(user).toEqual(
      expect.objectContaining({
        passwordHash: expect.stringMatching(bcryptRegex),
      }),
    );
    expect(spy).toHaveBeenCalledOnce();
  });

  it("should throw an error if user already exists with same email", async () => {
    // Arrange
    userRepository.create({
      firstName: "John 2",
      surname: "Doe 2",
      email: "john.doe@mail.com",
      document: "12345678900",
      passwordHash: "password",
      type: UserType.Customer,
    });
    const insertUser = {
      firstName: "John",
      surname: "Doe",
      email: "john.doe@mail.com",
      document: "12345678911",
      password: "password",
      type: UserType.Customer,
    };

    // Act
    await expect(sut.execute(insertUser)).rejects.toThrow(
      UserAlreadyExistsError,
    );
  });

  it("should throw an error if user already exists with same document (CPF/CNPJ)", async () => {
    // Arrange
    userRepository.create({
      firstName: "John 2",
      surname: "Doe 2",
      email: "john2.doe@mail.com",
      document: "12345678911",
      passwordHash: "password",
      type: UserType.Customer,
    });
    const insertUser = {
      firstName: "John",
      surname: "Doe",
      email: "john.doe@mail.com",
      document: "12345678911",
      password: "password",
      type: UserType.Customer,
    };

    // Act
    await expect(sut.execute(insertUser)).rejects.toThrow(
      UserAlreadyExistsError,
    );
  });
});
