import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

import { InvalidCredentialsError } from "@/application/errors/invalid-credentials";
import { ResourceNotFoundError } from "@/application/errors/resource-not-found";
import { UserAlreadyExistsError } from "@/application/errors/user-already-exists";

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ZodError) {
    return badRequest(
      reply,
      `Validation Error: ${JSON.stringify(error.flatten().fieldErrors)}`,
    );
  }

  if (error instanceof InvalidCredentialsError) {
    return badRequest(reply, error.message);
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({
      statusCode: 404,
      error: error.name,
      message: error.message,
    });
  }

  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({
      statusCode: 409,
      error: error.name,
      message: error.message,
    });
  }

  if (error)
    return reply.status(500).send({
      statusCode: 500,
      error: "InternalServerError",
      message: `Internal Server Error: ${error.message}`,
    });
}

function badRequest(reply: FastifyReply, message: string) {
  return reply.status(400).send({
    statusCode: 400,
    error: "BadRequestError",
    message,
  });
}
