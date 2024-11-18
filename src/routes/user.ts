import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyJwt } from "@/middlewares/verify-jwt";
import bcrypt from "bcryptjs";
import { eq, or, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import * as jose from "jose";
import { z } from "zod";

export async function userRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        body: z.object({
          firstName: z.string(),
          surname: z.string(),
          email: z.string().email(),
          document: z.string().min(11).max(14),
          password: z.string(),
          role: z.enum(["customer", "merchant"]),
        }),
      },
    },
    async (request, reply) => {
      const { firstName, surname, email, document, password, role } =
        request.body;

      const [userAlreadyExists] = await db
        .select({ id: users.id })
        .from(users)
        .where(or(eq(users.email, email), eq(users.document, document)));

      if (userAlreadyExists) {
        return reply.status(409).send({
          statusCode: 409,
          error: "UserAlreadyExistsError",
          message: "User already exists.",
        });
      }

      const passwordHash = await bcrypt.hash(password, 7);

      const [user] = await db
        .insert(users)
        .values({
          firstName,
          surname,
          email,
          document,
          passwordHash,
          role,
        })
        .returning({
          id: users.id,
          createdAt: users.createdAt,
        });

      if (!user) {
        return reply.status(500).send({
          statusCode: 500,
          error: "ServerError",
          message: "Something went wrong.",
        });
      }

      return reply.status(201).send({ user });
    },
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    "/authenticate",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const [user] = await db
        .select({
          id: users.id,
          fullName: sql /*sql*/`first_name || ' ' || surname`,
          email: users.email,
          role: users.role,
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
        role: user.role,
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
    },
  );

  app.withTypeProvider<ZodTypeProvider>().patch(
    "/:userId/balance",
    {
      onRequest: [verifyJwt],
      schema: {
        body: z.object({
          amount: z.number().positive(),
        }),
        params: z.object({
          userId: z.coerce.number().int().positive(),
        }),
      },
    },
    async (request, reply) => {
      const { userId } = request.params;
      const { amount } = request.body;

      const [user] = await db
        .select({
          balance: users.balance,
        })
        .from(users)
        .where(eq(users.id, userId));

      if (!user) {
        return reply.status(404).send({
          statusCode: 404,
          error: "NotFoundError",
          message: "User not found.",
        });
      }

      const updatedBalance = Number(user.balance) + amount;

      const [userUpdated] = await db
        .update(users)
        .set({ balance: String(updatedBalance) })
        .where(eq(users.id, userId))
        .returning({
          balance: users.balance,
        });

      return {
        balance: userUpdated?.balance,
      };
    },
  );

  app.get("/", { onRequest: [verifyJwt] }, async () => {
    const returnedUsers = await db
      .select({
        id: users.id,
        fullName: sql /*sql*/`first_name || ' ' || surname`,
        email: users.email,
        balance: users.balance,
        role: users.role,
      })
      .from(users);

    return {
      users: returnedUsers,
    };
  });
}
