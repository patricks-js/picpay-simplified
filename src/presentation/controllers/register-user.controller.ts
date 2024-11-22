import { UserType } from "@/domain/entities/user";
import { makeRegisterUserUseCase } from "@/infra/factories/make-register-user";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function registerUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    firstName: z.string().min(2),
    surname: z.string().min(2),
    email: z.string().email(),
    document: z.string().min(11).max(14),
    password: z.string(),
    type: z.enum(["Customer", "Merchant"]),
  });

  const body = bodySchema.parse(request.body);

  const registerUser = makeRegisterUserUseCase();

  const { user } = await registerUser.execute({
    ...body,
    type: UserType[body.type],
  });

  return reply.status(201).send({
    user,
  });
}