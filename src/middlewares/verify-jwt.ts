import type { FastifyReply, FastifyRequest } from "fastify";
import * as jose from "jose";

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  const jwt = request.headers.authorization?.split(" ")[1];

  if (!jwt) {
    return reply.status(401).send({
      statusCode: 401,
      error: "UnauthorizedError",
      message: "Unauthorized",
    });
  }

  const secret = new TextEncoder().encode(
    "Yzo59+j8crfIEsR91hiBQBNSGdUx2uwmI+ZSa8fRtb8=",
  );

  try {
    await jose.jwtVerify(jwt, secret, {
      issuer: "urn:example:issuer",
      audience: "urn:example:audience",
    });
  } catch (error) {
    return reply.status(401).send({
      statusCode: 401,
      error: "UnauthorizedError",
      message: "Unauthorized",
    });
  }
}
