import { makeAuthenticateUseCase } from "@/infra/factories/make-authenticate";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const body = bodySchema.parse(request.body);

  const authenticate = makeAuthenticateUseCase();

  const { user, token } = await authenticate.execute(body);

  return {
    token,
    user,
  };
}
