import { db } from "@/infra/database/drizzle";
import { users } from "@/infra/database/drizzle/schema";
import { verifyJwt } from "@/middlewares/verify-jwt";
import { registerUserController } from "@/presentation/controllers/register-user.controller";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import * as jose from "jose";
import { z } from "zod";

export async function userRoutes(app: FastifyInstance) {
  app.post("/register", registerUserController);

  app.post("/authenticate", async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const [user] = await db
      .select({
        id: users.id,
        fullName: sql /*sql*/`first_name || ' ' || surname`,
        email: users.email,
        type: users.type,
        password: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      return reply.status(400).send({
        statusCode: 400,
        error: "InvalidCredentialsError",
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return reply.status(400).send({
        statusCode: 400,
        error: "InvalidCredentialsError",
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      type: user.type,
    };

    const protectedHeader = {
      alg: "HS256",
      typ: "JWT",
    };

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader(protectedHeader)
      .setIssuedAt()
      .setIssuer("urn:example:issuer")
      .setAudience("urn:example:audience")
      .setExpirationTime("15m")
      .sign(
        new TextEncoder().encode(
          "Yzo59+j8crfIEsR91hiBQBNSGdUx2uwmI+ZSa8fRtb8=",
        ),
      );

    return {
      token: jwt,
    };
  });

  app.get("/", { onRequest: [verifyJwt] }, async () => {
    const returnedUsers = await db
      .select({
        id: users.id,
        fullName: sql /*sql*/`first_name || ' ' || surname`,
        email: users.email,
        type: users.type,
      })
      .from(users);

    return {
      users: returnedUsers,
    };
  });
}
