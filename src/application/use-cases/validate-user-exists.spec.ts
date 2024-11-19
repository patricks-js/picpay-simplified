import { beforeEach, describe, expect, it } from "vitest";

import { ValidateUserExists } from "@/application/use-cases/validate-user-exists";
import { UserType } from "@/domain/entities/user";
import type { IUserRepository } from "@/domain/repositories/user-repository";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";

describe("Use Case -> Validate User Exists", () => {
  let userRepository: IUserRepository;
  let sut: ValidateUserExists;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new ValidateUserExists(userRepository);
  });

  it("should return true if user exists by id", async () => {
    const user = await userRepository.create({
      firstName: "John",
      surname: "Doe",
      email: "john.doe@mail.com",
      document: "12345678900",
      passwordHash: "password",
      type: UserType.Customer,
    });

    const userExists = await sut.execute({ field: "id", value: user.id });

    expect(userExists).toBe(true);
  });

  it("should return true if user exists by email", async () => {
    const email = "john.doe@mail.com";
    userRepository.create({
      firstName: "John",
      surname: "Doe",
      document: "12345678900",
      passwordHash: "password",
      type: UserType.Customer,
      email,
    });

    const userExists = await sut.execute({ field: "email", value: email });

    expect(userExists).toBe(true);
  });

  it("should return true if user exists by document", async () => {
    const document = "12345678900";
    userRepository.create({
      firstName: "John",
      surname: "Doe",
      email: "john.doe@mail.com",
      passwordHash: "password",
      type: UserType.Customer,
      document,
    });

    const userExists = await sut.execute({
      field: "document",
      value: document,
    });

    expect(userExists).toBe(true);
  });

  it("should return false if user not found", async () => {
    const document = "12345678900";

    const userExists = await sut.execute({
      field: "document",
      value: document,
    });

    expect(userExists).toBe(false);
  });
});
