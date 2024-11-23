import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ResourceNotFoundError } from "@/application/errors/resource-not-found";
import type { IUserRepository } from "@/domain/repositories/user-repository";
import { InMemoryUserRepository } from "@/infra/repositories/in-memory/in-memory-user-repository";
import { GetUserByIdUseCase } from "./get-user-by-id";

describe("GetUserByIdUseCase", () => {
  let userRepository: IUserRepository;
  let getUserByIdUseCase: GetUserByIdUseCase;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should be able to return the user when found", async () => {
    const input = { id: "123" };

    userRepository.findById = vi.fn().mockResolvedValue({
      id: "123",
    });

    const { user } = await getUserByIdUseCase.execute(input);

    expect(user).toEqual(
      expect.objectContaining({
        id: "123",
      }),
    );
    expect(userRepository.findById).toHaveBeenCalledWith("123");
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  it("should throw ResourceNotFoundError when user is not found", async () => {
    const input = { id: "123" };

    userRepository.findById = vi.fn().mockResolvedValue(null);

    await expect(getUserByIdUseCase.execute(input)).rejects.toThrow(
      ResourceNotFoundError,
    );
    expect(userRepository.findById).toHaveBeenCalledWith("123");
    expect(userRepository.findById).toHaveBeenCalledOnce();
  });
});
